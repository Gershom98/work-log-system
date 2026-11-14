<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE work_logs MODIFY COLUMN status ENUM('submitted', 'no data', 'rejected', 'assigned') DEFAULT 'submitted'");
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE work_logs MODIFY COLUMN status ENUM('submitted', 'rejected', 'assigned') DEFAULT 'submitted'");
        }
    }
};
