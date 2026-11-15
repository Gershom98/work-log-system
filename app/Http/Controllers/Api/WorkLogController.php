<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\ApiTokenController;
use App\Http\Controllers\Controller;
use App\Http\Resources\WorkLogResource;
use App\Models\WorkLog;
use App\Support\WorkLogFilters;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class WorkLogController extends Controller
{
    /**
     * Read-only feed for the downstream system that consumes the reports.
     * Tokens are scoped to their owner, so a regular user only sees their
     * own logs while supervisors and admins see everything.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        abort_unless($request->user()->tokenCan(ApiTokenController::ABILITY), 403);

        $filters = WorkLogFilters::fromRequest($request, [5, 10, 25, 50, 100], 25);

        $logs = WorkLog::query()
            ->visibleTo($request->user())
            ->filter($filters)
            ->with('user:id,name,email')
            ->sorted($filters['sort'])
            ->paginate($filters['per_page'])
            ->withQueryString();

        return WorkLogResource::collection($logs);
    }
}
