<?php

namespace App\Policies;

use App\Models\User;
use App\Models\WorkLog;

class WorkLogPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, WorkLog $workLog): bool
    {
        return $user->isSupervisorOrAdmin() || $workLog->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, WorkLog $workLog): bool
    {
        return $this->view($user, $workLog);
    }

    public function delete(User $user, WorkLog $workLog): bool
    {
        return $this->view($user, $workLog);
    }

    public function manageStatus(User $user): bool
    {
        return $user->isSupervisorOrAdmin();
    }
}
