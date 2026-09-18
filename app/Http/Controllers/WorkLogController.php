<?php

namespace App\Http\Controllers;

use App\Models\WorkLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkLogController extends Controller
{
    public function index(Request $request)
    {
        $logs = WorkLog::where('user_id', $request->user()->id)
            ->latest('log_date') // Column sahihi kulingana na migration
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
            'status'         => 'required|in:pending,approved,rejected',
            'description'    => 'required|string',
        ]);

        $request->user()->workLogs()->create($validated);

        return redirect()->route('work-logs.index')->with('message', 'Kazi imerekodiwa kikamilifu!');
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
            'status'         => 'required|in:pending,approved,rejected',
            'description'    => 'required|string',
        ]);

        $workLog->update($validated);

        return redirect()->route('work-logs.index')->with('message', 'Taarifa za kazi zimesasishwa kikamilifu!');
    }

    public function destroy(Request $request, WorkLog $workLog)
    {
        if ($workLog->user_id !== $request->user()->id) {
            abort(403);
        }

        $workLog->delete();

        return redirect()->route('work-logs.index')->with('message', 'Work log imefutwa kikamilifu!');
    }
}