<?php

use App\Http\Controllers\Api\WorkLogController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/work-logs', [WorkLogController::class, 'index'])->name('api.work-logs.index');
});
