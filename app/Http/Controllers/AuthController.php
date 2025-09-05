<?php

namespace App\Http\Controllers;

use App\Models\Worker;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'worker_code' => ['required', 'regex:/^[A-Z]{1,2}[0-9]+$/'],
            'password' => 'required',
        ]);

        $worker = Worker::where('worker_code', $request->worker_code)->first();

        if (! $worker || ! Hash::check($request->password, $worker->password)) {
            return response()->json(['message' => 'Invalid credentials'], Response::HTTP_UNAUTHORIZED);
        }

        Auth::guard('web')->login($worker);

        $request->session()->regenerate();

        return redirect()->route('entry.create');
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->noContent();
    }
}