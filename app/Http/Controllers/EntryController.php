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

        // Start building the query to check for duplicates
        $duplicateCheckQuery = LineUidEntry::where('line_uid', $validated['line_uid'])
                                           ->where('points', $validated['points']);

        // Check if ANY time-related field is provided
        $anyTimeFieldIsProvided = !empty($validated['month']) ||
                                  !empty($validated['day']) ||
                                  !empty($validated['hour']) ||
                                  !empty($validated['minute']);

        // If any time field is provided, check for an exact match on all time fields.
        if ($anyTimeFieldIsProvided) {
            $duplicateCheckQuery->where('month', $validated['month'])
                                ->where('day', $validated['day'])
                                ->where('hour', $validated['hour'])
                                ->where('minute', $validated['minute']);
        } else {
            // If no time fields are provided, only match records where they are all null.
            $duplicateCheckQuery->whereNull('month')
                                ->whereNull('day')
                                ->whereNull('hour')
                                ->whereNull('minute');
        }

        // Execute the query and check if a duplicate exists
        $isDuplicateValue = $duplicateCheckQuery->exists() ? 1 : 0;

        LineUidEntry::create([
            'line_uid' => $validated['line_uid'],
            'month' => $validated['month'],
            'day' => $validated['day'],
            'hour' => $validated['hour'],
            'minute' => $validated['minute'],
            'points' => $validated['points'],
            'ng_reason_id' => $validated['ng_reason_id'],
            'worker_code' => $workerCode,
            'is_duplicate' => $isDuplicateValue,
        ]);

        return redirect()->back()->with('success', '登録が完了しました');
    }
}
