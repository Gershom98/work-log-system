<?php

namespace App\Http\Controllers;

use App\Models\WorkLog;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Hesabu jumla ya Work Logs na zile kulingana na Status
        // Badilisha status zilizo hapa chini zifanane na zile zilizo kwenye database yako (mfano: approved/pending/rejected au completed/in_progress/pending)
        $stats = [
            'totalLogs'      => WorkLog::count(),
            'completedLogs'  => WorkLog::whereIn('status', ['completed', 'approved'])->count(),
            'inProgressLogs' => WorkLog::where('status', 'in_progress')->count(),
            'pendingLogs'    => WorkLog::where('status', 'pending')->count(),
        ];

        // 2. Chukua Work Logs za hivi karibuni (mfano 5 za mwisho)
        $recentLogs = WorkLog::latest()
            ->take(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats'      => $stats,
            'recentLogs' => $recentLogs,
        ]);
    }
}