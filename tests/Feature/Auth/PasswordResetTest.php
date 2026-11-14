<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_reset_password_link_screen_can_be_rendered(): void
    {
        $response = $this->get('/forgot-password');

        $response->assertStatus(200);
    }

    public function test_reset_password_link_can_be_requested(): void
    {
        Notification::fake();

        $user = User::factory()->create();

        $this->post('/forgot-password', ['email' => $user->email]);

        Notification::assertSentTo($user, ResetPassword::class);
    }

    public function test_reset_password_screen_can_be_rendered(): void
    {
        Notification::fake();

        $user = User::factory()->create();

        $this->post('/forgot-password', ['email' => $user->email]);

        Notification::assertSentTo($user, ResetPassword::class, function ($notification) {
            $response = $this->get('/reset-password/'.$notification->token);

            $response->assertStatus(200);

            return true;
        });
    }

    public function test_password_can_be_reset_with_valid_token(): void
    {
        Notification::fake();

        $user = User::factory()->create();

        $this->post('/forgot-password', ['email' => $user->email]);

        Notification::assertSentTo($user, ResetPassword::class, function ($notification) use ($user) {
            $response = $this->post('/reset-password', [
                'token' => $notification->token,
                'email' => $user->email,
                'password' => 'password',
                'password_confirmation' => 'password',
            ]);

            $response
                ->assertSessionHasNoErrors()
                ->assertRedirect(route('login'));

            return true;
        });
    }

    public function test_dev_reset_url_is_flashed_when_mail_is_only_logged_locally(): void
    {
        Notification::fake();
        $this->app['env'] = 'local';
        config([
            'mail.default' => 'log',
            'app.password_reset_dev_link' => true,
        ]);

        $user = User::factory()->create();

        $this->get('/forgot-password');
        $csrf = session()->token();

        $this->from('/forgot-password')
            ->post('/forgot-password', ['_token' => $csrf, 'email' => $user->email])
            ->assertSessionHas('status')
            ->assertSessionHas('dev_reset_url');

        $this->get('/forgot-password')->assertInertia(fn ($page) => $page
            ->component('Auth/ForgotPassword')
            ->where('dev_reset_url', fn ($url) => str_contains($url, '/reset-password/')));
    }

    public function test_dev_reset_url_is_not_exposed_when_the_flag_is_disabled(): void
    {
        Notification::fake();
        $this->app['env'] = 'local';
        config([
            'mail.default' => 'log',
            'app.password_reset_dev_link' => false,
        ]);

        $user = User::factory()->create();

        $this->get('/forgot-password');
        $csrf = session()->token();

        $this->from('/forgot-password')
            ->post('/forgot-password', ['_token' => $csrf, 'email' => $user->email])
            ->assertSessionHas('status')
            ->assertSessionMissing('dev_reset_url');
    }

    public function test_dev_reset_url_is_not_exposed_outside_local_env(): void
    {
        Notification::fake();
        $this->app['env'] = 'production';
        config([
            'mail.default' => 'log',
            'app.password_reset_dev_link' => true,
        ]);

        $user = User::factory()->create();

        $this->get('/forgot-password');
        $csrf = session()->token();

        $this->from('/forgot-password')
            ->post('/forgot-password', ['_token' => $csrf, 'email' => $user->email])
            ->assertSessionHas('status');

        $this->get('/forgot-password')->assertInertia(fn ($page) => $page
            ->where('dev_reset_url', null));
    }

    public function test_forgot_password_reports_when_mail_cannot_be_sent(): void
    {
        $mailer = \Mockery::mock();
        $mailer->shouldReceive('send')->andThrow(new \RuntimeException('mail api down'));

        Mail::shouldReceive('mailer')->andReturn($mailer);

        $user = User::factory()->create();

        $this->from('/forgot-password')
            ->post('/forgot-password', ['email' => $user->email])
            ->assertSessionHasErrors('email')
            ->assertRedirect('/forgot-password');

        $this->assertSame(
            'We could not send the reset email. Please try again later or contact your administrator.',
            session('errors')->first('email')
        );
    }

    public function test_page_flags_mail_as_not_ready_while_the_log_driver_is_used(): void
    {
        config(['mail.default' => 'log']);
        $this->get('/forgot-password')->assertInertia(fn ($page) => $page->where('mail_ready', false));

        config(['mail.default' => 'smtp']);
        $this->get('/forgot-password')->assertInertia(fn ($page) => $page->where('mail_ready', true));
    }
}
