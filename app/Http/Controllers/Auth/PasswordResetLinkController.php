<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
            // The log driver writes the mail to storage/logs, yet the broker
            // still reports success, so the page must not claim an email was sent.
            'mail_ready' => config('mail.default') !== 'log',
            'dev_reset_url' => session('dev_reset_url'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        // We will send the password reset link to this user. Once we have attempted
        // to send the link, we will examine the response then see the message we
        // need to show to the user. Finally, we'll send out a proper response.
        try {
            $status = Password::sendResetLink($request->only('email'));
        } catch (Throwable $e) {
            // A failing mail API (bad key, unverified sender) would otherwise
            // surface as a 500 instead of something the user can act on.
            report($e);

            throw ValidationException::withMessages([
                'email' => 'We could not send the reset email. Please try again later or contact your administrator.',
            ]);
        }

        if ($status == Password::RESET_LINK_SENT) {
            return back()
                ->with('status', __($status))
                ->with('dev_reset_url', $this->localResetUrl($request->email));
        }

        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }

    /**
     * When mail is only written to the log there is no inbox to open,
     * so surface a ready-to-use reset link on the page in local development.
     */
    private function localResetUrl(string $email): ?string
    {
        if (
            ! config('app.password_reset_dev_link')
            || ! app()->environment('local')
            || config('mail.default') !== 'log'
        ) {
            return null;
        }

        $user = User::where('email', $email)->first();

        if (! $user) {
            return null;
        }

        return route('password.reset', [
            'token' => Password::broker()->createToken($user),
            'email' => $user->email,
        ], false);
    }
}
