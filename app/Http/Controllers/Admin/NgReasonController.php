<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NgReason;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NgReasonController extends Controller
{
    public function index()
    {
        return NgReason::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'reason' => 'required|unique:ng_reasons,reason|max:50',
        ]);

        $ngReason = NgReason::create([
            'reason' => $validated['reason'],
            'created_by' => Auth::user()->worker_code,
        ]);

        return response()->json($ngReason, 201);
    }

    public function show(NgReason $ngReason)
    {
        return $ngReason;
    }

    public function update(Request $request, NgReason $ngReason)
    {
        $validated = $request->validate([
            'reason' => 'required|unique:ng_reasons,reason,'.$ngReason->id.'|max:50',
        ]);

        $ngReason->update($validated);

        return response()->json($ngReason);
    }

    public function destroy(NgReason $ngReason)
    {
        $ngReason->delete();
        return response()->noContent();
    }
}