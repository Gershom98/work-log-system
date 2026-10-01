<?php

namespace App\Http\Controllers;

use App\Models\WorkLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\View;

class WorkLogController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // 1. Anzisha query ya WorkLog
        $query = WorkLog::query();

        // Kama ni admin/supervisor, leta taarifa za mtumiaji aliyeunda log
        if (in_array($user->role, ['admin', 'supervisor'])) {
            $query->with('user:id,name,email');
        } else {
            // Kama ni user wa kawaida, leta logs ZAKE PEKEE
            $query->where('user_id', $user->id);
        }

        // 2. Tumia Filters kulingana na inputs za mtumiaji
        $this->applyFilters($query, $request);

        // 3. Leta data zikiwa na Pagination na kuhifadhi query strings
        $logs = $query->latest('log_date')->paginate(10)->withQueryString();

        return Inertia::render('WorkLogs/Index', [
            'logs' => $logs,
            'filters' => $request->only(['search', 'status', 'start_date', 'end_date']),
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
        $user = $request->user();

        if (!in_array($user->role, ['admin', 'supervisor']) && $workLog->user_id !== $user->id) {
            abort(403, 'Huna ruhusa ya kuona log hii.');
        }

        return Inertia::render('WorkLogs/Show', [
            'workLog' => $workLog->load('user:id,name,email')
        ]);
    }

    public function edit(Request $request, WorkLog $workLog)
    {
        $user = $request->user();

        if (!in_array($user->role, ['admin', 'supervisor']) && $workLog->user_id !== $user->id) {
            abort(403, 'Huna ruhusa ya kuhariri log hii.');
        }

        return Inertia::render('WorkLogs/Edit', [
            'workLog' => $workLog
        ]);
    }

    public function update(Request $request, WorkLog $workLog)
    {
        $user = $request->user();

        if (!in_array($user->role, ['admin', 'supervisor']) && $workLog->user_id !== $user->id) {
            abort(403, 'Huna ruhusa ya kusasisha log hii.');
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
        $user = $request->user();

        if (!in_array($user->role, ['admin', 'supervisor']) && $workLog->user_id !== $user->id) {
            abort(403, 'Huna ruhusa ya kufuta log hii.');
        }

        $workLog->delete();

        return redirect()->route('work-logs.index')->with('message', 'Work log deleted successfully!');
    }

    /**
     * Download the work logs report as a PDF based on applied filters.
     */
    public function downloadPdf(Request $request)
    {
        ini_set('memory_limit', '256M');
        set_time_limit(300);

        try {
            if (!View::exists('pdf.work-logs')) {
                Log::error('PDF Error: View resources/views/pdf/work-logs.blade.php missing.');
                return response('Kosa: Faili la template ya PDF halipatikani.', 404);
            }

            $user = $request->user();
            $query = WorkLog::query();

            // Admin/Supervisor anapakua logs zote (au za waliochujwa), User anapakua zake tu
            if (in_array($user->role, ['admin', 'supervisor'])) {
                $query->with('user:id,name,email');
            } else {
                $query->where('user_id', $user->id);
            }

            // Weka Filter zilezile kwenye PDF
            $this->applyFilters($query, $request);

            $workLogs = $query->latest('log_date')->get();

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

    /**
     * Helper method ya ku-apply filters kwenye Query ya WorkLog
     */
    private function applyFilters($query, Request $request)
    {
        // Filter kwa Search (Title au Requester Name)
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('requester_name', 'like', "%{$search}%");
            });
        }

        // Filter kwa Status
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filter kwa Tarehe ya Kuanzia (Start Date)
        if ($request->filled('start_date')) {
            $query->whereDate('log_date', '>=', $request->input('start_date'));
        }

        // Filter kwa Tarehe ya Mwisho (End Date)
        if ($request->filled('end_date')) {
            $query->whereDate('log_date', '<=', $request->input('end_date'));
        }
    }
}