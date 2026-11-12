<?php

namespace App\Http\Requests;

use App\Models\WorkLog;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

abstract class WorkLogRequest extends FormRequest
{
    public function rules(): array
    {
        $rules = [
            'requester_name' => ['required', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'log_date' => ['required', 'date'],
        ];

        if ($this->user()->isSupervisorOrAdmin()) {
            $rules['status'] = ['required', Rule::in(WorkLog::getStatuses())];
            $rules['rejection_reason'] = [
                'nullable',
                'string',
                'min:5',
                'max:1000',
                'required_if:status,'.WorkLog::STATUS_REJECTED,
            ];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'rejection_reason.required_if' => 'A rejection reason is required when the status is rejected.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'requester_name' => is_string($this->requester_name) ? trim($this->requester_name) : $this->requester_name,
            'title' => is_string($this->title) ? trim($this->title) : $this->title,
        ]);
    }
}
