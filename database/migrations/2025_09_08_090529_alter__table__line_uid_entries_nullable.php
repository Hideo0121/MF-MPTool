<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('line_uid_entries', function (Blueprint $table) {
            $table->integer('month')->nullable()->change();
            $table->integer('day')->nullable()->change();
            $table->integer('hour')->nullable()->change();
            $table->integer('minute')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('line_uid_entries', function (Blueprint $table) {
            $table->integer('month')->nullable(false)->change();
            $table->integer('day')->nullable(false)->change();
            $table->integer('hour')->nullable(false)->change();
            $table->integer('minute')->nullable(false)->change();
        });
    }
};
