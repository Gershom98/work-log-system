<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WorkLogController;
use App\Http\Middleware\SetLocale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// The sign-in screen is the entry point; signed-in users skip straight to their logs.
Route::get('/', function () {
    return redirect()->route(auth()->check() ? 'work-logs.index' : 'login');
})->name('home');

// Language switching is available to guests and signed-in users alike.
Route::post('/language/{locale}', function (Request $request, string $locale) {
    abort_unless(in_array($locale, SetLocale::SUPPORTED, true), 404);

    $request->session()->put('locale', $locale);

    return back();
})->name('language.switch');

// Protected Routes (Requires Login and Email Verification)
Route::middleware(['auth', 'verified'])->group(function () {

    // Training manual PDF, available to every signed-in user.
    Route::get('/manual', function () {
        $path = resource_path('manual/WorkLog-System-Training-Manual.pdf');

        abort_unless(is_file($path), 404);

        return response()->download($path);
    })->name('manual.download');

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile Management
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Daily Work Logs (Resource Routes)
    Route::get('/work-logs/download-pdf', [WorkLogController::class, 'downloadPdf'])->name('work-logs.downloadPdf');
    Route::get('/work-logs', [WorkLogController::class, 'index'])->name('work-logs.index');
    Route::get('/work-logs/create', [WorkLogController::class, 'create'])->name('work-logs.create');
    Route::post('/work-logs', [WorkLogController::class, 'store'])->name('work-logs.store');
    Route::get('/work-logs/{workLog}', [WorkLogController::class, 'show'])->name('work-logs.show');
    Route::get('/work-logs/{workLog}/edit', [WorkLogController::class, 'edit'])->name('work-logs.edit');
    Route::post('/work-logs/{workLog}/solutions', [WorkLogController::class, 'generateSolutions'])
        ->name('work-logs.solutions')
        ->middleware('throttle:10,1');
    Route::put('/work-logs/{workLog}', [WorkLogController::class, 'update'])->name('work-logs.update');
    Route::delete('/work-logs/{workLog}', [WorkLogController::class, 'destroy'])->name('work-logs.destroy');

    // 🔒 Admin Only Routes (User Management CRUD)
    Route::middleware(['admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::resource('users', UserController::class)->except(['show']);
    });
});

require __DIR__.'/auth.php';
