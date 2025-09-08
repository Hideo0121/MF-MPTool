<?php

use App\Http\Controllers\Admin\NgReasonController as AdminNgReasonController;
use App\Http\Controllers\Admin\WorkerController as AdminWorkerController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LineUidEntryController;
use App\Http\Controllers\NgReasonController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::apiResource('entries', LineUidEntryController::class)->only(['store']);
    Route::get('ng-reasons', [NgReasonController::class, 'index']);

    // J04 user specific routes
    Route::middleware('j04')->group(function () {
        Route::post('workers', [AdminWorkerController::class, 'store']);
    });

    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::apiResource('workers', AdminWorkerController::class);
        Route::apiResource('ng-reasons', AdminNgReasonController::class);
    });
});
