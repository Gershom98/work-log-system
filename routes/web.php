<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WorkLogController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Welcome Page
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Protected Routes (Inahitaji Login na Email Verification)
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Dashboard - Inatumia DashboardController ili kupata Takwimu (Stats) na Recent Logs
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile Management
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Daily Work Logs (Resource Routes)
    Route::get('/work-logs', [WorkLogController::class, 'index'])->name('work-logs.index');
    Route::get('/work-logs/create', [WorkLogController::class, 'create'])->name('work-logs.create');
    
    // 💡 ROUTE YA DOWNLOAD PDF (Lazima ikae juu ya /{workLog})
    Route::get('/work-logs/download-pdf', [WorkLogController::class, 'downloadPdf'])->name('work-logs.downloadPdf');

    Route::post('/work-logs', [WorkLogController::class, 'store'])->name('work-logs.store');
    Route::get('/work-logs/{workLog}', [WorkLogController::class, 'show'])->name('work-logs.show');
    Route::get('/work-logs/{workLog}/edit', [WorkLogController::class, 'edit'])->name('work-logs.edit');
    Route::put('/work-logs/{workLog}', [WorkLogController::class, 'update'])->name('work-logs.update');
    Route::delete('/work-logs/{workLog}', [WorkLogController::class, 'destroy'])->name('work-logs.destroy');
});

require __DIR__.'/auth.php';