<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkspaceSidebarResource extends JsonResource
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
            'memberable' => [
                'id' => $this->memberable->id,
                'name' => $this->memberable->name,
                'slug' => $this->memberable->slug,
                'created_at' => $this->memberable->created_at->format('d M Y')
            ],
            'name' =>  $this->name,
            'slug' => $this->slug,
        ];
    }
}
