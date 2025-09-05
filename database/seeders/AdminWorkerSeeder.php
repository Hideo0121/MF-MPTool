<?php

namespace Database\Seeders;

use App\Models\Worker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminWorkerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Worker::create([
            'worker_code' => 'J04',
            'password' => Hash::make('password'),
            'is_admin' => true,
        ]);
    }
}