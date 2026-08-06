$NgrokUrl = "https://arson-immovably-prorate.ngrok-free.dev"  # Mets ta vraie URL
$IntervalSec = 30
$FailCount = 0
$MaxFail = 3

Write-Host "Monitoring $NgrokUrl toutes les ${IntervalSec}s (Ctrl+C pour arreter)" -ForegroundColor Cyan

while ($true) {
  $ts = Get-Date -Format "HH:mm:ss"
  try {
    $r = Invoke-RestMethod -Uri $NgrokUrl `
      -Headers @{ "ngrok-skip-browser-warning" = "true" } `
      -TimeoutSec 10

    if ($r.status -eq 200 -or $r.message -match "Evolution") {
      Write-Host "[$ts] OK — $($r.message)" -ForegroundColor Green
      $FailCount = 0
    } else {
      Write-Host "[$ts] Reponse inattendue: $($r | ConvertTo-Json -Compress)" -ForegroundColor Yellow
      $FailCount++
    }
  }
  catch {
    $FailCount++
    Write-Host "[$ts] DOWN ($FailCount/$MaxFail) — $($_.Exception.Message)" -ForegroundColor Red
  }

  if ($FailCount -ge $MaxFail) {
    Write-Host "[$ts] Tunnel instable ou mort. Verifie le terminal ngrok." -ForegroundColor Magenta
  }

  Start-Sleep -Seconds $IntervalSec
}
