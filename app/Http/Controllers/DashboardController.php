<?php

namespace App\Http\Controllers;

use App\Models\WorkLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller {
    public function index( Request $request ) {
        // 1. Angalia kama mtumiaji SI admin, mrudishe moja kwa moja kwenye Work Logs
        if ( $request->user()->role !== 'admin' ) {
            return redirect()->route( 'work-logs.index' );
        }

        // 2. Hesabu jumla ya Work Logs na zile kulingana na Status ( Kwa ajili ya Admin TU )
        $stats = [
            'totalLogs'      => WorkLog::count(),
            'submittedLogs' => WorkLog::where( 'status', 'submitted' )->count(),
            'completedLogs'  => WorkLog::whereIn( 'status', [ 'completed', 'approved' ] )->count(),
            'inProgressLogs' => WorkLog::where( 'status', 'in_progress' )->count(),
            'pendingLogs'    => WorkLog::where( 'status', 'pending' )->count(),
        ];

        // 3. Chukua Work Logs 5 za mwisho kwa ajili ya Admin Dashboard
        $recentLogs = WorkLog::latest()
        ->with( 'user' ) // Ongeza hii kama unataka kuonyesha na jina la mtumiaji aliyeunda log
        ->take( 5 )
        ->get();

        return Inertia::render( 'Dashboard', [
            'stats'      => $stats,
            'recentLogs' => $recentLogs,
        ] );
    }
}