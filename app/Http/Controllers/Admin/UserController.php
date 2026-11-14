<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string) $request->query('search', ''));
        $role = $request->query('role');

        $filters = [
            'search' => $search,
            'role' => in_array($role, User::getRoles(), true) ? $role : null,
        ];

        $users = User::query()
            ->when($search !== '', function ($query) use ($search) {
                $term = '%'.addcslashes($search, '\\%_').'%';

                $query->where(fn ($inner) => $inner
                    ->where('name', 'like', $term)
                    ->orWhere('email', 'like', $term));
            })
            ->when($filters['role'], fn ($query, $role) => $query->where('role', $role))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create', [
            'roles' => User::getRoles(),
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        User::create($request->validated());

        return redirect()
            ->route('admin.users.index')
            ->with('message', __('User created successfully.'));
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user->only(['id', 'name', 'email', 'role', 'created_at']),
            'roles' => User::getRoles(),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();

        if ($request->user()->id === $user->id && $data['role'] !== User::ROLE_ADMIN) {
            return back()->with('error', __('You cannot remove your own admin role.'));
        }

        if (
            $user->isAdmin()
            && $data['role'] !== User::ROLE_ADMIN
            && User::where('role', User::ROLE_ADMIN)->count() <= 1
        ) {
            return back()->with('error', __('At least one admin account must remain.'));
        }

        if (blank($data['password'] ?? null)) {
            unset($data['password']);
        }

        $user->update($data);

        return redirect()
            ->route('admin.users.index')
            ->with('message', __('User updated successfully.'));
    }

    public function destroy(Request $request, User $user)
    {
        if ($request->user()->id === $user->id) {
            return back()->with('error', __('You cannot delete your own account.'));
        }

        if ($user->isAdmin() && User::where('role', User::ROLE_ADMIN)->count() <= 1) {
            return back()->with('error', __('At least one admin account must remain.'));
        }

        $user->delete();

        return redirect()
            ->route('admin.users.index')
            ->with('message', __('User deleted successfully.'));
    }
}
