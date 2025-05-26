<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\MemberResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkspaceResource extends JsonResource
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
            'name' => $this->name,
            'slug' => $this->slug,
            'visibility' => $this->visibility,
            'cover' => Storage::url($this->cover),
            'logo' => Storage::url($this->logo),
            'members' => MemberResource::collection($this->members),
            'can' => [
                'edit_workspace' => auth()->user()->can('update_workspace', $this->resource),
                'invite_workspace' => auth()->user()->can('member_workspace', $this->resource),
                'delete_workspace' => auth()->user()->can('delete_workspace', $this->resource),
            ]
        ];
    }
}
