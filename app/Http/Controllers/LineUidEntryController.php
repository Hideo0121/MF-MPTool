<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLineUidEntryRequest;
use App\Http\Requests\UpdateLineUidEntryRequest;
use App\Models\LineUidEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LineUidEntryController extends Controller
{
    /**
     * GET /api/entries
     * フィルタ & ソート付き一覧取得
     */
    public function index(Request $request)
    {
        $query = LineUidEntry::with(['ngReason:id,reason', 'worker:worker_code,name']);

        // 非管理者は自分のデータのみ
        if (!auth()->user()->is_admin) {
            $query->where('worker_code', auth()->user()->worker_code);
        }

        if ($request->filled('line_uid')) {
            $query->where('line_uid', $request->line_uid);
        }
        if ($request->filled('worker_code')) {
            $query->where('worker_code', $request->worker_code);
        }
        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }
        if ($request->filled('other')) {
            $query->where('other', 'like', '%' . $request->other . '%');
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

    $allowedSort = ['created_at', 'points', 'line_uid', 'month', 'day', 'hour', 'minute', 'other'];
        if (!in_array($sortBy, $allowedSort, true)) {
            $sortBy = 'created_at';
        }
        if (!in_array(strtolower($sortOrder), ['asc', 'desc'], true)) {
            $sortOrder = 'desc';
        }

        $entries = $query->orderBy($sortBy, $sortOrder)->get();

        return response()->json($entries);
    }
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
            'points' => $validated['points'],
            'ng_reason_id' => $validated['ng_reason_id'],
            'worker_code' => Auth::user()->worker_code,
            'is_duplicate' => $isDuplicate,
            'other' => $request->input('other'),
        ]);

        return redirect()->route('entry.create')->with('success', '登録が完了しました。');
    }

    /**
     * PUT /api/entries/{entry}
     */
    public function update(UpdateLineUidEntryRequest $request, LineUidEntry $entry)
    {
        // 権限制御: 非管理者は自分のレコードのみ
        if (!auth()->user()->is_admin && $entry->worker_code !== auth()->user()->worker_code) {
            abort(403, 'Forbidden');
        }

        $validated = $request->validated();

        $isDuplicate = LineUidEntry::where('id', '!=', $entry->id)
            ->where('line_uid', $validated['line_uid'])
            ->where('month', $validated['month'])
            ->where('day', $validated['day'])
            ->where('hour', $validated['hour'])
            ->where('minute', $validated['minute'])
            ->exists();

        $entry->update([
            'line_uid' => $validated['line_uid'],
            'month' => $validated['month'],
            'day' => $validated['day'],
            'hour' => $validated['hour'],
            'minute' => $validated['minute'],
            'points' => $validated['points'],
            'ng_reason_id' => $validated['ng_reason_id'],
            'is_duplicate' => $isDuplicate,
            'other' => $request->input('other'),
        ]);

        $entry->load(['ngReason:id,reason', 'worker:worker_code,name']);

        return response()->json($entry);
    }
}
