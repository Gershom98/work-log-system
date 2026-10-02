<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Angalia kama user ameingia na kama ni Admin
        if ($request->user() && $request->user()->role === 'admin') {
            return $next($request);
        }

        // Ikiwa sio admin, mruhusu arudi nyuma au umuelekeze kwenye work-logs
        return redirect()->route('work-logs.index')->with('error', 'Hauna ruhusa ya kufikia ukurasa huu.');
    }
}