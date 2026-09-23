<!DOCTYPE html>
<html lang="sw">

<head>
    <meta charset="utf-8">
    <title>Work Log Report</title>
    <style>
    body {
        font-family: sans-serif;
        font-size: 12px;
        color: #333;
    }

    .header {
        text-align: center;
        margin-bottom: 20px;
        border-bottom: 2px solid #4f46e5;
        padding-bottom: 10px;
    }

    h2 {
        color: #4f46e5;
        margin: 0 0 5px 0;
        text-transform: uppercase;
    }

    .meta-table {
        width: 100%;
        margin-bottom: 20px;
        font-size: 13px;
    }

    .meta-table td {
        padding: 4px 0;
    }

    table.data-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
    }

    table.data-table th,
    table.data-table td {
        border: 1px solid #e5e7eb;
        padding: 10px;
        text-align: left;
    }

    table.data-table th {
        background-color: #4f46e5;
        color: white;
        font-size: 11px;
        text-transform: uppercase;
    }

    table.data-table tr:nth-child(even) {
        background-color: #f9fafb;
    }
    </style>
</head>

<body>

    <div class="header">
        <h2>Daily Work Log Report</h2>
    </div>

    <!-- Taarifa za Technician Na Tarehe -->
    <table class="meta-table">
        <tr>
            <td><strong>Technician Name:</strong> {{ $user->name }}</td>
            <td style="text-align: right;"><strong>Generated Date:</strong> {{ date('Y-m-d H:i') }}</td>
        </tr>
        <tr>
            <td><strong>Email:</strong> {{ $user->email }}</td>
            <td style="text-align: right;"><strong>Total Logs:</strong> {{ $workLogs->count() }}</td>
        </tr>
    </table>

    <!-- Jedwali Lililosafishwa (Bila Hours Spent na Status) -->
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 8%;">#</th>
                <th style="width: 22%;">Date</th>
                <th style="width: 35%;">Requester</th>
                <th style="width: 35%;">Task Title</th>
            </tr>
        </thead>
        <tbody>
            @forelse($workLogs as $index => $log)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $log->log_date }}</td>
                <td>{{ $log->requester_name }}</td>
                <td>{{ $log->title }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="4" style="text-align: center;">No work logs recorded.</td>
            </tr>
            @endforelse
        </tbody>
    </table>

</body>

</html>