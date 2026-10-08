<?php

namespace App\Http\Controllers;

use App\Models\WorkLog;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller {
    public function index( Request $request ) {
        $user = $request->user();

        // Kama mtumiaji sio Admin au Supervisor, mpeleke kwenye ukurasa wa Work Logs
        if ( !in_array( $user->role, [ 'admin', 'supervisor' ] ) ) {
            return redirect()->route( 'work-logs.index' );
        }

        // Mahesabu ya Takwimu ( Metrics ) kwa ajili ya Admin Dashboard
        $stats = [
            'total_users'     => User::count(),
            'total_logs'      => WorkLog::count(),
            'submitted_logs'  => WorkLog::where( 'status', 'submitted' )->count(),
            'no_data_logs'    => WorkLog::where( 'status', 'no data' )->count(),
            'rejected_logs'   => WorkLog::where( 'status', 'rejected' )->count(),
            'assigned_logs'   => WorkLog::where( 'status', 'assigned' )->count(),
        ];

        // Logs za hivi karibuni 5
        $recentLogs = WorkLog::with( 'user:id,name,email' )
        ->latest( 'log_date' )
        ->take( 5 )
        ->get();

        return Inertia::render( 'Dashboard', [
            'stats'      => $stats,
            'recentLogs' => $recentLogs,
        ] );
    }
}