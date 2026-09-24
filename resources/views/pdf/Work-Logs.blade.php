<!DOCTYPE html>
<html lang="sw">

<head>
    <meta charset="utf-8">
    <title>Daily Work Log Report</title>
    <style>
    @page {
        margin: 20px 25px 40px 25px;
    }

    body {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 11px;
        color: #1f2937;
        line-height: 1.4;
    }

    /* Header Block */
    .header {
        border-bottom: 2px solid #4f46e5;
        padding-bottom: 10px;
        margin-bottom: 15px;
    }

    .header h2 {
        color: #4f46e5;
        margin: 0 0 5px 0;
        font-size: 18px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .meta-table {
        width: 100%;
        border: none;
        margin-bottom: 10px;
    }

    .meta-table td {
        border: none;
        padding: 2px 0;
        font-size: 11px;
    }

    /* Data Table */
    table.data-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
    }

    table.data-table th,
    table.data-table td {
        border: 1px solid #d1d5db;
        padding: 7px 9px;
        text-align: left;
        vertical-align: top;
    }

    table.data-table th {
        background-color: #4f46e5;
        color: #ffffff;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    table.data-table tr:nth-child(even) {
        background-color: #f9fafb;
    }

    table.data-table tr {
        page-break-inside: avoid;
    }

    /* Status Badges */
    .badge {
        display: inline-block;
        padding: 2px 6px;
        font-size: 9px;
        font-weight: bold;
        border-radius: 4px;
        text-transform: uppercase;
        text-align: center;
    }

    .badge-submitted {
        background-color: #e0e7ff;
        color: #3730a3;
    }

    .badge-approved {
        background-color: #def7ec;
        color: #03543f;
    }

    .badge-pending {
        background-color: #fef3c7;
        color: #92400e;
    }

    .badge-rejected {
        background-color: #fde8e8;
        color: #9b1c1c;
    }

    .text-center {
        text-align: center !important;
    }

    .text-right {
        text-align: right !important;
    }

    /* Footer / Page Numbering */
    footer {
        position: fixed;
        bottom: -20px;
        left: 0px;
        right: 0px;
        height: 20px;
        font-size: 9px;
        color: #6b7280;
        text-align: center;
        border-top: 1px solid #e5e7eb;
        padding-top: 5px;
    }

    .pagenum:before {
        content: counter(page);
    }
    </style>
</head>

<body>

    <footer>
        Daily Work Log Report &mdash; Generated automatically | Page <span class="pagenum"></span>
    </footer>

    <div class="header">
        <h2>Daily Work Log Report</h2>
        <table class="meta-table">
            <tr>
                <td><strong>Technician Name:</strong> {{ $user->name }}</td>
                <td class="text-right"><strong>Generated Date:</strong> {{ date('d M, Y H:i') }}</td>
            </tr>
            <tr>
                <td><strong>Email Address:</strong> {{ $user->email }}</td>
                <td class="text-right"><strong>Total Logs Recorded:</strong> {{ $workLogs->count() }}</td>
            </tr>
        </table>
    </div>

    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 5%;" class="text-center">#</th>
                <th style="width: 15%;">Date</th>
                <th style="width: 20%;">Requester</th>
                <th style="width: 25%;">Task Title</th>
                <th style="width: 23%;">Description</th>
                <th style="width: 12%;" class="text-center">Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($workLogs as $index => $log)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>{{ \Carbon\Carbon::parse($log->log_date)->format('d/m/Y') }}</td>
                <td>{{ $log->requester_name }}</td>
                <td><strong>{{ $log->title }}</strong></td>
                <td>{{ $log->description }}</td>
                <td class="text-center">
                    @if($log->status === 'submitted')
                    <span class="badge badge-submitted">Submitted</span>
                    @elseif($log->status === 'approved')
                    <span class="badge badge-approved">Approved</span>
                    @elseif($log->status === 'pending')
                    <span class="badge badge-pending">Pending</span>
                    @else
                    <span class="badge badge-rejected">Rejected</span>
                    @endif
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="6" class="text-center" style="padding: 15px; color: #6b7280;">
                    No work log records found for this period.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>

</body>

</html>