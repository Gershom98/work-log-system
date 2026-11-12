<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkLog extends Model
{
    use HasFactory;

    public const STATUS_SUBMITTED = 'submitted';

    public const STATUS_NO_DATA = 'no data';

    public const STATUS_REJECTED = 'rejected';

    public const STATUS_ASSIGNED = 'assigned';

    protected $fillable = [
        'requester_name',
        'user_id',
        'log_date',
        'title',
        'description',
        'status',
        'supervisor_comment',
        'rejection_reason',
    ];

    protected function casts(): array
    {
        return [
            'log_date' => 'date:Y-m-d',
        ];
    }

    public static function getStatuses(): array
    {
        return [
            self::STATUS_SUBMITTED,
            self::STATUS_NO_DATA,
            self::STATUS_REJECTED,
            self::STATUS_ASSIGNED,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeVisibleTo(Builder $query, User $user): Builder
    {
        if ($user->isSupervisorOrAdmin()) {
            return $query;
        }

        return $query->where('user_id', $user->id);
    }

    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query
            ->when(filled($filters['search'] ?? null), function (Builder $query) use ($filters) {
                $term = '%'.addcslashes(trim($filters['search']), '\\%_').'%';

                $query->where(fn (Builder $inner) => $inner
                    ->where('title', 'like', $term)
                    ->orWhere('requester_name', 'like', $term));
            })
            ->when(filled($filters['status'] ?? null), fn (Builder $query) => $query
                ->where('status', $filters['status']))
            ->when(filled($filters['user_id'] ?? null), fn (Builder $query) => $query
                ->where('user_id', $filters['user_id']))
            ->when(filled($filters['start_date'] ?? null), fn (Builder $query) => $query
                ->whereDate('log_date', '>=', $filters['start_date']))
            ->when(filled($filters['end_date'] ?? null), fn (Builder $query) => $query
                ->whereDate('log_date', '<=', $filters['end_date']));
    }

    public function scopeSorted(Builder $query, ?string $sort): Builder
    {
        return $sort === 'oldest'
            ? $query->orderBy('log_date')->orderBy('id')
            : $query->orderByDesc('log_date')->orderByDesc('id');
    }

    /**
     * @return array{total: int, submitted: int, no_data: int, rejected: int, assigned: int, active: int}
     */
    public static function statusSummary(Builder $query): array
    {
        $counts = (clone $query)
            ->reorder()
            ->selectRaw('status, COUNT(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        $summary = ['total' => (int) $counts->sum()];

        foreach (self::getStatuses() as $status) {
            $summary[str_replace(' ', '_', $status)] = (int) ($counts[$status] ?? 0);
        }

        $summary['active'] = $summary['submitted'] + $summary['assigned'];

        return $summary;
    }
}
