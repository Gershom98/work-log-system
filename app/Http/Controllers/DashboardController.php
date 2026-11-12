<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\WorkLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if (! $user->isSupervisorOrAdmin()) {
            return redirect()->route('work-logs.index');
        }

        $counts = WorkLog::query()
            ->selectRaw('status, COUNT(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        $stats = [
            'total_users' => User::count(),
            'total_logs' => (int) $counts->sum(),
            'submitted_logs' => (int) ($counts[WorkLog::STATUS_SUBMITTED] ?? 0),
            'no_data_logs' => (int) ($counts[WorkLog::STATUS_NO_DATA] ?? 0),
            'rejected_logs' => (int) ($counts[WorkLog::STATUS_REJECTED] ?? 0),
            'assigned_logs' => (int) ($counts[WorkLog::STATUS_ASSIGNED] ?? 0),
        ];

        $recentLogs = WorkLog::query()
            ->with('user:id,name,email')
            ->sorted('newest')
            ->take(6)
            ->get();

        $topContributors = User::query()
            ->withCount('workLogs')
            ->orderByDesc('work_logs_count')
            ->take(5)
            ->get(['id', 'name', 'email', 'role']);

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentLogs' => $recentLogs,
            'topContributors' => $topContributors,
        ]);
    }
}
