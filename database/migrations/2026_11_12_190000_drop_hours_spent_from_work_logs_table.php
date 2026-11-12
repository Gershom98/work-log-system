<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('work_logs', 'hours_spent')) {
            Schema::table('work_logs', function (Blueprint $table) {
                $table->dropColumn('hours_spent');
            });
        }
    }

    public function down(): void
    {
        if (! Schema::hasColumn('work_logs', 'hours_spent')) {
            Schema::table('work_logs', function (Blueprint $table) {
                $table->decimal('hours_spent', 8, 2)->nullable()->default(0)->after('log_date');
            });
        }
    }
};
