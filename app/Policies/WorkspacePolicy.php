<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Workspace;
use Illuminate\Auth\Access\Response;

class WorkspacePolicy
{
    public function update_workspace(User $user, Workspace $workspace): bool
    {
        return $user->id === $workspace->user_id;
    }

    public function delete_workspace(User $user, Workspace $workspace): bool
    {
        return $user->id === $workspace->user_id;
    }

    public function member_workspace(User $user, Workspace $workspace): bool
    {
        return $user->id === $workspace->user_id;
    }
}
