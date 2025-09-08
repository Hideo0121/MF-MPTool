<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEntryRequest;
use App\Models\LineUidEntry;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class EntryController extends Controller
{
    /**
     * Show the entry form.
     */
    public function create(): Response
    {
        return Inertia::render('Entry');
    }

    /**
     * Store a new entry.
     */
    public function store(StoreEntryRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        // Get the current worker's worker_code
        $worker = $request->user(); // This is actually a Worker model based on auth config
        $workerCode = $worker->worker_code;

        LineUidEntry::create([
            'line_uid' => $validated['line_uid'],
            'month' => $validated['month'],
            'day' => $validated['day'],
            'hour' => $validated['hour'],
            'minute' => $validated['minute'],
            'ng_reason_id' => $validated['ng_reason_id'],
            'worker_code' => $workerCode,
        ]);

        return redirect()->back()->with('success', '登録が完了しました');
    }
}
