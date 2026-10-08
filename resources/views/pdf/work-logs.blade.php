<!DOCTYPE html>
<html lang="sw">

<head>
    <meta charset="utf-8">
    <title>Daily Work Log Report</title>
    <style>
    @page {
        margin: 25px 30px 45px 30px;
    }

    body {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 10px;
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
        margin: 0 0 4px 0;
        font-size: 18px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .header p {
        margin: 0;
        color: #6b7280;
        font-size: 9px;
    }

    .meta-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 15px;
        background-color: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        padding: 8px 12px;
    }

    .meta-table td {
        border: none;
        padding: 3px 5px;
        font-size: 10px;
    }

    /* Data Table */
    table.data-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 5px;
    }

    table.data-table th,
    table.data-table td {
        border: 1px solid #e5e7eb;
        padding: 8px 10px;
        text-align: left;
        vertical-align: middle;
    }

    table.data-table th {
        background-color: #4f46e5;
        color: #ffffff;
        font-size: 9px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    table.data-table tr:nth-child(even) {
        background-color: #f9fafb;
    }

    table.data-table tr {
        page-break-inside: avoid;
    }

    /* Status Badges - Upgraded for Enum ['submitted', 'no data', 'rejected', 'assigned'] */
    .badge {
        display: inline-block;
        padding: 3px 8px;
        font-size: 8.5px;
        font-weight: bold;
        border-radius: 4px;
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
        background-color: #fef3c7;
        color: #b45309;
        border: 1px solid #fde68a;
    }

    .badge-rejected {
        background-color: #fef2f2;
        color: #b91c1c;
        border: 1px solid #fecaca;
    }

    .text-center {
        text-align: center !important;
    }

    .text-right {
        text-align: right !important;
    }

    .font-semibold {
        font-weight: bold;
    }
    </style>
</head>

<body>

    <!-- Script ya DomPDF kwa ajili ya Pagination -->
    <script type="text/php">
        if (isset($pdf)) {
            $text = "Daily Work Log Report — Generated automatically | Page {PAGE_NUM} of {PAGE_COUNT}";
            $font = $fontMetrics->get_font("Helvetica", "normal");
            $size = 8;
            $color = array(0.42, 0.45, 0.5);
            $pdf->page_text(170, 815, $text, $font, $size, $color);
        }
    </script>

    <!-- Header Section -->
    <div class="header">
        <h2>Daily Work Log Report</h2>
        <p>Official Performance & Task Record Summary</p>
    </div>

    <!-- Metadata Table -->
    <table class="meta-table">
        <tr>
            <td style="width: 50%;"><strong>Technician Name:</strong> {{ $user->name ?? 'N/A' }}</td>
            <td class="text-right" style="width: 50%;"><strong>Generated Date:</strong> {{ date('d M, Y H:i') }}</td>
        </tr>
        <tr>
            <td><strong>Email Address:</strong> {{ $user->email ?? 'N/A' }}</td>
            <td class="text-right"><strong>Total Logs Recorded:</strong> {{ $workLogs->count() }}</td>
        </tr>
    </table>

    <!-- Main Work Logs Table -->
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 5%;" class="text-center">#</th>
                <th style="width: 15%;">Date</th>
                <th style="width: 25%;">Requester</th>
                <th style="width: 40%;">Task Title</th>
                <th style="width: 15%;" class="text-center">Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($workLogs as $index => $log)
            <tr>
                <td class="text-center font-semibold" style="color: #6b7280;">{{ $index + 1 }}</td>
                <td style="white-space: nowrap;">{{ \Carbon\Carbon::parse($log->log_date)->format('d/m/Y') }}</td>
                <td><span class="font-semibold">{{ $log->requester_name }}</span></td>
                <td><strong>{{ $log->title }}</strong></td>
                <td class="text-center">
                    @if($log->status === 'assigned')
                    <span class="badge badge-assigned">Assigned</span>
                    @elseif($log->status === 'no data')
                    <span class="badge badge-nodata">No Data</span>
                    @elseif($log->status === 'rejected')
                    <span class="badge badge-rejected">Rejected</span>
                    @else
                    <span class="badge badge-submitted">Submitted</span>
                    @endif
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="5" class="text-center" style="padding: 20px; color: #6b7280;">
                    No work log records found for this period.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>

</body>

</html>