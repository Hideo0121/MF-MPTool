<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('workers', function (Blueprint $table) {
            if (!Schema::hasColumn('workers', 'name')) {
                $table->string('name', 100)->nullable()->after('worker_code');
            }
        });

        // 既存データに対し name が null の場合は worker_code をセット
        DB::table('workers')->whereNull('name')->update([
            'name' => DB::raw('worker_code')
        ]);
    }

    public function down(): void
    {
        Schema::table('workers', function (Blueprint $table) {
            if (Schema::hasColumn('workers', 'name')) {
                $table->dropColumn('name');
            }
        });
    }
};
