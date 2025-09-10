<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEntryRequest;
use App\Models\LineUidEntry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
        Log::info('EntryController@store received data:', $request->all());

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
            'points' => $validated['points'],
            'ng_reason_id' => $validated['ng_reason_id'],
            'worker_code' => $workerCode,
            'is_duplicate' => $validated['is_duplicate'],
        ]);

        return redirect()->back()->with('success', '登録が完了しました');
    }

    /**
     * Check for duplicate entries.
     */
    public function checkDuplicate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'line_uid' => 'required|string',
            'points' => 'required|numeric',
            'month' => 'nullable|integer|min:1|max:12',
            'day' => 'nullable|integer|min:1|max:31',
            'hour' => 'nullable|integer|min:0|max:23',
            'minute' => 'nullable|integer|min:0|max:59',
        ], [
            'line_uid.required' => 'LINE UIDは必須です。',
            'points.required' => 'ポイントは必須です。',
            'month.integer' => '月は整数で入力してください。',
            'month.min' => '月は1以上で入力してください。',
            'month.max' => '月は12以下で入力してください。',
            'day.integer' => '日は整数で入力してください。',
            'day.min' => '日は1以上で入力してください。',
            'day.max' => '日は31以下で入力してください。',
            'hour.integer' => '時は整数で入力してください。',
            'hour.min' => '時は0以上で入力してください。',
            'hour.max' => '時は23以下で入力してください。',
            'minute.integer' => '分は整数で入力してください。',
            'minute.min' => '分は0以上で入力してください。',
            'minute.max' => '分は59以下で入力してください。',
        ]);

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
        $isDuplicate = $duplicateCheckQuery->exists();

        return response()->json(['is_duplicate' => $isDuplicate]);
    }
}
