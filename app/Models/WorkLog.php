<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkLog extends Model  {
    protected $fillable = [
        'requester_name',
        'user_id',
        'log_date',
        'title',
        'description',
        'hours_spent',
        'status',
        'supervisor_comment',
        'rejection_reason'
    ];

    // Status Constants
    public const STATUS_SUBMITTED = 'submitted';
    public const STATUS_NO_DATA   = 'no data';
    public const STATUS_REJECTED  = 'rejected';
    public const STATUS_ASSIGNED  = 'assigned';

    /**
    * Pata orodha ya status zote zinazokubalika.
    */
    public static function getStatuses(): array {
        return [
            self::STATUS_SUBMITTED,
            self::STATUS_NO_DATA,
            self::STATUS_REJECTED,
            self::STATUS_ASSIGNED,
        ];
    }

    public function user()  {
        return $this->belongsTo( User::class );
    }
}