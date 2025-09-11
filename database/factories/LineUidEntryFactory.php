<?php

namespace Database\Factories;

use App\Models\LineUidEntry;
use App\Models\NgReason;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LineUidEntry>
 */
class LineUidEntryFactory extends Factory
{
    protected $model = LineUidEntry::class;

    public function definition(): array
    {
        return [
            'line_uid' => strtoupper(fake()->bothify(str_repeat('#', 33))), // 33 chars alnum
            'month' => 9,
            'day' => fake()->numberBetween(1, 28),
            'hour' => fake()->numberBetween(0, 23),
            'minute' => fake()->numberBetween(0, 59),
            'points' => fake()->numberBetween(1, 100),
            'ng_reason_id' => NgReason::factory(),
            'worker_code' => 'USR1',
            'is_duplicate' => false,
        ];
    }
}
