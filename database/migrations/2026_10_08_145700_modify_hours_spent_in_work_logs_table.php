<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('work_logs', function (Blueprint $table) {
            // Inafanya hours_spent iwe ya hiari na pia inaweka default value ya 0
            $table->decimal('hours_spent', 8, 2)->nullable()->default(0)->change();
        });
    }

    public function down(): void
    {
        Schema::table('work_logs', function (Blueprint $table) {
            $table->decimal('hours_spent', 8, 2)->nullable(false)->change();
        });
    }
};