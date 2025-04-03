# Script to find and delete redundancy analysis files
Write-Host "Starting redundancy file cleanup..." -ForegroundColor Cyan

# List of files to delete
$filesToDelete = @(
    "redundancy-analysis-prompt.md",
    "debug-html-comparison.md",
    "file-analysis-report.md",
    "redundancy-analysis-final.md",
    "redundancy-analysis-results.md",
    "redundancy-analysis-summary.md",
    "redundancy-fix-plan.md",
    "second-batch-analysis-summary.md",
    "project-files-list.txt"
)

$currentDir = Get-Location
Write-Host "Searching in: $currentDir" -ForegroundColor Yellow
$deletedCount = 0

foreach ($file in $filesToDelete) {
    Write-Host "Looking for: $file" -ForegroundColor Gray
    
    # Find the file recursively in the current directory
    $foundFiles = Get-ChildItem -Path $currentDir -Filter $file -Recurse -ErrorAction SilentlyContinue
    
    if ($foundFiles) {
        foreach ($foundFile in $foundFiles) {
            try {
                $fullPath = $foundFile.FullName
                Remove-Item -Path $fullPath -Force
                Write-Host "Deleted: $fullPath" -ForegroundColor Green
                $deletedCount++
            }
            catch {
                Write-Host "Error deleting: $fullPath - $_" -ForegroundColor Red
            }
        }
    }
    else {
        Write-Host "  - Not found: $file" -ForegroundColor DarkGray
    }
}

Write-Host "Cleanup complete. Deleted $deletedCount files." -ForegroundColor Cyan
