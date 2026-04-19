param(
  [ValidateSet("on", "off", "status")]
  [string]$Action = "status"
)

function Test-Ollama {
  try {
    Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -TimeoutSec 2 -ErrorAction Stop | Out-Null
    return $true
  } catch {
    return $false
  }
}

function Start-Ollama {
  if (Test-Ollama) {
    Write-Host "[OK] Ollama is already running on localhost:11434" -ForegroundColor Green
    return
  }
  Write-Host "Starting Ollama..." -ForegroundColor Cyan
  Start-Process ollama -ArgumentList "serve" -WindowStyle Hidden
  $i = 0
  while ($i -lt 30) {
    Start-Sleep -Seconds 1
    if (Test-Ollama) {
      Write-Host "[OK] Ollama started on localhost:11434" -ForegroundColor Green
      return
    }
    $i++
  }
  Write-Host "[ERROR] Ollama did not start. Run 'ollama serve' manually." -ForegroundColor Red
}

function Stop-Ollama {
  if (-not (Test-Ollama)) {
    Write-Host "[OK] Ollama is already stopped" -ForegroundColor Green
    return
  }
  Write-Host "Stopping Ollama..." -ForegroundColor Cyan
  taskkill /IM ollama.exe /F 2>$null | Out-Null
  taskkill /IM "ollama app.exe" /F 2>$null | Out-Null
  Start-Sleep -Seconds 2
  if (-not (Test-Ollama)) {
    Write-Host "[OK] Ollama stopped" -ForegroundColor Green
  } else {
    Write-Host "[ERROR] Still running. Kill it manually in Task Manager." -ForegroundColor Red
  }
}

function Show-OllamaStatus {
  if (Test-Ollama) {
    Write-Host "Status: ONLINE  - Gemma 4 ready at localhost:11434" -ForegroundColor Green
  } else {
    Write-Host "Status: OFFLINE - app uses fallback mock data" -ForegroundColor Yellow
    Write-Host "To start: .\toggle-ollama.ps1 on" -ForegroundColor Gray
  }
}

switch ($Action) {
  "on"     { Start-Ollama }
  "off"    { Stop-Ollama }
  "status" { Show-OllamaStatus }
}
