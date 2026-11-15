<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\WorkLog;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiWorkLogTest extends TestCase
{
    use RefreshDatabase;

    public function test_requests_without_a_token_are_rejected(): void
    {
        $this->getJson('/api/work-logs')->assertUnauthorized();
    }

    public function test_a_token_only_sees_logs_visible_to_its_owner(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        $mine = WorkLog::factory()->for($user)->create();
        WorkLog::factory()->for($other)->create();

        $token = $user->createToken('dashboard', ['work-logs:read'])->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/work-logs')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $mine->id)
            ->assertJsonPath('data.0.submitted_by.email', $user->email);
    }

    public function test_supervisor_token_sees_every_log(): void
    {
        $supervisor = User::factory()->supervisor()->create();
        WorkLog::factory()->count(3)->create();

        $token = $supervisor->createToken('dashboard', ['work-logs:read'])->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/work-logs')
            ->assertOk()
            ->assertJsonCount(3, 'data')
            ->assertJsonPath('meta.total', 3);
    }

    public function test_filters_and_pagination_apply(): void
    {
        $supervisor = User::factory()->supervisor()->create();
        WorkLog::factory()->count(2)->rejected()->create();
        WorkLog::factory()->create(['status' => WorkLog::STATUS_SUBMITTED]);

        $token = $supervisor->createToken('dashboard', ['work-logs:read'])->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/work-logs?status=rejected&per_page=5')
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('meta.total', 2)
            ->assertJsonPath('data.0.status', WorkLog::STATUS_REJECTED);
    }

    public function test_solution_is_exposed_for_the_downstream_system(): void
    {
        $user = User::factory()->create();
        $log = WorkLog::factory()->for($user)->create();
        $log->forceFill([
            'ai_solutions' => 'Reset the account and notify the requester.',
            'ai_solutions_generated_at' => now(),
        ])->save();

        $token = $user->createToken('dashboard', ['work-logs:read'])->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/work-logs')
            ->assertOk()
            ->assertJsonPath('data.0.solution', 'Reset the account and notify the requester.');
    }

    public function test_a_token_without_the_read_ability_is_forbidden(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('elsewhere', ['reports:write'])->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/work-logs')
            ->assertForbidden();
    }
}
