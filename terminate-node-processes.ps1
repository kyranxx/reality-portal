# PowerShell script to gracefully terminate all Node.js processes
Write-Host "Attempting to gracefully terminate Node.js processes..."
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue

if ($nodeProcesses) {
    foreach ($process in $nodeProcesses) {
        try {
            $process.CloseMainWindow()
            Write-Host "Sent close signal to Node.js process (PID: $($process.Id))"
        } catch {
            Write-Host "Error closing Node.js process (PID: $($process.Id)): $_"
        }
    }
    
    # Wait a moment for processes to close gracefully
    Start-Sleep -Seconds 2
    
    # Force kill any remaining processes
    $remainingProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
    if ($remainingProcesses) {
        Write-Host "Forcefully terminating remaining Node.js processes..."
        $remainingProcesses | ForEach-Object {
            try {
                $_.Kill()
                Write-Host "Forcefully terminated Node.js process (PID: $($_.Id))"
            } catch {
                Write-Host "Error killing Node.js process (PID: $($_.Id)): $_"
            }
        }
    }
    
    Write-Host "All Node.js processes have been terminated."
} else {
    Write-Host "No Node.js processes found running."
}
