<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <title>{{ __('Daily Work Log Report') }}</title>
    <style>
    @page {
        margin: 24px 28px 46px 28px;
    }

    body {
        font-family: 'DejaVu Sans', Helvetica, Arial, sans-serif;
        font-size: 9px;
        color: #0f172a;
        line-height: 1.45;
    }

    .band {
        background-color: #312e81;
        color: #ffffff;
        border-radius: 12px;
        padding: 14px 16px;
    }

    .band table {
        width: 100%;
        border-collapse: collapse;
    }

    .band td {
        vertical-align: middle;
        padding: 0;
    }

    .logo {
        display: block;
        width: 26px;
        height: 26px;
        background-color: #ffffff;
        color: #312e81;
        font-size: 13px;
        font-weight: bold;
        text-align: center;
        line-height: 18px;
        border-radius: 8px;
    }

    .brand {
        font-size: 14px;
        font-weight: bold;
        letter-spacing: 1.2px;
        color: #ffffff;
    }

    .brand-sub {
        font-size: 7.5px;
        color: #c7d2fe;
    }

    .report-kicker {
        font-size: 7.5px;
        letter-spacing: 1.5px;
        color: #c7d2fe;
    }

    .report-title {
        font-size: 13px;
        font-weight: bold;
        color: #ffffff;
    }

    .report-sub {
        font-size: 7.5px;
        color: #c7d2fe;
    }

    .meta-wrap {
        background-color: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        margin-top: 10px;
        padding: 2px 0;
    }

    .meta-table {
        width: 100%;
        border-collapse: collapse;
    }

    .meta-table td {
        padding: 7px 12px;
        vertical-align: top;
    }

    .meta-table td + td {
        border-left: 1px solid #e2e8f0;
    }

    .meta-label {
        font-size: 6.8px;
        letter-spacing: 1.1px;
        color: #64748b;
        text-transform: uppercase;
        margin-bottom: 2px;
    }

    .meta-value {
        font-size: 9px;
        font-weight: bold;
        color: #0f172a;
    }

    .meta-note {
        font-size: 7.5px;
        color: #64748b;
    }

    .filters-wrap {
        margin-top: 8px;
        background-color: #eef2ff;
        border: 1px solid #c7d2fe;
        border-radius: 8px;
        padding: 6px 10px;
        font-size: 7.8px;
        color: #3730a3;
    }

    .stats {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
    }

    .stats td {
        width: 20%;
        vertical-align: top;
        padding: 0 4px;
    }

    .stats td:first-child {
        padding-left: 0;
    }

    .stats td:last-child {
        padding-right: 0;
    }

    .card {
        border-radius: 8px;
        padding: 8px 10px;
    }

    .card-total {
        background-color: #eef2ff;
        border-top: 3px solid #4338ca;
    }

    .card-submitted {
        background-color: #eff6ff;
        border-top: 3px solid #2563eb;
    }

    .card-assigned {
        background-color: #ecfdf5;
        border-top: 3px solid #059669;
    }

    .card-rejected {
        background-color: #fef2f2;
        border-top: 3px solid #dc2626;
    }

    .card-nodata {
        background-color: #fffbeb;
        border-top: 3px solid #d97706;
    }

    .card-value {
        font-size: 15px;
        font-weight: bold;
        line-height: 1.1;
        color: #0f172a;
    }

    .card-label {
        font-size: 6.8px;
        letter-spacing: 0.8px;
        text-transform: uppercase;
        color: #475569;
        margin-top: 1px;
    }

    .section-head {
        width: 100%;
        border-collapse: collapse;
        margin-top: 14px;
    }

    .section-head td {
        padding: 0 0 5px 0;
        vertical-align: bottom;
    }

    .section-title {
        font-size: 8.5px;
        font-weight: bold;
        letter-spacing: 1px;
        text-transform: uppercase;
        color: #312e81;
    }

    .section-count {
        font-size: 7.5px;
        color: #64748b;
    }

    table.data-table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #e2e8f0;
    }

    table.data-table th {
        background-color: #4338ca;
        color: #ffffff;
        font-size: 7.5px;
        font-weight: bold;
        letter-spacing: 0.8px;
        text-transform: uppercase;
        text-align: left;
        padding: 7px 8px;
    }

    table.data-table td {
        padding: 6px 8px;
        border-bottom: 1px solid #e2e8f0;
        vertical-align: top;
    }

    table.data-table tr.alt td {
        background-color: #f8fafc;
    }

    table.data-table tr.reason-row td {
        background-color: #fef2f2 !important;
        border-bottom: 1px solid #fecaca;
        padding: 4px 8px 5px 8px;
        font-size: 7px;
        color: #9f1239;
    }

    .reason-label {
        font-size: 6.4px;
        font-weight: bold;
        letter-spacing: 0.6px;
        text-transform: uppercase;
        color: #b91c1c;
    }

    table.data-table tr {
        page-break-inside: avoid;
    }

    .row-index {
        color: #94a3b8;
        font-size: 8px;
        font-weight: bold;
    }

    .date {
        white-space: nowrap;
        font-weight: bold;
        color: #0f172a;
    }

    .person {
        font-weight: bold;
        color: #0f172a;
    }

    .email {
        font-size: 7px;
        color: #64748b;
    }

    .task {
        font-weight: bold;
        color: #0f172a;
    }

    .desc {
        font-size: 7.2px;
        color: #64748b;
    }

    .badge {
        display: inline-block;
        padding: 2px 7px;
        font-size: 6.8px;
        font-weight: bold;
        border-radius: 8px;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        text-align: center;
    }

    .badge-submitted {
        background-color: #eff6ff;
        color: #1d4ed8;
        border: 1px solid #bfdbfe;
    }

    .badge-assigned {
        background-color: #ecfdf5;
        color: #047857;
        border: 1px solid #a7f3d0;
    }

    .badge-nodata {
        background-color: #fffbeb;
        color: #b45309;
        border: 1px solid #fde68a;
    }

    .badge-rejected {
        background-color: #fef2f2;
        color: #b91c1c;
        border: 1px solid #fecaca;
    }

    .empty {
        padding: 22px;
        text-align: center;
        color: #64748b;
        font-size: 8.5px;
        background-color: #f8fafc;
    }

    .text-center {
        text-align: center !important;
    }
    </style>
