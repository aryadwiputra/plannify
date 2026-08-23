<?php

namespace Database\Seeders;

use App\Models\Attachment;
use App\Models\Card;
use App\Models\User;
use Illuminate\Database\Seeder;

class AttachmentSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('username', 'arya')->first() ?? User::first();
        $cards = Card::all();

        if (! $user || $cards->isEmpty()) {
            $this->command->warn('Tidak ada user/card, lewati AttachmentSeeder.');
            return;
        }

        $attachments = [
            'Desain landing page' => [
                ['name' => 'Wireframe Landing Page', 'link' => 'https://www.figma.com/design/wireframe-landing'],
                ['name' => 'Referensi Desain', 'link' => 'https://dribbble.com/shots/landing-page'],
            ],
            'Setup domain & hosting' => [
                ['name' => 'Dokumentasi Deploy', 'link' => 'https://docs.example.com/deploy'],
            ],
            'Desain logo baru' => [
                ['name' => 'Konsep Logo V1', 'link' => 'https://www.figma.com/design/logo-v1'],
                ['name' => 'Konsep Logo V2', 'link' => 'https://www.figma.com/design/logo-v2'],
                ['name' => 'Konsep Logo V3', 'link' => 'https://www.figma.com/design/logo-v3'],
            ],
            'Riset keyword SEO' => [
                ['name' => 'Daftar Keyword', 'link' => 'https://docs.google.com/spreadsheets/keyword'],
            ],
        ];

        foreach ($attachments as $cardTitle => $list) {
            $card = $cards->firstWhere('title', $cardTitle);
            if (! $card) {
                continue;
            }

            foreach ($list as $a) {
                Attachment::create([
                    'user_id' => $user->id,
                    'card_id' => $card->id,
                    'name' => $a['name'],
                    'link' => $a['link'],
                    'file' => null,
                ]);
            }

            $this->command->info("Attachment untuk {$cardTitle}: " . count($list) . ' lampiran');
        }
    }
}
