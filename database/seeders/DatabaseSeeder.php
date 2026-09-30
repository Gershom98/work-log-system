<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Akaunti ya Admin
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name'     => 'System Admin',
                'password' => Hash::make('password123'), // Weka password unayotaka
                'role'     => 'admin',
            ]
        );

        // 2. Akaunti ya User / Staff wa kawaida
        User::updateOrCreate(
            ['email' => 'user@example.com'],
            [
                'name'     => 'Regular User',
                'password' => Hash::make('password123'), // Weka password unayotaka
                'role'     => 'user',
            ]
        );
    }
}