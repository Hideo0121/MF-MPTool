<?php

namespace Tests\Feature;

use App\Models\Worker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_login_with_valid_credentials(): void
    {
        $worker = Worker::factory()->create([
            'worker_code' => 'J04',
            'password' => Hash::make('password'),
            'is_admin' => true,
        ]);

        $response = $this->postJson('/api/login', [
            'worker_code' => 'J04',
            'password' => 'password',
        ]);

        $response->assertStatus(200);
        $this->assertAuthenticatedAs($worker, 'web');
    }

    public function test_user_cannot_login_with_invalid_password(): void
    {
        Worker::factory()->create(['worker_code' => 'A01', 'password' => Hash::make('password')]);

        $response = $this->postJson('/api/login', [
            'worker_code' => 'A01',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(401);
        $this->assertGuest('web');
    }

    public function test_user_cannot_login_with_invalid_worker_code_format(): void
    {
        $response = $this->postJson('/api/login', [
            'worker_code' => '12345',
            'password' => 'password',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('worker_code');
    }

    public function test_authenticated_user_can_logout(): void
    {
        Worker::factory()->create([
            'worker_code' => 'J04',
            'password' => Hash::make('password'),
        ]);

        $this->postJson('/api/login', [
            'worker_code' => 'J04',
            'password' => 'password',
        ]);

        $response = $this->postJson('/api/logout');

        $response->assertStatus(204);
        $this->assertGuest('web');
    }
}
