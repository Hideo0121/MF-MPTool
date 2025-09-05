<?php

namespace Database\Seeders;

use App\Models\NgReason;
use Illuminate\Database\Seeder;

class NgReasonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $reasons = [
            '指定なし',
            '購入日時不明',
            '購入日時店不明',
            '期間外',
            '重複',
            '無関係画像',
            '対象商品判断不可',
            '対象商品なし',
            '判読不能',
            '続き画像',
            '100円以下',
            '商品画像',
        ];

        foreach ($reasons as $reason) {
            NgReason::create([
                'reason' => $reason,
                'created_by' => 'J04',
            ]);
        }
    }
}