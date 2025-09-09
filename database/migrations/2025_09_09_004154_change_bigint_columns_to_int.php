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
        // Foreign keys must be dropped before changing the columns they reference.
        Schema::table('line_uid_entries', function (Blueprint $table) {
            $table->dropForeign(['ng_reason_id']);
        });

        // Change primary key columns from BIGINT to INT.
        Schema::table('users', function (Blueprint $table) {
            $table->increments('id')->change();
        });

        Schema::table('workers', function (Blueprint $table) {
            $table->increments('id')->change();
        });

        Schema::table('ng_reasons', function (Blueprint $table) {
            $table->increments('id')->change();
        });

        // Change columns in tables with foreign keys.
        Schema::table('line_uid_entries', function (Blueprint $table) {
            $table->increments('id')->change();
            $table->unsignedInteger('ng_reason_id')->change();
        });

        Schema::table('sessions', function (Blueprint $table) {
            $table->unsignedInteger('user_id')->nullable()->change();
        });

        // Re-add foreign keys.
        Schema::table('line_uid_entries', function (Blueprint $table) {
            $table->foreign('ng_reason_id')->references('id')->on('ng_reasons');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop foreign keys.
        Schema::table('line_uid_entries', function (Blueprint $table) {
            $table->dropForeign(['ng_reason_id']);
        });

        // Change columns back to BIGINT.
        Schema::table('users', function (Blueprint $table) {
            $table->bigIncrements('id')->change();
        });

        Schema::table('workers', function (Blueprint $table) {
            $table->bigIncrements('id')->change();
        });

        Schema::table('ng_reasons', function (Blueprint $table) {
            $table->bigIncrements('id')->change();
        });

        Schema::table('line_uid_entries', function (Blueprint $table) {
            $table->bigIncrements('id')->change();
            $table->unsignedBigInteger('ng_reason_id')->change();
        });

        Schema::table('sessions', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->change();
        });

        // Re-add foreign keys.
        Schema::table('line_uid_entries', function (Blueprint $table) {
            $table->foreign('ng_reason_id')->references('id')->on('ng_reasons');
        });
    }
};
