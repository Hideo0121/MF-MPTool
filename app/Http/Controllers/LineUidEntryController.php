<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLineUidEntryRequest;
use App\Models\LineUidEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LineUidEntryController extends Controller
{
    public function store(StoreLineUidEntryRequest $request)
    {
        $validated = $request->validated();

        $isDuplicate = LineUidEntry::where('line_uid', $validated['line_uid'])
            ->where('month', $validated['month'])
            ->where('day', $validated['day'])
            ->where('hour', $validated['hour'])
            ->where('minute', $validated['minute'])
            ->exists();

        $entry = LineUidEntry::create([
            'line_uid' => $validated['line_uid'],
            'month' => $validated['month'],
            'day' => $validated['day'],
            'hour' => $validated['hour'],
            'minute' => $validated['minute'],
            'ng_reason_id' => $validated['ng_reason_id'],
            'worker_code' => Auth::user()->worker_code,
            'is_duplicate' => $isDuplicate,
        ]);

        return response()->json($entry, 201);
    }
}