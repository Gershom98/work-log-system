<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\WorkLog;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WorkLogExportTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get(route('work-logs.exportCsv'))->assertRedirect(route('login'));
    }

    public function test_csv_contains_only_the_logs_the_user_can_see(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        WorkLog::factory()->for($user)->create(['title' => 'Mine to export']);
        WorkLog::factory()->for($other)->create(['title' => 'Someone else log']);

        $response = $this->actingAs($user)->get(route('work-logs.exportCsv'));

        $response->assertOk();
        $response->assertHeader('content-type', 'text/csv; charset=UTF-8');

        $content = $response->streamedContent();

        $this->assertStringStartsWith("\xEF\xBB\xBF", $content);
        $this->assertStringContainsString('Task title', $content);
        $this->assertStringContainsString('Mine to export', $content);
        $this->assertStringNotContainsString('Someone else log', $content);
    }

    public function test_csv_honours_the_status_filter(): void
    {
        $supervisor = User::factory()->supervisor()->create();
        WorkLog::factory()->rejected()->create(['title' => 'Stale printer']);
        WorkLog::factory()->create(['title' => 'Fresh ticket']);

        $content = $this->actingAs($supervisor)
            ->get(route('work-logs.exportCsv', ['status' => 'rejected']))
            ->assertOk()
            ->streamedContent();

        $this->assertStringContainsString('Stale printer', $content);
        $this->assertStringNotContainsString('Fresh ticket', $content);
    }
}
