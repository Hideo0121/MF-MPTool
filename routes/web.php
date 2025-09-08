<?php

use App\Http\Controllers\EntryController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('entry.create');
    } else {
        return redirect()->route('login');
    }
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('entry', [EntryController::class, 'create'])->name('entry.create');
    Route::post('entry', [EntryController::class, 'store'])->name('entry.store');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
