<?php

namespace App\Http\Requests;

use App\Models\WorkLog;

class StoreWorkLogRequest extends WorkLogRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', WorkLog::class);
    }
}
