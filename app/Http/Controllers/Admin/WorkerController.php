<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Worker;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class WorkerController extends Controller
{
    public function index()
    {
        return Worker::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'worker_code' => ['required', 'unique:workers,worker_code', 'regex:/^[A-Z]{1,2}[0-9]+$/'],
            'password' => 'required|min:8',
            'is_admin' => 'boolean',
        ]);

        $worker = Worker::create([
            'worker_code' => $validated['worker_code'],
            'password' => Hash::make($validated['password']), 
            'is_admin' => $validated['is_admin'] ?? false,
        ]);

        return response()->json($worker, 201);
    }

    public function show(Worker $worker)
    {
        return $worker;
    }

    public function update(Request $request, Worker $worker)
    {
        $validated = $request->validate([
            'worker_code' => ['required', 'unique:workers,worker_code,'.$worker->id, 'regex:/^[A-Z]{1,2}[0-9]+$/'],
            'password' => 'nullable|min:8',
            'is_admin' => 'boolean',
        ]);

        $worker->worker_code = $validated['worker_code'];
        $worker->is_admin = $validated['is_admin'] ?? $worker->is_admin;
        if (!empty($validated['password'])) {
            $worker->password = Hash::make($validated['password']);
        }
        $worker->save();

        return response()->json($worker);
    }

    public function destroy(Worker $worker)
    {
        $worker->delete();
        return response()->noContent();
    }
}