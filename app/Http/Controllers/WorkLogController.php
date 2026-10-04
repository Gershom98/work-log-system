<?php

namespace App\Http\Controllers;

use App\Models\WorkLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\View;

class WorkLogController extends Controller 
{
    public function index( Request $request ) {
        $user = $request->user();

        // 1. Anzisha Eloquent Query Builder
        $query = WorkLog::query();

        // Kama ni admin/supervisor, leta na mhusika; la sivyo chukua za user huyo tu
        if ( in_array( $user->role, [ 'admin', 'supervisor' ] ) ) {
            $query->with( 'user:id,name,email' );
        } else {
            $query->where( 'user_id', $user->id );
        }

        // 2. Filter: Search Keyword (Title au Requester)
        if ( $request->filled( 'search' ) ) {
            $search = $request->input( 'search' );
            $query->where( function ( $q ) use ( $search ) {
                $q->where( 'title', 'like', "%{$search}%" )
                  ->orWhere( 'requester_name', 'like', "%{$search}%" );
            } );
        }

        // 3. Filter: Status
        if ( $request->filled( 'status' ) ) {
            $query->where( 'status', $request->input( 'status' ) );
        }

        // 4. Filter: Date Range (Start Date)
        if ( $request->filled( 'start_date' ) ) {
            $query->whereDate( 'log_date', '>=', $request->input( 'start_date' ) );
        }

        // 4b. Filter: Date Range (End Date)
        if ( $request->filled( 'end_date' ) ) {
            $query->whereDate( 'log_date', '<=', $request->input( 'end_date' ) );
        }

        // 5. Hesabu Active Requests (kazi zenye status ya 'assigned' au 'submitted')
        $activeRequestsQuery = clone $query;
        $activeRequests = $activeRequestsQuery->whereIn('status', ['assigned', 'submitted'])->count();

        // 6. Paginate: Weka logs 5 pekee kwa kila ukurasa na hifadhi Parameters zote
        $perPage = 5;
        
        $logs = $query->latest( 'log_date' )
                      ->paginate( $perPage )
                      ->withQueryString();

        // 7. Tuma logs, activeRequests na filters kurudi React (Index.jsx)
        return Inertia::render( 'WorkLogs/Index', [
            'logs'           => $logs,
            'activeRequests' => $activeRequests,
            'filters'        => $request->only( [ 'search', 'status', 'start_date', 'end_date' ] ),
        ] );
    }

    public function create() {
        return Inertia::render( 'WorkLogs/Create' );
    }

    public function store( Request $request ) {
        $user = $request->user();

        $rules = [
            'requester_name' => 'required|string|max:255',
            'title'          => 'required|string|max:255',
            'description'    => 'nullable|string',
            'log_date'       => 'required|date',
            // 'hours_spent'    => 'required|integer|min:1|max:24',
        ];

        // Status restriction na rejection_reason validation kwa Admin/Supervisor
        if ( in_array( $user->role, [ 'admin', 'supervisor' ] ) ) {
            $rules['status'] = 'required|in:submitted,no data,rejected,assigned';

            if ( $request->input('status') === 'rejected' ) {
                $rules['rejection_reason'] = 'required|string|min:5|max:1000';
            } else {
                $rules['rejection_reason'] = 'nullable|string';
            }
        }

        $validated = $request->validate( $rules );

        // Ikiwa mtumiaji si admin/supervisor, tumia status ya msingi na futa rejection_reason
        if ( !in_array( $user->role, [ 'admin', 'supervisor' ] ) ) {
            $validated['status'] = 'submitted';
            unset( $validated['rejection_reason'] );
        } else {
            if ( ($validated['status'] ?? null) !== 'rejected' ) {
                $validated['rejection_reason'] = null;
            }
        }

        $user->workLogs()->create( $validated );

        return redirect()->route( 'work-logs.index' )->with( 'message', 'Work log created successfully!' );
    }

    public function show( Request $request, WorkLog $workLog ) {
        $user = $request->user();

        if ( !in_array( $user->role, [ 'admin', 'supervisor' ] ) && $workLog->user_id !== $user->id ) {
            abort( 403, 'Huna ruhusa ya kuona log hii.' );
        }

        return Inertia::render( 'WorkLogs/Show', [
            'workLog' => $workLog->load( 'user:id,name,email' )
        ] );
    }

    public function edit( Request $request, WorkLog $workLog ) {
        $user = $request->user();

        if ( !in_array( $user->role, [ 'admin', 'supervisor' ] ) && $workLog->user_id !== $user->id ) {
            abort( 403, 'Huna ruhusa ya kuhariri log hii.' );
        }

        return Inertia::render( 'WorkLogs/Edit', [
            'workLog' => $workLog
        ] );
    }

