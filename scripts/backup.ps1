param()

$timestamp = Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'
$root = Split-Path -Parent $PSScriptRoot
$backupRoot = Join-Path $root 'backups'
$destination = Join-Path $backupRoot ("manual_backup_" + $timestamp)

New-Item -ItemType Directory -Path $destination -Force | Out-Null
robocopy $root $destination /E /XD .git node_modules dist backups /XF .env | Out-Null

if ($LASTEXITCODE -gt 7) {
  throw "Backup failed with robocopy exit code $LASTEXITCODE"
}

Write-Output "Backup created: $destination"
