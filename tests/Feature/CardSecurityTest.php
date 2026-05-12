<?php

use App\Enums\CardPriority;
use App\Enums\CardStatus;
use App\Enums\WorkspaceVisibility;
use App\Models\Attachment;
use App\Models\Card;
use App\Models\Comment;
use App\Models\Member;
use App\Models\Task;
use App\Models\User;
use App\Models\Workspace;
use Spatie\Permission\Models\Role;

function makeWorkspace(User $user, string $name = 'Workspace'): Workspace
{
    return Workspace::create([
        'user_id' => $user->id,
        'name' => $name,
        'slug' => str($name)->slug() . '-' . fake()->unique()->numerify('####'),
        'cover' => 'workspaces/cover/test-cover.png',
        'logo' => 'workspaces/logo/test-logo.png',
        'visibility' => WorkspaceVisibility::PRIVATE->value,
    ]);
}

function makeCard(User $user, Workspace $workspace, string $title = 'Card'): Card
{
    return Card::create([
        'user_id' => $user->id,
        'workspace_id' => $workspace->id,
        'title' => $title,
        'description' => 'Test description',
        'deadline' => now()->addDay()->toDateString(),
        'order' => 1,
        'status' => CardStatus::TODO->value,
        'priority' => CardPriority::UNKNOWN->value,
    ]);
}

test('card owner is automatically added as member when card is created', function () {
    $user = User::factory()->create();
    $workspace = makeWorkspace($user, 'Owner Workspace');

    $card = makeCard($user, $workspace, 'Owner Card');

    $member = Member::query()
        ->where('user_id', $user->id)
        ->where('memberable_type', Card::class)
        ->where('memberable_id', $card->id)
        ->first();

    expect($member)->not->toBeNull();
    expect($member->role)->toBe('Owner');
});

test('non author cannot update a comment', function () {
    $author = User::factory()->create();
    $otherUser = User::factory()->create();
    $workspace = makeWorkspace($author, 'Comment Workspace');
    $card = makeCard($author, $workspace, 'Comment Card');
    $comment = Comment::create([
        'user_id' => $author->id,
        'card_id' => $card->id,
        'body' => 'Original comment',
    ]);

    $response = $this->actingAs($otherUser)->put(route('comments.update', [
        'card' => $card->id,
        'comment' => $comment->id,
    ]), [
        'body' => 'Hacked comment',
    ]);

    $response->assertForbidden();
    expect($comment->fresh()->body)->toBe('Original comment');
});

test('non author cannot delete a comment', function () {
    $author = User::factory()->create();
    $otherUser = User::factory()->create();
    $workspace = makeWorkspace($author, 'Delete Comment Workspace');
    $card = makeCard($author, $workspace, 'Delete Comment Card');
    $comment = Comment::create([
        'user_id' => $author->id,
        'card_id' => $card->id,
        'body' => 'Protected comment',
    ]);

    $response = $this->actingAs($otherUser)->delete(route('comments.destroy', [
        'card' => $card->id,
        'comment' => $comment->id,
    ]));

    $response->assertForbidden();
    expect(Comment::find($comment->id))->not->toBeNull();
});

test('task destroy returns 404 when task does not belong to given card', function () {
    $user = User::factory()->create();
    $workspace = makeWorkspace($user, 'Task Workspace');
    $cardA = makeCard($user, $workspace, 'Card A');
    $cardB = makeCard($user, $workspace, 'Card B');
    $task = Task::create([
        'user_id' => $user->id,
        'card_id' => $cardB->id,
        'title' => 'Foreign task',
    ]);

    $response = $this->actingAs($user)->delete(route('tasks.destroy', [
        'card' => $cardA->id,
        'task' => $task->id,
    ]));

    $response->assertNotFound();
    expect(Task::find($task->id))->not->toBeNull();
});

test('attachment destroy returns 404 when attachment does not belong to given card', function () {
    $user = User::factory()->create();
    $workspace = makeWorkspace($user, 'Attachment Workspace');
    $cardA = makeCard($user, $workspace, 'Card A');
    $cardB = makeCard($user, $workspace, 'Card B');
    $attachment = Attachment::create([
        'user_id' => $user->id,
        'card_id' => $cardB->id,
        'file' => 'attachments/test-file.png',
        'link' => null,
        'name' => 'Spec file',
    ]);

    $response = $this->actingAs($user)->delete(route('attachments.destroy', [
        'card' => $cardA->id,
        'attachment' => $attachment->id,
    ]));

    $response->assertNotFound();
    expect(Attachment::find($attachment->id))->not->toBeNull();
});

