<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\WorkLog;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WorkLog>
 */
class WorkLogFactory extends Factory
{
    protected $model = WorkLog::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'requester_name' => fake()->name(),
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(),
            'log_date' => fake()->dateTimeBetween('-30 days', 'now')->format('Y-m-d'),
            'status' => WorkLog::STATUS_SUBMITTED,
            'supervisor_comment' => null,
            'rejection_reason' => null,
        ];
    }

    public function assigned(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => WorkLog::STATUS_ASSIGNED,
        ]);
    }

    public function noData(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => WorkLog::STATUS_NO_DATA,
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => WorkLog::STATUS_REJECTED,
            'rejection_reason' => fake()->sentence(12),
        ]);
    }
}
