<?php

use App\Models\LineUidEntry;
use App\Models\NgReason;
use App\Models\Worker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

function seedBasic(): array {
    $admin = Worker::factory()->create(['worker_code' => 'ADM1', 'is_admin' => true, 'name' => '管理者']);
    $user = Worker::factory()->create(['worker_code' => 'USR1', 'is_admin' => false, 'name' => '一般']);
    $reason = NgReason::factory()->create(['reason' => '指定なし']);
    LineUidEntry::factory()->create([
        'line_uid' => str_repeat('A',33),
        'points' => 10,
        'month' => 9,
        'day' => 1,
        'hour' => 10,
        'minute' => 5,
        'ng_reason_id' => $reason->id,
        'worker_code' => $user->worker_code,
    ]);
    LineUidEntry::factory()->create([
        'line_uid' => str_repeat('B',33),
        'points' => 20,
        'month' => 9,
        'day' => 2,
        'hour' => 11,
        'minute' => 15,
        'ng_reason_id' => $reason->id,
        'worker_code' => $user->worker_code,
        'created_at' => now()->addMinute(),
    ]);
    return [$admin, $user, $reason];
}

it('admin can fetch all entries sorted desc by created_at by default', function () {
    [$admin] = seedBasic();
    Sanctum::actingAs($admin);
    $res = $this->getJson('/api/entries');
    $res->assertOk();
    $json = $res->json();
    expect($json)->toHaveCount(2);
    expect($json[0]['points'])->toBe(20);
});

it('non admin only sees own entries', function () {
    [, $user] = seedBasic();
    Sanctum::actingAs($user);
    $res = $this->getJson('/api/entries');
    $res->assertOk()->assertJsonCount(2);
});

it('can filter by line_uid', function () {
    [$admin] = seedBasic();
    Sanctum::actingAs($admin);
    $uid = str_repeat('A',33);
    $res = $this->getJson('/api/entries?line_uid=' . $uid);
    $res->assertOk()->assertJsonCount(1);
});

it('can sort by points asc', function () {
    [$admin] = seedBasic();
    Sanctum::actingAs($admin);
    $res = $this->getJson('/api/entries?sort_by=points&sort_order=asc');
    $res->assertOk();
    $json = $res->json();
    expect($json[0]['points'])->toBe(10);
});
