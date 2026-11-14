<?php

namespace App\Http\Requests;

class UpdateWorkLogRequest extends WorkLogRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('workLog'));
    }
}
