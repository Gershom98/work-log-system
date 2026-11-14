<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ManualDownloadTest extends TestCase
{
    use RefreshDatabase;

    public function test_signed_in_users_can_download_the_training_manual(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('manual.download'))
            ->assertOk()
            ->assertDownload('WorkLog-System-Training-Manual.pdf');
    }

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get(route('manual.download'))
            ->assertRedirect(route('login'));
    }
}
