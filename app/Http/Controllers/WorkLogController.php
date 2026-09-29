<?php

namespace App\Http\Controllers;

use App\Models\WorkLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\View;

class WorkLogController extends Controller {

    public function index(Request $request)
    {
        $logs = WorkLog::where('user_id', $request->user()->id)
            ->latest('log_date')
            ->paginate(10);

        return Inertia::render('WorkLogs/Index', [
            'logs' => $logs
        ]);
    }

    public function create()
    {
        return Inertia::render('WorkLogs/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'requester_name' => 'required|string|max:255',
            'title'          => 'required|string|max:255',
            'log_date'       => 'required|date',
            'hours_spent'    => 'required|integer|min:1|max:24',
            'status'         => 'required|in:submitted,pending,approved,rejected',
        ]);

        $request->user()->workLogs()->create($validated);

        return redirect()->route('work-logs.index')->with('message', 'Work log created successfully!');
    }

    public function show(Request $request, WorkLog $workLog)
    {
        if ($workLog->user_id !== $request->user()->id) {
            abort(403);
        }

        return Inertia::render('WorkLogs/Show', [
            'workLog' => $workLog
        ]);
    }

    public function edit(Request $request, WorkLog $workLog)
    {
        if ($workLog->user_id !== $request->user()->id) {
            abort(403);
        }

        return Inertia::render('WorkLogs/Edit', [
            'workLog' => $workLog
        ]);
    }

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
        ]);

        $workLog->update($validated);

        return redirect()->route('work-logs.index')->with('message', 'Work log updated successfully!');
    }

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
    public function downloadPdf(Request $request) 
    {
        ini_set('memory_limit', '256M');
        set_time_limit(300);

        try {
            // Check if blade view exists before trying to load it
            if (!View::exists('pdf.work-logs')) {
                Log::error('PDF Error: View resources/views/pdf/work-logs.blade.php missing.');
                return response('Kosa: Faili la template ya PDF (resources/views/pdf/work-logs.blade.php) halipatikani kwenye server.', 404);
            }

            $workLogs = WorkLog::where('user_id', $request->user()->id)
                ->latest('log_date')
                ->get();

            $user = $request->user();

            // Use system default temp directory to avoid Linux permission issues on Render
            $pdf = Pdf::loadView('pdf.work-logs', compact('workLogs', 'user'))
                ->setPaper('a4', 'portrait')
                ->setOptions([
                    'isHtml5ParserEnabled' => true,
                    'isRemoteEnabled'      => true,
                    'chroot'               => base_path(),
                    'tempDir'              => sys_get_temp_dir(),
                ]);

            $fileName = 'work-log-report-' . now()->format('Y-m-d') . '.pdf';

            return $pdf->download($fileName);

        } catch (\Exception $e) {
            Log::error('PDF Generation Error: ' . $e->getMessage());
            return response('Imefeli kutengeneza PDF: ' . $e->getMessage(), 500);
        }
    }
}