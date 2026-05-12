<?php

namespace App\Observers;

use App\Models\Workspace;

class WorkspaceObserver
{
    public function created(Workspace $workspace)
    {
        $workspace->members()->create([
            'user_id' => $workspace->user_id,
            'role' => 'Owner',
        ]);
    }

    public function deleted(Workspace $workspace)
    {
        $workspace->members()->delete();
    }
}
