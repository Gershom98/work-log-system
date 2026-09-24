<?php

namespace App\Http\Controllers;

use App\Models\WorkLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;

class WorkLogController extends Controller {
    /**
    * Display a listing of the user's work logs.
     */
    public function index(Request $request)
    {
        $logs = WorkLog::where('user_id', $request->user()->id)
            ->latest('log_date')
            ->paginate(10);

        return Inertia::render('WorkLogs/Index', [
            'logs' => $logs
        ]);
    }

    /**
     * Show the form for creating a new work log.
     */
    public function create()
    {
        return Inertia::render('WorkLogs/Create');
    }

    /**
     * Store a newly created work log in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'requester_name' => 'required|string|max:255',
            'title'          => 'required|string|max:255',
            'log_date'       => 'required|date',
            'hours_spent'    => 'required|integer|min:1|max:24',
            'status'         => 'required|in:submitted,pending,approved,rejected',
            // 'description'    => 'required|string',
        ]);

        $request->user()->workLogs()->create($validated);

        return redirect()->route('work-logs.index')->with('message', 'Work log created successfully!');
    }

    /**
     * Display the specified work log.
     */
    public function show(Request $request, WorkLog $workLog)
    {
        if ($workLog->user_id !== $request->user()->id) {
            abort(403);
        }

        return Inertia::render('WorkLogs/Show', [
            'workLog' => $workLog
        ]);
    }

    /**
     * Show the form for editing the specified work log.
     */
    public function edit(Request $request, WorkLog $workLog)
    {
        if ($workLog->user_id !== $request->user()->id) {
            abort(403);
        }

        return Inertia::render('WorkLogs/Edit', [
            'workLog' => $workLog
        ]);
    }

    /**
     * Update the specified work log in storage.
     */
    public function update(Request $request, WorkLog $workLog)
    {
        if ($workLog->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'requester_name' => 'required|string|max:255',
            'title'          => 'required|string|max:255',
            'log_date'       => 'required|date',
            'hours_spent'    => 'required|integer|min:1|max:24',
            'status'         => 'required|in:submitted,pending,approved,rejected', 
            // 'description'    => 'required|string',
        ]);

        $workLog->update($validated);

        return redirect()->route('work-logs.index')->with('message', 'Work log updated successfully!');
    }

    /**
     * Remove the specified work log from storage.
     */
    public function destroy(Request $request, WorkLog $workLog)
    {
        if ($workLog->user_id !== $request->user()->id) {
            abort(403);
        }

        $workLog->delete();

        return redirect()->route('work-logs.index')->with('message', 'Work log deleted successfully!');
    }

    /**
     * Download the authenticated user's work logs report as a PDF.
    */

    public function downloadPdf( Request $request ) {
        try {
            $workLogs = WorkLog::where( 'user_id', $request->user()->id )
            ->latest( 'log_date' )
            ->get();

            $user = $request->user();

            $pdf = Pdf::loadView( 'pdf.work-logs', compact( 'workLogs', 'user' ) )
            ->setPaper( 'a4', 'portrait' )
            ->setOptions( [
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled'      => true,
                'chroot'               => public_path(),
            ] );

            return response()->streamDownload(
                fn () => print( $pdf->output() ),
                'work-log-report-' . now()->format( 'Y-m-d' ) . '.pdf',
                [
                    'Content-Type' => 'application/pdf',
                ]
            );
        } catch ( \Exception $e ) {
            Log::error( 'PDF Error: ' . $e->getMessage() );
            return back()->with( 'error', 'Imefeli kutengeneza PDF: ' . $e->getMessage() );
        }
    }
}