<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(RoleSeeder::class);

        User::updateOrCreate(
            ['email' => 'arya@plannify.test'],
            [
                'name' => 'Arya',
                'username' => 'arya',
                'email' => 'arya@plannify.test',
                'password' => bcrypt('password'),
            ]
        )->assignRole('admin');

        $this->call([
            WorkspaceSeeder::class,
            CardSeeder::class,
            TaskSeeder::class,
            CommentSeeder::class,
            AttachmentSeeder::class,
        ]);
    }
}
