<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Response;
use App\Models\Member;
use App\Traits\HasFile;
use App\Enums\CardStatus;
use App\Models\Workspace;
use Illuminate\Http\Request;
use App\Enums\WorkspaceVisibility;
use App\Http\Resources\CardResource;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\WorkspaceRequest;
use App\Http\Resources\WorkspaceResource;
use Illuminate\Support\Facades\Gate;

class WorkspaceController extends Controller
{
    use HasFile;

    public function create(): Response
    {
        return inertia('Workspaces/Create', [
            'page_settings' => [
                'title' => 'Create Workspace',
                'subtitle' => 'Fill out this form to add a new workspace',
                'method' => 'POST',
                'action' => route('workspaces.store')
            ],
            'visibilities' => WorkspaceVisibility::options()
        ]);
    }

    public function store(WorkspaceRequest $request): RedirectResponse
    {
        $workspace = $request->user()->workspaces()->create([
            'name' => $name = $request->name,
            'slug' => str()->slug($name, str()->uuid(10)),
            'cover' => $this->upload_file($request, 'cover', 'workspaces/cover'),
            'logo' => $this->upload_file($request, 'logo', 'workspaces/logo'),
            'visibility' => $request->visibility
        ]);

        flashMessage('Workspace information saved successfully');

        return to_route('workspaces.show', $workspace);
    }

    public function show(Workspace $workspace): Response
    {
        return inertia(component: 'Workspaces/Show', props: [
            'cards' => fn() =>  CardResource::collection($workspace->load([
                'cards' => fn($q) => $q->withCount(['tasks', 'members', 'attachments'])->with([
                    'attachments',
                    'members',
                    'tasks' => fn($task) => $task->withCount('children')
                ])->orderBy('order'),
            ])->cards),
            'workspace' => fn() => new WorkspaceResource($workspace),
            'page_settings' => [
                'title' => $workspace->name,
            ],
            'statuses' => fn() => CardStatus::options(),
        ]);
    }

    public function edit(Workspace $workspace): Response
    {
        Gate::authorize('update_workspace', $workspace);

        return inertia(component: 'Workspaces/Setting', props: [
            'workspace' => fn() => new WorkspaceResource($workspace->load('members')),
            'page_settings' => [
                'title' => 'Ediit Workspace',
                'subtitle' => 'Fill out this form to edit workspace',
                'method' => 'PUT',
                'action' => route('workspaces.update', $workspace),
            ],
            'visibilities' => WorkspaceVisibility::options(),
        ]);
    }

    public function update(Workspace $workspace, WorkspaceRequest $request): RedirectResponse
    {
        Gate::authorize('update_workspace', $workspace);

        $workspace->update([
            'name' => $name = $request->name,
            'slug' => str()->slug($name . str()->uuid(10)),
            'cover' => $request->hasFile('cover') ? $this->upload_file($request, 'cover', 'workspaces/cover') : $workspace->cover,
            'logo' => $request->hasFile('logo') ? $this->upload_file($request, 'logo', 'workspaces/logo') : $workspace->logo,
            'visibility' => $request->visibility,
        ]);

        flashMessage('Successfully updated workspace');

        return to_route('workspaces.show', $workspace);
    }

    public function destroy(Workspace $workspace): RedirectResponse
    {
        $this->delete_file($workspace, 'cover');
        $this->delete_file($workspace, 'logo');

        $workspace->delete();

        flashMessage('The workspace has been successfully deleted');

        return to_route('dashboard');
    }

    public function member_store(Workspace $workspace, Request $request): RedirectResponse
    {
        Gate::authorize('member_workspace', $workspace);

        $request->validate([
            'email' => [
                'required',
                'email',
                'string'
            ]
        ]);

        $user = User::query()->where('email', $request->email)->first();
        if (!$user) {
            flashMessage('Unregistered user.', 'error');
            return back();
        }

        if ($workspace->members()->where('user_id', $user->id)->exists()) {
            flashMessage('User is already a member of this workspace', 'error');
            return back();
        }

        $workspace->members()->create([
            'user_id' => $user->id,
            'role' => 'Member',
        ]);

        flashMessage('Member successfully invited');
        return back();
    }

    public function member_destroy(Workspace $workspace, Member $member): RedirectResponse
    {
        Gate::authorize('delete_workspace', $workspace);

        $member->delete();

        flashMessage('Member successfully deleted');

        return back();
    }
}
