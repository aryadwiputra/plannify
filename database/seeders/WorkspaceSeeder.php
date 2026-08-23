<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Workspace;
use App\Enums\WorkspaceVisibility;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class WorkspaceSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('username', 'arya')->first() ?? User::first();

        if (! $user) {
            $this->command->warn('Tidak ada user, lewati WorkspaceSeeder.');
            return;
        }

        $workspaces = [
            [
                'name' => 'Website Portfolio',
                'cover' => '1517180102446-f3ece451e9d8',
                'logo' => '1461749280684-dccba630e2f6',
                'visibility' => WorkspaceVisibility::PUBLIC->value,
            ],
            [
                'name' => 'Konten Marketing',
                'cover' => '1460925895917-afdab827c52f',
                'logo' => '1432888498266-38ffec3eaf0a',
                'visibility' => WorkspaceVisibility::PRIVATE->value,
            ],
            [
                'name' => 'Rebrand Produk',
                'cover' => '1558655146-9f40138edfeb',
                'logo' => '1561070791-2526d30994b5',
                'visibility' => WorkspaceVisibility::PRIVATE->value,
            ],
            [
                'name' => 'Riset & Pengembangan',
                'cover' => '1531482615713-2afd69097998',
                'logo' => '1507413245164-6160d8298b31',
                'visibility' => WorkspaceVisibility::PUBLIC->value,
            ],
        ];

        foreach ($workspaces as $w) {
            $cover = $this->downloadImage('workspaces/cover', $w['name'], $w['cover']);
            $logo = $this->downloadImage('workspaces/logo', $w['name'], $w['logo']);

            $workspace = Workspace::updateOrCreate(
                ['slug' => Str::slug($w['name'])],
                [
                    'user_id' => $user->id,
                    'name' => $w['name'],
                    'slug' => Str::slug($w['name']),
                    'cover' => $cover,
                    'logo' => $logo,
                    'visibility' => $w['visibility'],
                ]
            );

            $this->command->info("Workspace: {$workspace->name}");
        }
    }

    private function downloadImage(string $folder, string $name, string $photoId): string
    {
        $path = $folder . '/' . Str::slug($name) . '.jpg';

        if (Storage::disk('public')->exists($path)) {
            return $path;
        }

        $url = "https://images.unsplash.com/photo-{$photoId}?auto=format&fit=crop&w=1600&q=80";

        $response = Http::withHeaders(['User-Agent' => 'Plannify Seeder/1.0'])
            ->timeout(30)
            ->retry(2, 500, throw: false)
            ->get($url);

        if (! $response->successful()) {
            $fallback = 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=1600&q=80';
            $response = Http::withHeaders(['User-Agent' => 'Plannify Seeder/1.0'])
                ->timeout(30)
                ->get($fallback);
        }

        if ($response->successful()) {
            Storage::disk('public')->put($path, $response->body());
        }

        return $path;
    }
}
