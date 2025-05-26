<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Http\Resources\TaskResource;
use App\Http\Resources\MemberResource;
use Illuminate\Http\Resources\Json\JsonResource;

class CardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'title' => $this->title,
            'workspace_id' => $this->workspace_id,
            'description' => $this->description,
            'status' => $this->status,
            'priority' => $this->priority,
            'created_at' => $this->created_at->format('d M Y'),
            'deadline' => $this->deadline ? (int) Carbon::now()->diffInDays(Carbon::createFromFormat('Y-m-d', $this->deadline)) : null,
            'members' => MemberResource::collection($this->members),
            'members_count' => $this->members_count,
            'attachments' => $this->attachments,
            'attachments_count' => $this->attachments_count,
            'has_attachment' => $this->attachments()->exists(),
            'tasks' => TaskResource::collection($this->tasks),
            'has_task' => $this->tasks()->exists(),
            'tasks_count' => $tasks_count = $this->tasks_count,
            'percentage' => $tasks_count > 0
                ? round(($this->tasks->where('is_completed', true)->count() / $tasks_count) * 100)
                : 0,
            'can' => [
                'edit_card' => $request->user()->can('edit_card', $this->resource),
                'delete_card' => $request->user()->can('delete_card', $this->resource),
                'member_card' => $request->user()->can('member_card', $this->resource),
                'task_card' => $request->user()->can('task_card', $this->resource),
            ]
        ];
    }
}
