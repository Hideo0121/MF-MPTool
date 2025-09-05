<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

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

    Route::get('entry', function () {
        return Inertia::render('Entry');
    })->name('entry.create');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
