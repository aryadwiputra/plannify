<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'body' => $this->body,
            'created_at' => $this->created_at?->format('d M Y H:i'),
            'user' => new UsersSingleResource($this->user),
            'can' => [
                'update_comment' => $request->user()?->can('update_comment', $this->resource) ?? false,
                'delete_comment' => $request->user()?->can('delete_comment', $this->resource) ?? false,
            ],
        ];
    }
}
