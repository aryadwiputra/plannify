<?php

namespace Database\Seeders;

use App\Models\Card;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('username', 'arya')->first() ?? User::first();
        $cards = Card::all();

        if (! $user || $cards->isEmpty()) {
            $this->command->warn('Tidak ada user/card, lewati CommentSeeder.');
            return;
        }

        $comments = [
            'Desain landing page' => [
                'Palet warna yang dipakai sudah sesuai dengan identitas brand.',
                'Bisa ditambahkan animasi halus di hero section.',
                'Sudah saya review, layout-nya sudah rapi. Lanjut ke desain portfolio.',
            ],
            'Setup domain & hosting' => [
                'DNS sudah terpropagasi, website live.',
                'Jangan lupa setup SSL.',
            ],
            'Desain logo baru' => [
                'Konsep pertama paling menarik menurut saya.',
                'Tolong revisi konsep 2 dengan warna lebih bold.',
            ],
            'Kalender konten bulanan' => [
                'Kalender sudah selesai, siap didistribusikan.',
            ],
        ];

        foreach ($comments as $cardTitle => $list) {
            $card = $cards->firstWhere('title', $cardTitle);
            if (! $card) {
                continue;
            }

            foreach ($list as $body) {
                Comment::create([
                    'user_id' => $user->id,
                    'card_id' => $card->id,
                    'body' => $body,
                ]);
            }

            $this->command->info("Comment untuk {$cardTitle}: " . count($list) . ' komentar');
        }
    }
}
