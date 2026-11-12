<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWorkLogRequest;
use App\Http\Requests\UpdateWorkLogRequest;
use App\Models\WorkLog;
use Barryvdh\DomPDF\Facade\Pdf;
use DateTimeImmutable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class WorkLogController extends Controller
{
    private const PER_PAGE_OPTIONS = [5, 10, 25, 50];

    private const DEFAULT_PER_PAGE = 10;

    public function index(Request $request)
    {
        $user = $request->user();
        $filters = $this->filtersFromRequest($request);

        $query = WorkLog::query()
            ->visibleTo($user)
            ->filter($filters);

        $summary = WorkLog::statusSummary($query);

        $logs = $query
            ->with('user:id,name,email')
            ->sorted($filters['sort'])
            ->paginate($filters['per_page'])
            ->withQueryString();

        return Inertia::render('WorkLogs/Index', [
            'logs' => $logs,
            'summary' => $summary,
            'filters' => $filters,
            'perPageOptions' => self::PER_PAGE_OPTIONS,
            'canManageStatus' => $user->isSupervisorOrAdmin(),
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('WorkLogs/Create', [
            'canManageStatus' => $request->user()->isSupervisorOrAdmin(),
        ]);
    }

    public function store(StoreWorkLogRequest $request)
    {
        $data = $request->validated();

        if (! $request->user()->isSupervisorOrAdmin()) {
            $data['status'] = WorkLog::STATUS_SUBMITTED;
        }

        $data['rejection_reason'] = ($data['status'] ?? null) === WorkLog::STATUS_REJECTED
            ? ($data['rejection_reason'] ?? null)
            : null;

        $request->user()->workLogs()->create($data);

        return redirect()
            ->route('work-logs.index')
            ->with('message', 'Work log created successfully.');
    }

    public function show(Request $request, WorkLog $workLog)
    {
        $this->authorize('view', $workLog);

        return Inertia::render('WorkLogs/Show', [
            'workLog' => $workLog->load('user:id,name,email'),
            'canManageStatus' => $request->user()->isSupervisorOrAdmin(),
        ]);
    }

    public function edit(Request $request, WorkLog $workLog)
    {
        $this->authorize('update', $workLog);

        return Inertia::render('WorkLogs/Edit', [
            'workLog' => $workLog->load('user:id,name,email'),
            'canManageStatus' => $request->user()->isSupervisorOrAdmin(),
        ]);
    }

    public function update(UpdateWorkLogRequest $request, WorkLog $workLog)
    {
        $data = $request->validated();

        if (! $request->user()->isSupervisorOrAdmin()) {
            unset($data['status'], $data['rejection_reason']);
        } else {
            $data['rejection_reason'] = ($data['status'] ?? null) === WorkLog::STATUS_REJECTED
                ? ($data['rejection_reason'] ?? null)
                : null;
        }

        $workLog->update($data);

        return redirect()
            ->route('work-logs.index')
            ->with('message', 'Work log updated successfully.');
    }

    public function destroy(WorkLog $workLog)
    {
        $this->authorize('delete', $workLog);

        $workLog->delete();

        return redirect()
            ->route('work-logs.index')
            ->with('message', 'Work log deleted successfully.');
    }

    public function downloadPdf(Request $request)
    {
        $user = $request->user();
        $filters = $this->filtersFromRequest($request);

        try {
            $workLogs = WorkLog::query()
                ->visibleTo($user)
                ->filter($filters)
                ->with('user:id,name,email')
                ->sorted($filters['sort'])
                ->get();

            $fileName = 'work-log-report-'.now()->format('Y-m-d').'.pdf';

            return Pdf::loadView('pdf.work-logs', [
                'workLogs' => $workLogs,
                'user' => $user,
                'filters' => $filters,
                'canManageStatus' => $user->isSupervisorOrAdmin(),
            ])
                ->setPaper('a4', 'portrait')
                ->setOptions([
                    'isHtml5ParserEnabled' => true,
                    'isRemoteEnabled' => true,
                    'chroot' => base_path(),
                    'tempDir' => sys_get_temp_dir(),
                ])
                ->download($fileName);
        } catch (\Exception $exception) {
            Log::error('PDF generation failed: '.$exception->getMessage());

            return response('The PDF report could not be generated. Please try again.', 500);
        }
    }

    /**
     * @return array{search: string, status: ?string, start_date: ?string, end_date: ?string, sort: string, per_page: int}
     */
    private function filtersFromRequest(Request $request): array
    {
        $status = $request->query('status');
        $perPage = (int) $request->query('per_page', self::DEFAULT_PER_PAGE);

        return [
            'search' => trim((string) $request->query('search', '')),
            'status' => in_array($status, WorkLog::getStatuses(), true) ? $status : null,
            'start_date' => $this->sanitizeDate($request->query('start_date')),
            'end_date' => $this->sanitizeDate($request->query('end_date')),
            'sort' => $request->query('sort') === 'oldest' ? 'oldest' : 'newest',
            'per_page' => in_array($perPage, self::PER_PAGE_OPTIONS, true) ? $perPage : self::DEFAULT_PER_PAGE,
        ];
    }

    private function sanitizeDate(mixed $value): ?string
    {
        if (! is_string($value) || $value === '') {
            return null;
        }

        $date = DateTimeImmutable::createFromFormat('Y-m-d', $value);

        return $date && $date->format('Y-m-d') === $value ? $value : null;
    }
}
