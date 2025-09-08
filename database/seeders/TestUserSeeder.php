<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Worker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create worker first
        $worker = Worker::firstOrCreate([
            'worker_code' => 'J04',
        ], [
            'name' => 'テストユーザー',
            'created_by' => 'J04',
        ]);

    }
}
