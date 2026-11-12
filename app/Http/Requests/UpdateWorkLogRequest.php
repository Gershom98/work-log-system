<?php

namespace App\Http\Requests;

use App\Models\WorkLog;

class UpdateWorkLogRequest extends WorkLogRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('workLog'));
    }
}
