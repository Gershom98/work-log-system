<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\WorkLog;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('password123');

        $admin = User::updateOrCreate(
            ['email' => 'admin@logs.com'],
            ['name' => 'Admin', 'password' => $password, 'role' => User::ROLE_ADMIN]
        );

        $supervisor = User::updateOrCreate(
            ['email' => 'supervisor@logs.com'],
            ['name' => 'Supervisor', 'password' => $password, 'role' => User::ROLE_SUPERVISOR]
        );

        $user = User::updateOrCreate(
            ['email' => 'user@gmail.com'],
            ['name' => 'User', 'password' => $password, 'role' => User::ROLE_USER]
        );

        $john = User::updateOrCreate(
            ['email' => 'john@logs.com'],
            ['name' => 'John Mwakyusa', 'password' => $password, 'role' => User::ROLE_USER]
        );

        $mary = User::updateOrCreate(
            ['email' => 'mary@logs.com'],
            ['name' => 'Mary Joseph', 'password' => $password, 'role' => User::ROLE_USER]
        );

        if (WorkLog::query()->exists()) {
            return;
        }

        $logs = [
            [$user, 'Hassan Ally', 'Fix printer at reception', 'Printer is not picking paper from tray 2. Needs a technician visit.', -1, WorkLog::STATUS_SUBMITTED],
            [$user, 'Grace Mushi', 'Install Office on new laptop', 'New staff laptop needs Microsoft Office and antivirus installation.', -2, WorkLog::STATUS_ASSIGNED],
            [$john, 'Amina Said', 'Network cable replacement', 'Cable in room 4B is damaged and causing intermittent disconnects.', -3, WorkLog::STATUS_ASSIGNED],
            [$john, 'Peter Msangi', 'Reset email password', 'User locked out of email after too many failed attempts.', -5, WorkLog::STATUS_SUBMITTED],
            [$mary, 'Zainab Hamisi', 'Projector not powering on', 'Projector in meeting room shows no power light.', -7, WorkLog::STATUS_REJECTED],
            [$mary, 'David Kimaro', 'Update website content', 'Replace the team page photos with the new ones from HR.', -9, WorkLog::STATUS_SUBMITTED],
            [$user, 'Rehema Njau', 'Backup server disk check', 'Routine check of backup server disk health and free space.', -12, WorkLog::STATUS_NO_DATA],
            [$john, 'Fatuma Salum', 'New user account setup', 'Create domain account and email for new accountant.', -15, WorkLog::STATUS_ASSIGNED],
            [$mary, 'Juma Rashid', 'Keyboard and mouse replacement', 'Keyboard keys are sticking and the mouse scroll is broken.', -18, WorkLog::STATUS_SUBMITTED],
            [$user, 'Neema Kessy', 'Wi-Fi drops in office 2', 'Wi-Fi connection drops every afternoon between 2pm and 4pm.', -21, WorkLog::STATUS_REJECTED],
            [$john, 'Salim Abdallah', 'Server room air conditioning', 'AC unit in server room is running but not cooling.', -25, WorkLog::STATUS_ASSIGNED],
            [$mary, 'Halima Mwinyi', 'CCTV camera offline', 'Camera near main gate is not recording since yesterday.', -28, WorkLog::STATUS_SUBMITTED],
        ];

        foreach ($logs as [$owner, $requester, $title, $description, $daysAgo, $status]) {
            $log = WorkLog::create([
                'user_id' => $owner->id,
                'requester_name' => $requester,
                'title' => $title,
                'description' => $description,
                'log_date' => now()->addDays($daysAgo)->toDateString(),
                'status' => $status,
            ]);

            if ($status === WorkLog::STATUS_REJECTED) {
                $log->update([
                    'rejection_reason' => 'Insufficient detail: please include the asset tag and the exact error message so the request can be verified.',
                    'supervisor_comment' => 'Re-submit with the missing information.',
                ]);
            }
        }
    }
}