test('member card destroy returns 404 when member record belongs to another card', function () {
    $owner = User::factory()->create();
    $memberUser = User::factory()->create();
    $workspace = makeWorkspace($owner, 'Member Workspace');
    $cardA = makeCard($owner, $workspace, 'Card A');
    $cardB = makeCard($owner, $workspace, 'Card B');

    $member = $cardB->members()->create([
        'user_id' => $memberUser->id,
        'role' => 'Member',
    ]);

    $response = $this->actingAs($owner)->delete(route('member_card.destroy', [
        'card' => $cardA->id,
        'member' => $member->id,
    ]));

    $response->assertNotFound();
    expect(Member::find($member->id))->not->toBeNull();
});

test('author can create update and delete a comment', function () {
    $author = User::factory()->create();
    $workspace = makeWorkspace($author, 'Happy Comment Workspace');
    $card = makeCard($author, $workspace, 'Happy Comment Card');

    $createResponse = $this->actingAs($author)->post(route('comments.store', [
        'card' => $card->id,
    ]), [
        'body' => 'Initial comment body',
    ]);

    $createResponse->assertRedirect();
    $comment = Comment::query()->where('card_id', $card->id)->latest('id')->first();
    expect($comment)->not->toBeNull();
    expect($comment->body)->toBe('Initial comment body');

    $updateResponse = $this->actingAs($author)->put(route('comments.update', [
        'card' => $card->id,
        'comment' => $comment->id,
    ]), [
        'body' => 'Updated comment body',
    ]);

    $updateResponse->assertRedirect();
    expect($comment->fresh()->body)->toBe('Updated comment body');

    $deleteResponse = $this->actingAs($author)->delete(route('comments.destroy', [
        'card' => $card->id,
        'comment' => $comment->id,
    ]));

    $deleteResponse->assertRedirect();
    expect(Comment::find($comment->id))->toBeNull();
});

test('user can quick create a card from workspace board flow', function () {
    $owner = User::factory()->create();
    $workspace = makeWorkspace($owner, 'Quick Create Workspace');

    $response = $this->actingAs($owner)->post(route('cards.store', [
        'workspace' => $workspace->slug,
    ]), [
        'title' => 'Quick create card',
        'description' => '',
        'deadline' => now()->addDays(2)->toDateString(),
        'status' => CardStatus::TODO->value,
        'priority' => CardPriority::UNKNOWN->value,
    ]);

    $response->assertRedirect(route('workspaces.show', $workspace, false));

    $card = Card::query()
        ->where('workspace_id', $workspace->id)
        ->where('title', 'Quick create card')
        ->first();

    expect($card)->not->toBeNull();
    expect($card->status->value)->toBe(CardStatus::TODO->value);
    expect($card->priority->value)->toBe(CardPriority::UNKNOWN->value);

    $ownerMembership = Member::query()
        ->where('user_id', $owner->id)
        ->where('memberable_type', Card::class)
        ->where('memberable_id', $card->id)
        ->first();

    expect($ownerMembership)->not->toBeNull();
    expect($ownerMembership->role)->toBe('Owner');
});


test('admin can update and delete another users comment', function () {
    $author = User::factory()->create();
    $admin = User::factory()->create();
    Role::findOrCreate('admin');
    $admin->assignRole('admin');

    $workspace = makeWorkspace($author, 'Admin Comment Workspace');
    $card = makeCard($author, $workspace, 'Admin Comment Card');
    $comment = Comment::create([
        'user_id' => $author->id,
        'card_id' => $card->id,
        'body' => 'Author owned comment',
    ]);

    $updateResponse = $this->actingAs($admin)->put(route('comments.update', [
        'card' => $card->id,
        'comment' => $comment->id,
    ]), [
        'body' => 'Admin updated comment',
    ]);

    $updateResponse->assertRedirect();
    expect($comment->fresh()->body)->toBe('Admin updated comment');

    $deleteResponse = $this->actingAs($admin)->delete(route('comments.destroy', [
        'card' => $card->id,
        'comment' => $comment->id,
    ]));

    $deleteResponse->assertRedirect();
    expect(Comment::find($comment->id))->toBeNull();
});

test('card owner can update card through board issue flow', function () {
    $owner = User::factory()->create();
    $workspace = makeWorkspace($owner, 'Update Workspace');
    $card = makeCard($owner, $workspace, 'Before Update');

    $response = $this->actingAs($owner)->put(route('cards.update', [
        'workspace' => $workspace->slug,
        'card' => $card->id,
    ]), [
        'title' => 'After Update',
        'description' => 'Updated description',
        'deadline' => now()->addDays(3)->toDateString(),
        'status' => CardStatus::INPROGRESS->value,
        'priority' => CardPriority::HIGH->value,
    ]);

    $response->assertRedirect();

    $updated = $card->fresh();
    expect($updated->title)->toBe('After Update');
    expect($updated->description)->toBe('Updated description');
    expect($updated->status->value)->toBe(CardStatus::INPROGRESS->value);
    expect($updated->priority->value)->toBe(CardPriority::HIGH->value);
});
