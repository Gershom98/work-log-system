<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\WorkLog;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class WorkLogAiSolutionsTest extends TestCase
{
    use RefreshDatabase;

    private const SAMPLE = 'I found that the queue worker had stopped after a memory spike, so I restarted the worker and cleared the stale cache, and jobs are now processing normally.';

    private function fakeGemini(string $answer = self::SAMPLE): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [[
                    'content' => ['parts' => [['text' => $answer]]],
                ]],
            ]),
        ]);
    }

    public function test_owner_can_generate_and_store_solutions(): void
    {
        $this->fakeGemini();
        config(['services.gemini.key' => 'test-key']);

        $user = User::factory()->create();
        $workLog = WorkLog::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user)
            ->post(route('work-logs.solutions', $workLog))
            ->assertRedirect()
            ->assertSessionHas('message');

        $workLog->refresh();

        $this->assertSame(self::SAMPLE, $workLog->ai_solutions);
        $this->assertNotNull($workLog->ai_solutions_generated_at);

        Http::assertSent(function ($request) use ($workLog) {
            return $request->hasHeader('x-goog-api-key', 'test-key')
                && str_contains($request['contents'][0]['parts'][0]['text'], $workLog->title);
        });
    }

    public function test_multi_line_ai_answers_are_collapsed_into_one_paragraph(): void
    {
        $this->fakeGemini("1. Restarted the worker.\n2. Cleared the cache.\n\nThe queue is healthy again.");
        config(['services.gemini.key' => 'test-key']);

        $user = User::factory()->create();
        $workLog = WorkLog::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user)
            ->post(route('work-logs.solutions', $workLog))
            ->assertRedirect();

        $solution = $workLog->fresh()->ai_solutions;

        $this->assertStringNotContainsString("\n", $solution);
        $this->assertSame('1. Restarted the worker. 2. Cleared the cache. The queue is healthy again.', $solution);
    }

    public function test_solutions_are_not_requested_without_an_api_key(): void    {
        Http::fake();
        config(['services.gemini.key' => null]);

        $user = User::factory()->create();
        $workLog = WorkLog::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user)
            ->post(route('work-logs.solutions', $workLog))
            ->assertRedirect()
            ->assertSessionHas('error', fn ($message) => str_contains($message, 'GEMINI_API_KEY'));

        $this->assertNull($workLog->fresh()->ai_solutions);
        Http::assertNothingSent();
    }

    public function test_api_failure_keeps_previous_solutions(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response(['error' => 'boom'], 500),
        ]);
        config(['services.gemini.key' => 'test-key']);

        $user = User::factory()->create();
        $workLog = WorkLog::factory()->create([
            'user_id' => $user->id,
            'ai_solutions' => 'Existing answer.',
        ]);

        $this->actingAs($user)
            ->post(route('work-logs.solutions', $workLog))
            ->assertRedirect()
            ->assertSessionHas('error', fn ($message) => str_contains($message, 'HTTP 500'));

        $this->assertSame('Existing answer.', $workLog->fresh()->ai_solutions);
    }

    public function test_other_users_cannot_generate_solutions(): void
    {
        Http::fake();
        config(['services.gemini.key' => 'test-key']);

        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $workLog = WorkLog::factory()->create(['user_id' => $owner->id]);

        $this->actingAs($intruder)
            ->post(route('work-logs.solutions', $workLog))
            ->assertForbidden();

        $this->assertNull($workLog->fresh()->ai_solutions);
        Http::assertNothingSent();
    }
}
