<?php

namespace Tests\Feature;

use App\Http\Controllers\ApiTokenController;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ApiTokenTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_page_lists_the_users_tokens(): void
    {
        $user = User::factory()->create();
        $user->createToken('Dashboard', [ApiTokenController::ABILITY]);

        $this->actingAs($user)
            ->get('/profile')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Profile/Edit')
                ->has('tokens', 1)
                ->where('tokens.0.name', 'Dashboard')
                ->where('tokenLimit', ApiTokenController::MAX_TOKENS)
                ->where('apiEndpoint', url('/api/work-logs')));
    }

    public function test_a_user_can_create_a_token(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->from('/profile')
            ->post(route('api-tokens.store'), ['name' => 'Supervisor dashboard'])
            ->assertRedirect('/profile')
            ->assertSessionHas('plainTextToken');

        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_id' => $user->id,
            'name' => 'Supervisor dashboard',
        ]);
    }

    public function test_a_token_name_is_required(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->from('/profile')
            ->post(route('api-tokens.store'), ['name' => ''])
            ->assertSessionHasErrors('name');

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_the_number_of_tokens_is_capped(): void
    {
        $user = User::factory()->create();

        foreach (range(1, ApiTokenController::MAX_TOKENS) as $index) {
            $user->createToken("token {$index}", [ApiTokenController::ABILITY]);
        }

        $this->actingAs($user)
            ->from('/profile')
            ->post(route('api-tokens.store'), ['name' => 'One more'])
            ->assertSessionHas('error');

        $this->assertSame(ApiTokenController::MAX_TOKENS, $user->tokens()->count());
    }

    public function test_a_user_can_revoke_their_own_token(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('Dashboard', [ApiTokenController::ABILITY])->accessToken;

        $this->actingAs($user)
            ->from('/profile')
            ->delete(route('api-tokens.destroy', $token->id))
            ->assertRedirect('/profile')
            ->assertSessionHas('message');

        $this->assertDatabaseMissing('personal_access_tokens', ['id' => $token->id]);
    }

    public function test_a_user_cannot_revoke_someone_elses_token(): void
    {
        $owner = User::factory()->create();
        $token = $owner->createToken('Dashboard', [ApiTokenController::ABILITY])->accessToken;

        $this->actingAs(User::factory()->create())
            ->from('/profile')
            ->delete(route('api-tokens.destroy', $token->id))
            ->assertSessionHas('error');

        $this->assertDatabaseHas('personal_access_tokens', ['id' => $token->id]);
    }
}
