<?php

use App\Http\Controllers\EntryController;
use App\Http\Controllers\LineUidEntryController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

// Redirect root URL based on authentication status
Route::get('/', function () {
    if (Auth::check()) {
        // If logged in, redirect to the entry form creation page
        return redirect()->route('entry.create');
    } else {
        // If not logged in, redirect to the login page
        return redirect()->route('login');
    }
})->name('home');

// The 'dashboard' route, also pointing to the entry form creation page
Route::get('/dashboard', [EntryController::class, 'create'])->middleware(['auth', 'verified'])->name('dashboard');

// Group of routes that require authentication
Route::middleware('auth')->group(function () {
    Route::get('/entry', [EntryController::class, 'create'])->name('entry.create');
    Route::post('/entry', [EntryController::class, 'store'])->name('entry.store');
    Route::get('/line-uid-entry', [LineUidEntryController::class, 'index'])->name('line-uid-entry.index');
    Route::post('/line-uid-entry', [LineUidController::class, 'store'])->name('line-uid-entry.store');
});

// Temporary debug route to check APP_NAME (can be removed later)
Route::get('/debug-app-name', function () {
    return response()->json([
        'app_name_from_config' => config('app.name'),
        'app_name_from_env' => env('APP_NAME'),
    ]);
});

// Include authentication and settings routes
require __DIR__ . '/auth.php';
require __DIR__ . '/settings.php';
