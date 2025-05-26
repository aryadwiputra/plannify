<?php

namespace App\Observers;

use App\Models\Workspace;

class WorkspaceObserver
{
    public function craeted(Workspace $workspace)
    {
        $workspace->members()->create([
            'user_id' => request()->user()->id,
            'role' => $workspace->user_id == request()->user()->id ? 'Owner' : 'Member',
        ]);
    }

    public function deleted(Workspace $workspace)
    {
        $workspace->members()->delete();
    }
}
