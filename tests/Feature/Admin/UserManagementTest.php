<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_admin_cannot_access_user_management(): void
    {
        $user = User::factory()->create();
        $supervisor = User::factory()->supervisor()->create();

        $this->actingAs($user)->get(route('admin.users.index'))->assertRedirect(route('work-logs.index'));
        $this->actingAs($supervisor)->get(route('admin.users.index'))->assertRedirect(route('work-logs.index'));
    }

    public function test_admin_can_list_users(): void
    {
        $admin = User::factory()->admin()->create();
        User::factory()->count(3)->create();

        $this->actingAs($admin)
            ->get(route('admin.users.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Users/Index')
                ->has('users.data', 4));
    }

    public function test_admin_can_search_and_filter_users(): void
    {
        $admin = User::factory()->admin()->create();
        User::factory()->supervisor()->create(['name' => 'Neema Boss']);

        $this->actingAs($admin)
            ->get(route('admin.users.index', ['search' => 'Neema']))
            ->assertInertia(fn (Assert $page) => $page->has('users.data', 1));

        $this->actingAs($admin)
            ->get(route('admin.users.index', ['role' => User::ROLE_SUPERVISOR]))
            ->assertInertia(fn (Assert $page) => $page->has('users.data', 1));
    }

    public function test_admin_can_create_a_user_with_a_role(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->post(route('admin.users.store'), [
                'name' => '  New Supervisor  ',
                'email' => 'SUPERVISOR@EXAMPLE.COM',
                'password' => 'password123',
                'password_confirmation' => 'password123',
                'role' => User::ROLE_SUPERVISOR,
            ])
            ->assertRedirect(route('admin.users.index'));

        $this->assertDatabaseHas('users', [
            'name' => 'New Supervisor',
            'email' => 'supervisor@example.com',
            'role' => User::ROLE_SUPERVISOR,
        ]);
    }

    public function test_creating_a_user_rejects_invalid_roles(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->post(route('admin.users.store'), [
                'name' => 'Bad Role',
                'email' => 'bad-role@example.com',
                'password' => 'password123',
                'password_confirmation' => 'password123',
                'role' => 'owner',
            ])
            ->assertSessionHasErrors('role');
    }

    public function test_email_must_be_unique(): void
    {
        $admin = User::factory()->admin()->create();
        User::factory()->create(['email' => 'taken@example.com']);

        $this->actingAs($admin)
            ->post(route('admin.users.store'), [
                'name' => 'Duplicate',
                'email' => 'taken@example.com',
                'password' => 'password123',
                'password_confirmation' => 'password123',
                'role' => User::ROLE_USER,
            ])
            ->assertSessionHasErrors('email');
    }

    public function test_admin_can_update_a_user_without_changing_the_password(): void
    {
        $admin = User::factory()->admin()->create();
        $user = User::factory()->create();
        $originalPassword = $user->password;

        $this->actingAs($admin)
            ->put(route('admin.users.update', $user), [
                'name' => 'Renamed User',
                'email' => $user->email,
                'role' => User::ROLE_SUPERVISOR,
            ])
            ->assertRedirect(route('admin.users.index'));

        $user->refresh();

        $this->assertSame('Renamed User', $user->name);
        $this->assertSame(User::ROLE_SUPERVISOR, $user->role);
        $this->assertSame($originalPassword, $user->password);
    }

    public function test_admin_cannot_remove_their_own_admin_role(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->put(route('admin.users.update', $admin), [
                'name' => $admin->name,
                'email' => $admin->email,
                'role' => User::ROLE_USER,
            ])
            ->assertRedirect();

        $this->assertSame(User::ROLE_ADMIN, $admin->fresh()->role);
    }

    public function test_admin_cannot_delete_their_own_account(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->delete(route('admin.users.destroy', $admin))
            ->assertRedirect();

        $this->assertDatabaseHas('users', ['id' => $admin->id]);
    }

    public function test_admin_can_delete_another_user(): void
    {
        $admin = User::factory()->admin()->create();
        $user = User::factory()->create();

        $this->actingAs($admin)
            ->delete(route('admin.users.destroy', $user))
            ->assertRedirect(route('admin.users.index'));

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }
}
