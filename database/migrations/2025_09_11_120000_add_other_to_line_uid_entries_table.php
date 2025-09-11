<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('line_uid_entries', function (Blueprint $table) {
            if (!Schema::hasColumn('line_uid_entries', 'other')) {
                $table->string('other', 255)->nullable()->after('is_duplicate');
            }
        });
    }

    public function down(): void
    {
        Schema::table('line_uid_entries', function (Blueprint $table) {
            if (Schema::hasColumn('line_uid_entries', 'other')) {
                $table->dropColumn('other');
            }
        });
    }
};
