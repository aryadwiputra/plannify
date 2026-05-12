<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\Comment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CommentController extends Controller
{
    public function store(Card $card, Request $request): RedirectResponse
    {
        Gate::authorize('task_card', $card);

        $request->validate([
            'body' => ['required', 'string', 'max:5000'],
        ]);

        $request->user()->comments()->create([
            'card_id' => $card->id,
            'body' => $request->body,
        ]);

        flashMessage('Comment added successfully');

        return back();
    }

    public function update(Card $card, Comment $comment, Request $request): RedirectResponse
    {
        abort_unless($comment->card_id === $card->id, 404);
        Gate::authorize('update_comment', $comment);

        $request->validate([
            'body' => ['required', 'string', 'max:5000'],
        ]);

        $comment->update([
            'body' => $request->body,
        ]);

        flashMessage('Comment updated successfully');

        return back();
    }

    public function destroy(Card $card, Comment $comment): RedirectResponse
    {
        abort_unless($comment->card_id === $card->id, 404);
        Gate::authorize('delete_comment', $comment);

        $comment->delete();

        flashMessage('Comment deleted successfully');

        return back();
    }
}
