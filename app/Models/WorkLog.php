<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkLog extends Model {
    protected $fillable = [
        'requester_name',
        'user_id',
        'log_date',
        'title',
        'hours_spent',
        'status',
        'supervisor_comment'
    ];

    public function user() {
        return $this->belongsTo( User::class );
    }
}