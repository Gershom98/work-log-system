<?php

namespace App\Http\Requests;

use App\Models\WorkLog;

class StoreWorkLogRequest extends WorkLogRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', WorkLog::class);
    }

    public function rules(): array
    {
        $rules = parent::rules();
        $rules['log_date'][] = 'before_or_equal:today';

        return $rules;
    }
}
