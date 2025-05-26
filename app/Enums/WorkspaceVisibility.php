<?php

namespace App\Enums;

enum WorkspaceVisibility: string
{
    case PRIVATE = 'Private';
    case PUBLIC = 'Public';

    public static function options(): array
    {
        return collect(self::cases())->map(fn($item) => [
            'value' => $item->value,
            'label' => $item->name
        ])->values()->toArray();
    }
}
