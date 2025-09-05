<?php

namespace Tests\Feature;

use App\Models\NgReason;
use App\Models\Worker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LineUidEntryTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('db:seed');
        $worker = Worker::factory()->create();
        $this->actingAs($worker, 'web');
    }

    public function test_can_create_line_uid_entry()
    {
        $ngReason = NgReason::first();
        $data = [
            'line_uid' => 'U12345678901234567890123456789012',
            'month' => 8, // Use a past month to ensure the date is in the past
            'day' => 4,
            'hour' => 10,
            'minute' => 30,
            'ng_reason_id' => $ngReason->id,
        ];

        $response = $this->postJson('/api/entries', $data);

        $response->assertStatus(201)
            ->assertJsonFragment(['line_uid' => $data['line_uid']]);
        $this->assertDatabaseHas('line_uid_entries', ['line_uid' => $data['line_uid']]);
    }

    public function test_cannot_create_entry_with_future_date()
    {
        $ngReason = NgReason::first();
        $data = [
            'line_uid' => 'U12345678901234567890123456789012',
            'month' => 12,
            'day' => 31,
            'hour' => 23,
            'minute' => 59,
            'ng_reason_id' => $ngReason->id,
        ];

        // This test assumes the system date is not Dec 31, 2025, which is safe.
        $response = $this->postJson('/api/entries', $data);

        $response->assertStatus(422)->assertJsonValidationErrors('date');
    }

    public function test_duplicate_entry_is_flagged()
    {
        $ngReason = NgReason::first();
        $data = [
            'line_uid' => 'U12345678901234567890123456789012',
            'month' => 9,
            'day' => 1,
            'hour' => 10,
            'minute' => 30,
            'ng_reason_id' => $ngReason->id,
        ];

        $this->postJson('/api/entries', $data); // First entry
        $response = $this->postJson('/api/entries', $data); // Duplicate entry

        $response->assertStatus(201)
            ->assertJsonFragment(['is_duplicate' => true]);
    }

    public function test_can_get_ng_reasons()
    {
        $response = $this->getJson('/api/ng-reasons');
        $response->assertStatus(200)->assertJsonCount(4);
    }
}