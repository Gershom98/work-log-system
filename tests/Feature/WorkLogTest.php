<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\WorkLog;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class WorkLogTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get(route('work-logs.index'))->assertRedirect(route('login'));
    }

    public function test_regular_user_only_sees_their_own_logs(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        $mine = WorkLog::factory()->for($user)->create();
        WorkLog::factory()->for($other)->create();

        $this->actingAs($user)
            ->get(route('work-logs.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('WorkLogs/Index')
                ->has('logs.data', 1)
                ->where('logs.data.0.id', $mine->id)
                ->where('canManageStatus', false));
    }

    public function test_supervisor_sees_logs_from_every_user(): void
    {
        $supervisor = User::factory()->supervisor()->create();
        WorkLog::factory()->count(3)->create();

        $this->actingAs($supervisor)
            ->get(route('work-logs.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('logs.data', 3)
                ->where('canManageStatus', true));
    }

    public function test_user_cannot_view_someone_elses_log(): void
    {
        $user = User::factory()->create();
        $log = WorkLog::factory()->create();

        $this->actingAs($user)->get(route('work-logs.show', $log))->assertForbidden();
    }

    public function test_manager_can_view_any_log(): void
    {
        $admin = User::factory()->admin()->create();
        $log = WorkLog::factory()->create();

        $this->actingAs($admin)->get(route('work-logs.show', $log))->assertOk();
    }

    public function test_regular_user_creation_forces_submitted_status(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('work-logs.store'), [
                'requester_name' => '  Jane Doe  ',
                'title' => 'Laptop replacement',
                'description' => 'Screen is cracked.',
                'log_date' => '2026-11-10',
                'status' => WorkLog::STATUS_ASSIGNED,
            ])
            ->assertRedirect(route('work-logs.index'));

        $this->assertDatabaseHas('work_logs', [
            'user_id' => $user->id,
            'requester_name' => 'Jane Doe',
            'status' => WorkLog::STATUS_SUBMITTED,
        ]);
    }

    public function test_manager_can_reject_with_a_reason(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->post(route('work-logs.store'), [
                'requester_name' => 'Jane Doe',
                'title' => 'Laptop replacement',
                'log_date' => '2026-11-10',
                'status' => WorkLog::STATUS_REJECTED,
                'rejection_reason' => 'Missing the asset tag for the device.',
            ])
            ->assertRedirect(route('work-logs.index'));

        $this->assertDatabaseHas('work_logs', [
            'status' => WorkLog::STATUS_REJECTED,
            'rejection_reason' => 'Missing the asset tag for the device.',
        ]);
    }

    public function test_rejection_requires_a_reason(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->post(route('work-logs.store'), [
                'requester_name' => 'Jane Doe',
                'title' => 'Laptop replacement',
                'log_date' => '2026-11-10',
                'status' => WorkLog::STATUS_REJECTED,
            ])
            ->assertSessionHasErrors('rejection_reason');
    }

    public function test_changing_status_away_from_rejected_clears_the_reason(): void
    {
        $admin = User::factory()->admin()->create();
        $log = WorkLog::factory()->rejected()->create();

        $this->actingAs($admin)
            ->put(route('work-logs.update', $log), [
                'requester_name' => $log->requester_name,
                'title' => $log->title,
                'log_date' => $log->log_date->toDateString(),
                'status' => WorkLog::STATUS_ASSIGNED,
            ])
            ->assertRedirect(route('work-logs.index'));

        $this->assertDatabaseHas('work_logs', [
            'id' => $log->id,
            'status' => WorkLog::STATUS_ASSIGNED,
            'rejection_reason' => null,
        ]);
    }

    public function test_regular_user_can_set_status_to_assigned(): void
    {
        $user = User::factory()->create();
        $log = WorkLog::factory()->for($user)->create(['status' => WorkLog::STATUS_SUBMITTED]);

        $this->actingAs($user)
            ->put(route('work-logs.update', $log), [
                'requester_name' => $log->requester_name,
                'title' => 'Updated title',
                'log_date' => $log->log_date->toDateString(),
                'status' => WorkLog::STATUS_ASSIGNED,
            ])
            ->assertRedirect(route('work-logs.index'));

        $this->assertDatabaseHas('work_logs', [
            'id' => $log->id,
            'title' => 'Updated title',
            'status' => WorkLog::STATUS_ASSIGNED,
        ]);
    }

    public function test_regular_user_cannot_set_manager_only_statuses(): void
    {
        $user = User::factory()->create();
        $log = WorkLog::factory()->for($user)->assigned()->create();

        foreach ([WorkLog::STATUS_REJECTED, WorkLog::STATUS_NO_DATA] as $status) {
            $this->actingAs($user)
                ->put(route('work-logs.update', $log), [
                    'requester_name' => $log->requester_name,
                    'title' => $log->title,
                    'log_date' => $log->log_date->toDateString(),
                    'status' => $status,
                    'rejection_reason' => 'Not allowed for regular users.',
                ])
                ->assertSessionHasErrors('status');
        }

        $this->assertDatabaseHas('work_logs', [
            'id' => $log->id,
            'status' => WorkLog::STATUS_ASSIGNED,
        ]);
    }

    public function test_user_cannot_delete_someone_elses_log(): void
    {
        $user = User::factory()->create();
        $log = WorkLog::factory()->create();

        $this->actingAs($user)->delete(route('work-logs.destroy', $log))->assertForbidden();

        $this->assertDatabaseHas('work_logs', ['id' => $log->id]);
    }

    public function test_owner_can_delete_their_log(): void
    {
        $user = User::factory()->create();
        $log = WorkLog::factory()->for($user)->create();

        $this->actingAs($user)
            ->delete(route('work-logs.destroy', $log))
            ->assertRedirect(route('work-logs.index'));

        $this->assertDatabaseMissing('work_logs', ['id' => $log->id]);
    }

    public function test_filters_by_search_status_and_date_range(): void
    {
        $admin = User::factory()->admin()->create();

        $match = WorkLog::factory()->create([
            'title' => 'Printer repair',
            'status' => WorkLog::STATUS_ASSIGNED,
            'log_date' => '2026-11-05',
        ]);
        WorkLog::factory()->create([
            'title' => 'Printer repair',
            'status' => WorkLog::STATUS_REJECTED,
            'log_date' => '2026-11-05',
        ]);
        WorkLog::factory()->create([
            'title' => 'Network issue',
            'status' => WorkLog::STATUS_ASSIGNED,
            'log_date' => '2026-10-01',
        ]);

        $this->actingAs($admin)
            ->get(route('work-logs.index', [
                'search' => 'Printer',
                'status' => WorkLog::STATUS_ASSIGNED,
                'start_date' => '2026-11-01',
                'end_date' => '2026-11-30',
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('logs.data', 1)
                ->where('logs.data.0.id', $match->id)
                ->where('summary.total', 1));
    }

    public function test_summary_counts_reflect_visible_logs(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        WorkLog::factory()->for($user)->count(2)->create();
        WorkLog::factory()->for($user)->assigned()->create();
        WorkLog::factory()->for($other)->rejected()->create();

        $this->actingAs($user)
            ->get(route('work-logs.index'))
            ->assertInertia(fn (Assert $page) => $page
                ->where('summary.total', 3)
                ->where('summary.submitted', 2)
                ->where('summary.assigned', 1)
                ->where('summary.active', 3)
                ->where('summary.rejected', 0));
    }

    public function test_report_can_be_downloaded_as_pdf(): void
    {
        $admin = User::factory()->admin()->create();
        WorkLog::factory()->count(2)->create();

        $response = $this->actingAs($admin)->get(route('work-logs.downloadPdf'));

        $response->assertOk();
        $this->assertStringContainsString('application/pdf', $response->headers->get('content-type'));
    }

    public function test_regular_user_can_update_their_assigned_log(): void
    {
        $user = User::factory()->create();
        $log = WorkLog::factory()->for($user)->assigned()->create();

        $this->actingAs($user)->get(route('work-logs.edit', $log))->assertOk();

        $this->actingAs($user)
            ->put(route('work-logs.update', $log), [
                'requester_name' => $log->requester_name,
                'title' => 'Added progress notes',
                'log_date' => $log->log_date->toDateString(),
            ])
            ->assertRedirect(route('work-logs.index'));

        $this->assertDatabaseHas('work_logs', [
            'id' => $log->id,
            'title' => 'Added progress notes',
            'status' => WorkLog::STATUS_ASSIGNED,
        ]);
    }

    public function test_regular_user_cannot_update_a_rejected_log(): void
    {
        $user = User::factory()->create();
        $log = WorkLog::factory()->for($user)->rejected()->create();

        $this->actingAs($user)->get(route('work-logs.edit', $log))->assertForbidden();

        $this->actingAs($user)
            ->put(route('work-logs.update', $log), [
                'requester_name' => $log->requester_name,
                'title' => 'Fixed the details',
                'log_date' => $log->log_date->toDateString(),
            ])
            ->assertForbidden();

        $this->assertDatabaseHas('work_logs', [
            'id' => $log->id,
            'title' => $log->title,
        ]);
    }

    public function test_regular_user_cannot_update_a_no_data_log(): void
    {
        $user = User::factory()->create();
        $log = WorkLog::factory()->for($user)->noData()->create();

        $this->actingAs($user)->get(route('work-logs.edit', $log))->assertForbidden();

        $this->actingAs($user)
            ->put(route('work-logs.update', $log), [
                'requester_name' => $log->requester_name,
                'title' => 'Fixed the details',
                'log_date' => $log->log_date->toDateString(),
            ])
            ->assertForbidden();
    }

    public function test_regular_user_cannot_delete_an_assigned_log(): void
    {
        $user = User::factory()->create();
        $log = WorkLog::factory()->for($user)->assigned()->create();

        $this->actingAs($user)->delete(route('work-logs.destroy', $log))->assertForbidden();

        $this->assertDatabaseHas('work_logs', ['id' => $log->id]);
    }

    public function test_supervisor_can_update_someone_elses_log(): void
    {
        $supervisor = User::factory()->supervisor()->create();
        $log = WorkLog::factory()->assigned()->create();

        $this->actingAs($supervisor)
            ->put(route('work-logs.update', $log), [
                'requester_name' => $log->requester_name,
                'title' => 'Reviewed by supervisor',
                'log_date' => $log->log_date->toDateString(),
                'status' => $log->status,
            ])
            ->assertRedirect(route('work-logs.index'));

        $this->assertDatabaseHas('work_logs', [
            'id' => $log->id,
            'title' => 'Reviewed by supervisor',
        ]);
    }

    public function test_index_exposes_per_log_abilities(): void
    {
        $user = User::factory()->create();
        $submitted = WorkLog::factory()->for($user)->create([
            'status' => WorkLog::STATUS_SUBMITTED,
            'log_date' => '2026-11-12',
        ]);
        $assigned = WorkLog::factory()->for($user)->assigned()->create([
            'log_date' => '2026-11-12',
        ]);

        $this->actingAs($user)
            ->get(route('work-logs.index', ['sort' => 'id', 'per_page' => 10]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('logs.data.0.id', $assigned->id)
                ->where('logs.data.0.can.update', true)
                ->where('logs.data.0.can.delete', false)
                ->where('logs.data.1.id', $submitted->id)
                ->where('logs.data.1.can.update', true)
                ->where('logs.data.1.can.delete', true));
    }
}
