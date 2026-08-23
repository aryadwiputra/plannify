<?php

namespace Database\Seeders;

use App\Models\Card;
use App\Models\User;
use App\Models\Workspace;
use App\Enums\CardStatus;
use App\Enums\CardPriority;
use Illuminate\Database\Seeder;

class CardSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('username', 'arya')->first() ?? User::first();
        $workspaces = Workspace::all();

        if (! $user || $workspaces->isEmpty()) {
            $this->command->warn('Tidak ada user/workspace, lewati CardSeeder.');
            return;
        }

        $cards = [
            'Website Portfolio' => [
                ['title' => 'Desain landing page', 'description' => 'Buat desain landing page portfolio dengan tema modern dan minimalis.', 'status' => CardStatus::DONE->value, 'priority' => CardPriority::HIGH->value, 'deadline' => '2026-08-30'],
                ['title' => 'Setup domain & hosting', 'description' => 'Konfigurasi domain aryadwip.com dan deploy ke VPS.', 'status' => CardStatus::DONE->value, 'priority' => CardPriority::URGENT->value, 'deadline' => '2026-08-25'],
                ['title' => 'Tulis konten section About', 'description' => 'Tulis profil singkat dan keahlian untuk section About.', 'status' => CardStatus::INPROGRESS->value, 'priority' => CardPriority::MEDIUM->value, 'deadline' => '2026-09-05'],
                ['title' => 'Optimasi SEO & performa', 'description' => 'Optimasi meta tag, image compression, dan lazy loading.', 'status' => CardStatus::TODO->value, 'priority' => CardPriority::LOW->value, 'deadline' => '2026-09-10'],
                ['title' => 'Integrasi form kontak', 'description' => 'Buat form kontak yang terhubung ke email.', 'status' => CardStatus::ONREVIEW->value, 'priority' => CardPriority::MEDIUM->value, 'deadline' => '2026-09-08'],
            ],
            'Konten Marketing' => [
                ['title' => 'Kalender konten bulanan', 'description' => 'Susun kalender konten untuk media sosial selama sebulan.', 'status' => CardStatus::DONE->value, 'priority' => CardPriority::HIGH->value, 'deadline' => '2026-08-28'],
                ['title' => 'Desain visual feed Instagram', 'description' => 'Buat template visual yang konsisten untuk feed.', 'status' => CardStatus::INPROGRESS->value, 'priority' => CardPriority::MEDIUM->value, 'deadline' => '2026-09-03'],
                ['title' => 'Riset keyword SEO', 'description' => 'Riset keyword yang relevan untuk artikel blog.', 'status' => CardStatus::TODO->value, 'priority' => CardPriority::HIGH->value, 'deadline' => '2026-09-12'],
                ['title' => 'Draft artikel blog mingguan', 'description' => 'Tulis 2 artikel blog per minggu.', 'status' => CardStatus::TODO->value, 'priority' => CardPriority::MEDIUM->value, 'deadline' => '2026-09-15'],
            ],
            'Rebrand Produk' => [
                ['title' => 'Riset kompetitor', 'description' => 'Analisis branding kompetitor di industri yang sama.', 'status' => CardStatus::DONE->value, 'priority' => CardPriority::HIGH->value, 'deadline' => '2026-08-20'],
                ['title' => 'Desain logo baru', 'description' => 'Buat 3 konsep logo baru untuk dipilih.', 'status' => CardStatus::INPROGRESS->value, 'priority' => CardPriority::URGENT->value, 'deadline' => '2026-09-02'],
                ['title' => 'Pilih palet warna', 'description' => 'Tentukan palet warna baru yang sesuai dengan identitas brand.', 'status' => CardStatus::ONREVIEW->value, 'priority' => CardPriority::MEDIUM->value, 'deadline' => '2026-09-06'],
                ['title' => 'Update materi promosi', 'description' => 'Perbarui semua materi promosi dengan branding baru.', 'status' => CardStatus::TODO->value, 'priority' => CardPriority::LOW->value, 'deadline' => '2026-09-20'],
            ],
            'Riset & Pengembangan' => [
                ['title' => 'Evaluasi fitur aplikasi', 'description' => 'Kumpulkan feedback user dan evaluasi fitur yang ada.', 'status' => CardStatus::INPROGRESS->value, 'priority' => CardPriority::HIGH->value, 'deadline' => '2026-09-04'],
                ['title' => 'Prototype fitur baru', 'description' => 'Buat prototype untuk fitur baru yang direncanakan.', 'status' => CardStatus::TODO->value, 'priority' => CardPriority::MEDIUM->value, 'deadline' => '2026-09-18'],
                ['title' => 'Uji coba performa', 'description' => 'Lakukan pengujian performa dan keamanan aplikasi.', 'status' => CardStatus::TODO->value, 'priority' => CardPriority::URGENT->value, 'deadline' => '2026-09-25'],
            ],
        ];

        foreach ($cards as $workspaceName => $cardList) {
            $workspace = $workspaces->firstWhere('name', $workspaceName);
            if (! $workspace) {
                continue;
            }

            foreach ($cardList as $i => $c) {
                Card::updateOrCreate(
                    ['workspace_id' => $workspace->id, 'title' => $c['title']],
                    [
                        'user_id' => $user->id,
                        'workspace_id' => $workspace->id,
                        'title' => $c['title'],
                        'description' => $c['description'],
                        'deadline' => $c['deadline'],
                        'order' => $i + 1,
                        'status' => $c['status'],
                        'priority' => $c['priority'],
                    ]
                );
            }

            $this->command->info("Card untuk {$workspaceName}: " . count($cardList) . ' card');
        }
    }
}
