<?php

use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\SecurityHeaders;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Trusting every proxy lets clients spoof X-Forwarded-For and defeat
        // the login throttle, so only trust what the operator explicitly lists.
        $proxies = env('TRUSTED_PROXIES');

        if (filled($proxies)) {
            $middleware->trustProxies(
                at: $proxies === '*' ? '*' : array_map('trim', explode(',', $proxies))
            );
        }

        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            SecurityHeaders::class,
        ]);

        // Register the admin middleware alias here
        $middleware->alias([
            'admin' => AdminMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Laravel converts TokenMismatchException into a 419 HttpException
        // before render callbacks run, so hook the finished response instead of
        // the exception type. A stale form (expired session, spin-down or
        // redeploy) then lands back on the page with a readable message instead
        // of the bare "419 Page Expired" screen.
        $exceptions->respond(function (Response $response) {
            if ($response->getStatusCode() !== 419) {
                return $response;
            }

            $message = 'Your session expired. Please try again.';

            if (request()->expectsJson()) {
                return response()->json(['message' => $message], 419);
            }

            return redirect()
                ->back()
                ->withInput(request()->except(['_token', 'password', 'password_confirmation']))
                ->with('error', $message);
        });
    })->create();
