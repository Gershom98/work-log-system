<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ApiTokenController extends Controller
{
    public const MAX_TOKENS = 5;

    public const ABILITY = 'work-logs:read';

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:60'],
        ]);

        $user = $request->user();

        if ($user->tokens()->count() >= self::MAX_TOKENS) {
            return back()->with('error', __('You can keep at most :count API tokens. Revoke one first.', ['count' => self::MAX_TOKENS]));
        }

        $token = $user->createToken($data['name'], [self::ABILITY]);

        return back()->with('plainTextToken', $token->plainTextToken);
    }

    public function destroy(Request $request, int $token): RedirectResponse
    {
        $deleted = $request->user()->tokens()->whereKey($token)->delete();

        if (! $deleted) {
            return back()->with('error', __('API token not found.'));
        }

        return back()->with('message', __('API token revoked.'));
    }
}
