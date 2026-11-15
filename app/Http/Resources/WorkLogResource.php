<?php

namespace App\Http\Resources;

use App\Models\WorkLog;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin WorkLog
 */
class WorkLogResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'log_date' => $this->log_date?->toDateString(),
            'requester_name' => $this->requester_name,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'rejection_reason' => $this->rejection_reason,
            'solution' => $this->ai_solutions,
            'solution_generated_at' => $this->ai_solutions_generated_at
                ? \Illuminate\Support\Carbon::parse($this->ai_solutions_generated_at)->toIso8601String()
                : null,
            'submitted_by' => $this->whenLoaded('user', fn () => [
                'name' => $this->user->name,
                'email' => $this->user->email,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