    public function update( Request $request, WorkLog $workLog ) {
        $user = $request->user();

        if ( !in_array( $user->role, [ 'admin', 'supervisor' ] ) && $workLog->user_id !== $user->id ) {
            abort( 403, 'Huna ruhusa ya kusasisha log hii.' );
        }

        $rules = [
            'requester_name' => 'required|string|max:255',
            'title'          => 'required|string|max:255',
            'description'    => 'nullable|string',
            'log_date'       => 'required|date',
            'hours_spent'    => 'required|integer|min:1|max:24',
        ];

        // Status na Rejection Reason validation kwa Admin au Supervisor
        if ( in_array( $user->role, [ 'admin', 'supervisor' ] ) ) {
            $rules['status'] = 'required|in:submitted,no data,rejected,assigned';

            // Ikiwa status ni 'rejected', rejection_reason inakuwa lazima
            if ( $request->input('status') === 'rejected' ) {
                $rules['rejection_reason'] = 'required|string|min:5|max:1000';
            } else {
                $rules['rejection_reason'] = 'nullable|string';
            }
        }

        $validated = $request->validate( $rules );

        // Ikiwa mtumiaji si Admin/Supervisor, zuia ubadilishaji wa status na rejection_reason
        if ( !in_array( $user->role, [ 'admin', 'supervisor' ] ) ) {
            unset( $validated['status'], $validated['rejection_reason'] );
        } else {
            // Kama status ikibadilishwa na kuwa tofauti na 'rejected', futa/weka null rejection_reason
            if ( ($validated['status'] ?? null) !== 'rejected' ) {
                $validated['rejection_reason'] = null;
            }
        }

        $workLog->update( $validated );

        return redirect()->route( 'work-logs.index' )->with( 'message', 'Work log updated successfully!' );
    }

    public function destroy( Request $request, WorkLog $workLog ) {
        $user = $request->user();

        if ( !in_array( $user->role, [ 'admin', 'supervisor' ] ) && $workLog->user_id !== $user->id ) {
            abort( 403, 'Huna ruhusa ya kufuta log hii.' );
        }

        $workLog->delete();

        return redirect()->route( 'work-logs.index' )->with( 'message', 'Work log deleted successfully!' );
    }

    /**
    * Download the work logs report as a PDF (inafuata filters zilizowekwa).
    */
    public function downloadPdf( Request $request ) {
        ini_set( 'memory_limit', '256M' );
        set_time_limit( 300 );

        try {
            if ( !View::exists( 'pdf.work-logs' ) ) {
                Log::error( 'PDF Error: View resources/views/pdf/work-logs.blade.php missing.' );
                return response( 'Kosa: Faili la template ya PDF halipatikani.', 404 );
            }

            $user = $request->user();
            $query = WorkLog::query();

            if ( in_array( $user->role, [ 'admin', 'supervisor' ] ) ) {
                $query->with( 'user:id,name,email' );
            } else {
                $query->where( 'user_id', $user->id );
            }

            // Weka filtering zilezile kwa ajili ya PDF report
            if ( $request->filled( 'search' ) ) {
                $search = $request->input( 'search' );
                $query->where( function ( $q ) use ( $search ) {
                    $q->where( 'title', 'like', "%{$search}%" )
                      ->orWhere( 'requester_name', 'like', "%{$search}%" );
                } );
            }

            if ( $request->filled( 'status' ) ) {
                $query->where( 'status', $request->input( 'status' ) );
            }

            if ( $request->filled( 'start_date' ) ) {
                $query->whereDate( 'log_date', '>=', $request->input( 'start_date' ) );
            }

            if ( $request->filled( 'end_date' ) ) {
                $query->whereDate( 'log_date', '<=', $request->input( 'end_date' ) );
            }

            $workLogs = $query->latest( 'log_date' )->get();

            $pdf = Pdf::loadView( 'pdf.work-logs', compact( 'workLogs', 'user' ) )
            ->setPaper( 'a4', 'portrait' )
            ->setOptions( [
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled'      => true,
                'chroot'               => base_path(),
                'tempDir'              => sys_get_temp_dir(),
            ] );

            $fileName = 'work-log-report-' . now()->format( 'Y-m-d' ) . '.pdf';

            return $pdf->download( $fileName );

        } catch ( \Exception $e ) {
            Log::error( 'PDF Generation Error: ' . $e->getMessage() );
            return response( 'Imefeli kutengeneza PDF: ' . $e->getMessage(), 500 );
        }
    }
}