<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('work_logs', function (Blueprint $table) {
            $table->text('ai_solutions')->nullable()->after('supervisor_comment');
            $table->timestamp('ai_solutions_generated_at')->nullable()->after('ai_solutions');
        });
    }

    public function down(): void
    {
        Schema::table('work_logs', function (Blueprint $table) {
            $table->dropColumn(['ai_solutions', 'ai_solutions_generated_at']);
        });
    }
};
