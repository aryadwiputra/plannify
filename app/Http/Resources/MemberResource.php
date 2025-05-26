<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\UsersSingleResource;
use Illuminate\Http\Resources\Json\JsonResource;

class MemberResource extends JsonResource
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
            'memberable_id' => $this->memberable_id,
            'memberable_type' => $this->memberable_type,
            'role' => $this->role,
            'user' => new UsersSingleResource($this->user),
        ];
    }
}
