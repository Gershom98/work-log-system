<?php

namespace App\Http\Requests;

use App\Models\WorkLog;
use Closure;

class UpdateWorkLogRequest extends WorkLogRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('workLog'));
    }

    public function rules(): array
    {
        $rules = parent::rules();
        $workLog = $this->route('workLog');

        if ($workLog instanceof WorkLog) {
            $rules['log_date'][] = $this->notBeforeSubmissionDate($workLog);
            $rules['log_date'][] = $this->notInFuture($workLog);
        }

        return $rules;
    }

    /**
     * The work date may not be moved back before the day the log was
     * submitted. Logs that were already recorded earlier keep their
     * original date so existing records stay editable.
     */
    private function notBeforeSubmissionDate(WorkLog $workLog): Closure
    {
        $submittedOn = $workLog->created_at->toDateString();
        $originalDate = $workLog->log_date?->toDateString();

        return function (string $attribute, mixed $value, Closure $fail) use ($submittedOn, $originalDate) {
            if (! is_string($value) || $value === '') {
                return;
            }

            $date = substr($value, 0, 10);

            if ($date >= $submittedOn || $date === $originalDate) {
                return;
            }

            $fail(__('The work date cannot be earlier than the day this log was submitted.'));
        };
    }

    /**
     * New dates may not be in the future. A log that was already recorded with
     * a future date keeps its original date so it stays editable.
     */
    private function notInFuture(WorkLog $workLog): Closure
    {
        $today = now()->toDateString();
        $originalDate = $workLog->log_date?->toDateString();

        return function (string $attribute, mixed $value, Closure $fail) use ($today, $originalDate) {
            if (! is_string($value) || $value === '') {
                return;
            }

            $date = substr($value, 0, 10);

            if ($date <= $today || $date === $originalDate) {
                return;
            }

            $fail(__('The work date cannot be in the future.'));
        };
    }
}
