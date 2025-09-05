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
        Schema::create('line_uid_entries', function (Blueprint $table) {
            $table->id();
            $table->string('line_uid', 33);
            $table->tinyInteger('month');
            $table->tinyInteger('day');
            $table->tinyInteger('hour');
            $table->tinyInteger('minute');
            $table->foreignId('ng_reason_id')->constrained('ng_reasons');
            $table->string('worker_code', 10);
            $table->boolean('is_duplicate')->default(false);
            $table->timestamps();

            $table->index(['line_uid', 'month', 'day', 'hour', 'minute']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('line_uid_entries');
    }
};