</head>

<body>

    @php
        $statusLabels = [
            'submitted' => __('Submitted'),
            'assigned' => __('Assigned'),
            'rejected' => __('Rejected'),
            'no data' => __('No Data'),
        ];
        $counts = $workLogs->countBy('status')->all();
        $countFor = fn (string $status) => $counts[$status] ?? 0;

        $periodFrom = !empty($filters['start_date'])
            ? \Illuminate\Support\Carbon::parse($filters['start_date'])->format('d M Y')
            : null;
        $periodTo = !empty($filters['end_date'])
            ? \Illuminate\Support\Carbon::parse($filters['end_date'])->format('d M Y')
            : null;
        $period = $periodFrom && $periodTo
            ? $periodFrom.' to '.$periodTo
            : ($periodFrom
                ? __('From :date', ['date' => $periodFrom])
                : ($periodTo
                    ? __('Until :date', ['date' => $periodTo])
                    : __('All dates')));

        $filterBits = [];
        if (!empty($filters['search'])) {
            $filterBits[] = __('Search:').' "'.$filters['search'].'"';
        }
        if (!empty($filters['status'])) {
            $filterBits[] = __('Status:').' '.($statusLabels[$filters['status']] ?? $filters['status']);
        }
        if (!empty($filters['start_date'])) {
            $filterBits[] = __('From:').' '.\Illuminate\Support\Carbon::parse($filters['start_date'])->format('d/m/Y');
        }
        if (!empty($filters['end_date'])) {
            $filterBits[] = __('To:').' '.\Illuminate\Support\Carbon::parse($filters['end_date'])->format('d/m/Y');
        }
    @endphp

    <div class="band">
        <table>
            <tr>
                <td style="width: 55%;">
                    <table>
                        <tr>
                            <td style="width: 34px; vertical-align: middle;">
                                <div class="logo">W</div>
                            </td>
                            <td style="vertical-align: middle;">
                                <span class="brand">WORKLOG</span>
                                <div class="brand-sub">{{ __('Daily Work & Task Tracking System') }}</div>
                            </td>
                        </tr>
                    </table>
                </td>
                <td style="text-align: right;">
                    <div class="report-kicker">{{ __('REPORT') }}</div>
                    <div class="report-title">{{ __('Daily Work Log Report') }}</div>
                    <div class="report-sub">{{ __('Official Performance & Task Record Summary') }}</div>
                </td>
            </tr>
        </table>
    </div>

    <div class="meta-wrap">
        <table class="meta-table">
            <tr>
                <td style="width: 38%;">
                    <div class="meta-label">{{ __('Prepared for') }}</div>
                    <div class="meta-value">{{ $user->name ?? 'N/A' }}</div>
                    <div class="meta-note">{{ $user->email ?? '' }}</div>
                </td>
                <td style="width: 32%;">
                    <div class="meta-label">{{ __('Reporting period') }}</div>
                    <div class="meta-value">{{ $period }}</div>
                    <div class="meta-note">{{ __('Matching logs: :count', ['count' => $workLogs->count()]) }}</div>
                </td>
                <td style="width: 30%;">
                    <div class="meta-label">{{ __('Generated') }}</div>
                    <div class="meta-value">{{ now()->format('d M Y') }}</div>
                    <div class="meta-note">{{ now()->format('H:i') }}</div>
                </td>
            </tr>
        </table>
    </div>

    @if (count($filterBits))
        <div class="filters-wrap"><strong>{{ __('Filters:') }}</strong> {{ implode('   |   ', $filterBits) }}</div>
    @endif

    <table class="stats">
        <tr>
            <td>
                <div class="card card-total">
                    <div class="card-value">{{ $workLogs->count() }}</div>
                    <div class="card-label">{{ __('Total') }}</div>
                </div>
            </td>
            <td>
                <div class="card card-submitted">
                    <div class="card-value">{{ $countFor('submitted') }}</div>
                    <div class="card-label">{{ __('Submitted') }}</div>
                </div>
            </td>
            <td>
                <div class="card card-assigned">
                    <div class="card-value">{{ $countFor('assigned') }}</div>
                    <div class="card-label">{{ __('Assigned') }}</div>
                </div>
            </td>
            <td>
                <div class="card card-rejected">
                    <div class="card-value">{{ $countFor('rejected') }}</div>
                    <div class="card-label">{{ __('Rejected') }}</div>
                </div>
            </td>
            <td>
                <div class="card card-nodata">
                    <div class="card-value">{{ $countFor('no data') }}</div>
                    <div class="card-label">{{ __('No Data') }}</div>
                </div>
            </td>
        </tr>
    </table>

    <table class="section-head">
        <tr>
            <td><span class="section-title">{{ __('Log entries') }}</span></td>
            <td style="text-align: right;"><span class="section-count">{{ __('Entries: :count', ['count' => $workLogs->count()]) }}</span></td>
        </tr>
    </table>

    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 5%;" class="text-center">#</th>
                <th style="width: 12%;">{{ __('Date') }}</th>
                @if ($canManageStatus)
                    <th style="width: 16%;">{{ __('Submitted By') }}</th>
                @endif
                <th style="width: {{ $canManageStatus ? '18%' : '22%' }};">{{ __('Requester') }}</th>
                <th style="width: {{ $canManageStatus ? '33%' : '44%' }};">{{ __('Task Title') }}</th>
                <th style="width: 16%;" class="text-center">{{ __('Status') }}</th>
            </tr>
        </thead>
        <tbody>
            @forelse($workLogs as $index => $log)
            <tr class="log-row {{ $index % 2 === 1 ? 'alt' : '' }}">
                <td class="text-center"><span class="row-index">{{ $index + 1 }}</span></td>
                <td><span class="date">{{ \Illuminate\Support\Carbon::parse($log->log_date)->format('d M Y') }}</span></td>
                @if ($canManageStatus)
                    <td>
                        <div class="person">{{ $log->user->name ?? 'N/A' }}</div>
                        <div class="email">{{ $log->user->email ?? '' }}</div>
                    </td>
                @endif
                <td><span class="person">{{ $log->requester_name }}</span></td>
                <td>
                    <div class="task">{{ $log->title }}</div>
                    @if (filled($log->description))
                        <div class="desc">{{ \Illuminate\Support\Str::limit($log->description, 120) }}</div>
                    @endif
                </td>
                <td class="text-center">
                    @if ($log->status === 'assigned')
                        <span class="badge badge-assigned">{{ __('Assigned') }}</span>
                    @elseif ($log->status === 'no data')
                        <span class="badge badge-nodata">{{ __('No Data') }}</span>
                    @elseif ($log->status === 'rejected')
                        <span class="badge badge-rejected">{{ __('Rejected') }}</span>
                    @else
                        <span class="badge badge-submitted">{{ __('Submitted') }}</span>
                    @endif
                </td>
            </tr>
            @if ($log->status === 'rejected' && filled($log->rejection_reason))
            <tr class="reason-row">
                <td colspan="{{ $canManageStatus ? 6 : 5 }}">
                    <span class="reason-label">{{ __('Rejection reason:') }}</span> {{ $log->rejection_reason }}
                </td>
            </tr>
            @endif
            @empty
            <tr>
                <td colspan="{{ $canManageStatus ? 6 : 5 }}" class="empty">
                    {{ __('No work log records found for this period.') }}
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>

</body>

</html>
