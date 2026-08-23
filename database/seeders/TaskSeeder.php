<?php

namespace Database\Seeders;

use App\Models\Card;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('username', 'arya')->first() ?? User::first();
        $cards = Card::all();

        if (! $user || $cards->isEmpty()) {
            $this->command->warn('Tidak ada user/card, lewati TaskSeeder.');
            return;
        }

        $tasks = [
            'Desain landing page' => [
                ['title' => 'Buat wireframe', 'completed' => true],
                ['title' => 'Desain hero section', 'completed' => true],
                ['title' => 'Desain section portfolio', 'completed' => false],
                ['title' => 'Desain footer', 'completed' => false],
            ],
            'Setup domain & hosting' => [
                ['title' => 'Beli domain', 'completed' => true],
                ['title' => 'Konfigurasi DNS', 'completed' => true],
                ['title' => 'Deploy ke VPS', 'completed' => true],
            ],
            'Tulis konten section About' => [
                ['title' => 'Draft profil singkat', 'completed' => true],
                ['title' => 'Daftar keahlian', 'completed' => false],
                ['title' => 'Review & edit', 'completed' => false],
            ],
            'Optimasi SEO & performa' => [
                ['title' => 'Optimasi meta tag', 'completed' => false],
                ['title' => 'Compress gambar', 'completed' => false],
                ['title' => 'Setup lazy loading', 'completed' => false],
            ],
            'Integrasi form kontak' => [
                ['title' => 'Buat form', 'completed' => true],
                ['title' => 'Setup email notifikasi', 'completed' => false],
                ['title' => 'Testing', 'completed' => false],
            ],
            'Kalender konten bulanan' => [
                ['title' => 'Brainstorm topik', 'completed' => true],
                ['title' => 'Susun jadwal posting', 'completed' => true],
                ['title' => 'Distribusi ke tim', 'completed' => true],
            ],
            'Desain visual feed Instagram' => [
                ['title' => 'Buat template', 'completed' => true],
                ['title' => 'Desain 10 konten', 'completed' => false],
            ],
            'Riset keyword SEO' => [
                ['title' => 'Kumpulkan keyword', 'completed' => false],
                ['title' => 'Analisis kompetitor', 'completed' => false],
            ],
            'Draft artikel blog mingguan' => [
                ['title' => 'Artikel 1', 'completed' => false],
                ['title' => 'Artikel 2', 'completed' => false],
            ],
            'Riset kompetitor' => [
                ['title' => 'Identifikasi kompetitor', 'completed' => true],
                ['title' => 'Analisis branding', 'completed' => true],
                ['title' => 'Buat laporan', 'completed' => true],
            ],
            'Desain logo baru' => [
                ['title' => 'Sketsa konsep', 'completed' => true],
                ['title' => 'Digitalisasi 3 konsep', 'completed' => false],
                ['title' => 'Presentasi ke client', 'completed' => false],
            ],
            'Pilih palet warna' => [
                ['title' => 'Kumpulkan referensi', 'completed' => true],
                ['title' => 'Buat 3 opsi palet', 'completed' => false],
            ],
            'Update materi promosi' => [
                ['title' => 'Update brosur', 'completed' => false],
                ['title' => 'Update banner', 'completed' => false],
            ],
            'Evaluasi fitur aplikasi' => [
                ['title' => 'Kumpulkan feedback', 'completed' => true],
                ['title' => 'Analisis data', 'completed' => false],
            ],
            'Prototype fitur baru' => [
                ['title' => 'Buat flow', 'completed' => false],
                ['title' => 'Buat prototype', 'completed' => false],
            ],
            'Uji coba performa' => [
                ['title' => 'Setup environment test', 'completed' => false],
                ['title' => 'Jalankan pengujian', 'completed' => false],
            ],
        ];

        foreach ($tasks as $cardTitle => $taskList) {
            $card = $cards->firstWhere('title', $cardTitle);
            if (! $card) {
                continue;
            }

            foreach ($taskList as $t) {
                Task::updateOrCreate(
                    ['card_id' => $card->id, 'title' => $t['title']],
                    [
                        'card_id' => $card->id,
                        'user_id' => $user->id,
                        'title' => $t['title'],
                        'is_completed' => $t['completed'],
                    ]
                );
            }

            $this->command->info("Task untuk {$cardTitle}: " . count($taskList) . ' task');
        }
    }
}
