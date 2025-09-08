<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsJ04User
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $allowedWorkerCodes = ['J04', 'J06'];

        if (! $request->user() || ! in_array($request->user()->worker_code, $allowedWorkerCodes)) {
            return response()->json(['message' => 'Forbidden. Access denied.'], 403);
        }

        return $next($request);
    }
}
