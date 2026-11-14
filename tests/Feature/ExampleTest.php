<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_land_on_the_sign_in_screen(): void
    {
        $this->get('/')->assertRedirect('/login');
    }

    public function test_signed_in_users_skip_the_sign_in_screen(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get('/')->assertRedirect('/work-logs');
    }
}
