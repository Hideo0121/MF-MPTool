<?php

namespace Tests\Feature;

use App\Models\NgReason;
use App\Models\Worker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminApiTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $worker;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = Worker::factory()->create(['is_admin' => true]);
        $this->worker = Worker::factory()->create(['is_admin' => false]);
    }

    public function test_admin_can_access_admin_routes()
    {
        $this->actingAs($this->admin, 'web');
        $response = $this->getJson('/api/admin/workers');
        $response->assertStatus(200);
    }

    public function test_non_admin_cannot_access_admin_routes()
    {
        $this->actingAs($this->worker, 'web');
        $response = $this->getJson('/api/admin/workers');
        $response->assertStatus(403);
    }

    public function test_admin_can_create_worker()
    {
        $this->actingAs($this->admin, 'web');
        $response = $this->postJson('/api/admin/workers', [
            'worker_code' => 'T123',
            'password' => 'password123',
            'is_admin' => false,
        ]);
        $response->assertStatus(201);
        $this->assertDatabaseHas('workers', ['worker_code' => 'T123']);
    }

    public function test_admin_can_delete_ng_reason()
    {
        $this->actingAs($this->admin, 'web');
        $ngReason = NgReason::factory()->create();
        $response = $this->deleteJson("/api/admin/ng-reasons/{$ngReason->id}");
        $response->assertStatus(204);
        $this->assertDatabaseMissing('ng_reasons', ['id' => $ngReason->id]);
    }

    public function test_admin_can_view_workers()
    {
        $this->actingAs($this->admin, 'web');
        Worker::factory()->count(3)->create();
        $response = $this->getJson('/api/admin/workers');
        $response->assertStatus(200)
                 ->assertJsonCount(5); // 3 created + 1 admin + 1 regular worker from setUp
    }

    public function test_admin_can_view_specific_worker()
    {
        $this->actingAs($this->admin, 'web');
        $worker = Worker::factory()->create();
        $response = $this->getJson("/api/admin/workers/{$worker->id}");
        $response->assertStatus(200)
                 ->assertJsonFragment(['worker_code' => $worker->worker_code]);
    }

    public function test_admin_can_update_worker()
    {
        $this->actingAs($this->admin, 'web');
        $worker = Worker::factory()->create();
        $updatedData = ['worker_code' => 'J001', 'password' => 'newpassword', 'is_admin' => true];
        $response = $this->putJson("/api/admin/workers/{$worker->id}", $updatedData);
        $response->assertStatus(200);
        $this->assertDatabaseHas('workers', ['id' => $worker->id, 'worker_code' => 'J001', 'is_admin' => true]);
    }

    public function test_admin_can_delete_worker()
    {
        $this->actingAs($this->admin, 'web');
        $worker = Worker::factory()->create();
        $response = $this->deleteJson("/api/admin/workers/{$worker->id}");
        $response->assertStatus(204);
        $this->assertDatabaseMissing('workers', ['id' => $worker->id]);
    }

    public function test_admin_can_view_ng_reasons()
    {
        $this->actingAs($this->admin, 'web');
        NgReason::factory()->count(3)->create();
        $response = $this->getJson('/api/admin/ng-reasons');
        $response->assertStatus(200)
                 ->assertJsonCount(3);
    }

    public function test_admin_can_view_specific_ng_reason()
    {
        $this->actingAs($this->admin, 'web');
        $ngReason = NgReason::factory()->create();
        $response = $this->getJson("/api/admin/ng-reasons/{$ngReason->id}");
        $response->assertStatus(200)
                 ->assertJsonFragment(['reason' => $ngReason->reason]);
    }

    public function test_admin_can_create_ng_reason()
    {
        $this->actingAs($this->admin, 'web');
        $response = $this->postJson('/api/admin/ng-reasons', [
            'reason' => 'New NG Reason',
            'created_by' => 'ADMIN',
        ]);
        $response->assertStatus(201);
        $this->assertDatabaseHas('ng_reasons', ['reason' => 'New NG Reason']);
    }

    public function test_admin_can_update_ng_reason()
    {
        $this->actingAs($this->admin, 'web');
        $ngReason = NgReason::factory()->create();
        $updatedData = ['reason' => 'Updated Reason', 'created_by' => 'UPDATED'];
        $response = $this->putJson("/api/admin/ng-reasons/{$ngReason->id}", $updatedData);
        $response->assertStatus(200);
        $this->assertDatabaseHas('ng_reasons', ['id' => $ngReason->id, 'reason' => 'Updated Reason']);
    }
}