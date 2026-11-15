<?php

namespace App\Support;

use App\Models\WorkLog;
use DateTimeImmutable;
use Illuminate\Http\Request;

class WorkLogFilters
{
    public const PER_PAGE_OPTIONS = [5, 10, 25, 50];

    public const DEFAULT_PER_PAGE = 10;

    /**
     * @param  array<int, int>  $perPageOptions
     * @return array{search: string, status: ?string, start_date: ?string, end_date: ?string, sort: string, per_page: int}
     */
    public static function fromRequest(Request $request, array $perPageOptions = self::PER_PAGE_OPTIONS, int $defaultPerPage = self::DEFAULT_PER_PAGE): array
    {
        $status = $request->query('status');
        $perPage = (int) $request->query('per_page', $defaultPerPage);

        return [
            'search' => trim((string) $request->query('search', '')),
            'status' => in_array($status, WorkLog::getStatuses(), true) ? $status : null,
            'start_date' => self::sanitizeDate($request->query('start_date')),
            'end_date' => self::sanitizeDate($request->query('end_date')),
            'sort' => $request->query('sort') === 'oldest' ? 'oldest' : 'newest',
            'per_page' => in_array($perPage, $perPageOptions, true) ? $perPage : $defaultPerPage,
        ];
    }

    private static function sanitizeDate(mixed $value): ?string
    {
        if (! is_string($value) || $value === '') {
            return null;
        }

        $date = DateTimeImmutable::createFromFormat('Y-m-d', $value);

        return $date && $date->format('Y-m-d') === $value ? $value : null;
    }
}
