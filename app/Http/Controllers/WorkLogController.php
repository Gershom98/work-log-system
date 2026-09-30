<?php

namespace App\Http\Controllers;

use App\Models\WorkLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\View;

class WorkLogController extends Controller  {
    public function index( Request $request ) {
        $user = $request->user();

        // Kama ni admin/supervisor, leta logs ZOTE pamoja na taarifa za mtumiaji aliyeunda log hiyo
        if ( in_array( $user->role, [ 'admin', 'supervisor' ] ) ) {
            $logs = WorkLog::with( 'user:id,name,email' )
            ->latest( 'log_date' )
            ->paginate( 10 );
        } else {
            // Kama ni user wa kawaida, leta logs ZAKE PEKEE
            $logs = WorkLog::where( 'user_id', $user->id )
            ->latest( 'log_date' )
            ->paginate( 10 );
        }

        return Inertia::render( 'WorkLogs/Index', [
            'logs' => $logs,
        ] );
    }

    public function create() {
        return Inertia::render( 'WorkLogs/Create' );
    }

    public function store( Request $request ) {
        $validated = $request->validate( [
            'requester_name' => 'required|string|max:255',
            'title'          => 'required|string|max:255',
            'log_date'       => 'required|date',
            'hours_spent'    => 'required|integer|min:1|max:24',
            'status'         => 'required|in:submitted,pending,approved,rejected',
        ] );

        $request->user()->workLogs()->create( $validated );

        return redirect()->route( 'work-logs.index' )->with( 'message', 'Work log created successfully!' );
    }

    public function show( Request $request, WorkLog $workLog ) {
        $user = $request->user();

        // Ruhusu kama ni admin AU kama log ni ya mtumiaji husika
        if ( !in_array( $user->role, [ 'admin', 'supervisor' ] ) && $workLog->user_id !== $user->id ) {
            abort( 403, 'Huna ruhusa ya kuona log hii.' );
        }

        return Inertia::render( 'WorkLogs/Show', [
            'workLog' => $workLog->load( 'user:id,name,email' )
        ] );
    }

    public function edit( Request $request, WorkLog $workLog ) {
        $user = $request->user();

        if ( !in_array( $user->role, [ 'admin', 'supervisor' ] ) && $workLog->user_id !== $user->id ) {
            abort( 403, 'Huna ruhusa ya kuhariri log hii.' );
        }

        return Inertia::render( 'WorkLogs/Edit', [
            'workLog' => $workLog
        ] );
    }

    public function update( Request $request, WorkLog $workLog ) {
        $user = $request->user();

        if ( !in_array( $user->role, [ 'admin', 'supervisor' ] ) && $workLog->user_id !== $user->id ) {
            abort( 403, 'Huna ruhusa ya kusasisha log hii.' );
        }

        $validated = $request->validate( [
            'requester_name' => 'required|string|max:255',
            'title'          => 'required|string|max:255',
            'log_date'       => 'required|date',
            'hours_spent'    => 'required|integer|min:1|max:24',
            'status'         => 'required|in:submitted,pending,approved,rejected',
        ] );

        $workLog->update( $validated );

        return redirect()->route( 'work-logs.index' )->with( 'message', 'Work log updated successfully!' );
    }

    public function destroy( Request $request, WorkLog $workLog ) {
        $user = $request->user();

        if ( !in_array( $user->role, [ 'admin', 'supervisor' ] ) && $workLog->user_id !== $user->id ) {
            abort( 403, 'Huna ruhusa ya kufuta log hii.' );
        }

        $workLog->delete();

        return redirect()->route( 'work-logs.index' )->with( 'message', 'Work log deleted successfully!' );
    }

    /**
    * Download the work logs report as a PDF.
    */

    public function downloadPdf( Request $request )  {
        ini_set( 'memory_limit', '256M' );
        set_time_limit( 300 );

        try {
            if ( !View::exists( 'pdf.work-logs' ) ) {
                Log::error( 'PDF Error: View resources/views/pdf/work-logs.blade.php missing.' );
                return response( 'Kosa: Faili la template ya PDF halipatikani.', 404 );
            }

            $user = $request->user();

            // Admin anapakua logs zote, User anapakua zake tu
            if ( in_array( $user->role, [ 'admin', 'supervisor' ] ) ) {
                $workLogs = WorkLog::with( 'user:id,name,email' )->latest( 'log_date' )->get();
            } else {
                $workLogs = WorkLog::where( 'user_id', $user->id )->latest( 'log_date' )->get();
            }

            $pdf = Pdf::loadView( 'pdf.work-logs', compact( 'workLogs', 'user' ) )
            ->setPaper( 'a4', 'portrait' )
            ->setOptions( [
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled'      => true,
                'chroot'               => base_path(),
                'tempDir'              => sys_get_temp_dir(),
            ] );

            $fileName = 'work-log-report-' . now()->format( 'Y-m-d' ) . '.pdf';

            return $pdf->download( $fileName );

        } catch ( \Exception $e ) {
            Log::error( 'PDF Generation Error: ' . $e->getMessage() );
            return response( 'Imefeli kutengeneza PDF: ' . $e->getMessage(), 500 );
        }
    }
}