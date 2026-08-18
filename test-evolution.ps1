# test-evolution.ps1
Write-Host "🔧 Test de connexion à Evolution API" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Lire les variables d'environnement du fichier .env.local
$envContent = Get-Content ".env.local" -Raw
$envVars = @{}
$envContent -split "`n" | ForEach-Object {
    if ($_ -match '^([^=]+)=(.*)$') {
        $envVars[$matches[1].Trim()] = $matches[2].Trim()
    }
}

$url = if ($envVars.ContainsKey("EVOLUTION_URL")) { $envVars["EVOLUTION_URL"] } else { "http://localhost:8080" }
$key = if ($envVars.ContainsKey("EVOLUTION_KEY")) { $envVars["EVOLUTION_KEY"] } else { "429683C4C977415CAAFCCE10F7D57E11" }
$instance = if ($envVars.ContainsKey("EVOLUTION_INSTANCE")) { $envVars["EVOLUTION_INSTANCE"] } else { "sunushop" }

Write-Host "`n📡 Configuration:" -ForegroundColor Yellow
Write-Host "  URL: $url" -ForegroundColor White
Write-Host "  Instance: $instance" -ForegroundColor White
if ($key) {
    Write-Host "  Clé: $($key.Substring(0, [Math]::Min(10, $key.Length)))..." -ForegroundColor White
} else {
    Write-Host "  Clé: Non définie" -ForegroundColor Red
}

try {
    Write-Host "`n📡 Test 1: Liste des instances..." -ForegroundColor Yellow
    $instances = Invoke-RestMethod -Uri "$url/instance/fetchInstances" -Headers @{ "apikey" = $key } -ErrorAction Stop
    Write-Host "✅ Instances trouvées: $($instances | ConvertTo-Json)" -ForegroundColor Green
    
    Write-Host "`n📡 Test 2: Statut de l'instance..." -ForegroundColor Yellow
    $status = Invoke-RestMethod -Uri "$url/instance/status/$instance" -Headers @{ "apikey" = $key } -ErrorAction Stop
    Write-Host "✅ Statut: $($status | ConvertTo-Json)" -ForegroundColor Green
    
    Write-Host "`n📡 Test 3: Envoi de message test..." -ForegroundColor Yellow
    $body = @{
        number = "221780143070"
        text = "✅ Test de connexion depuis SunuShop $(Get-Date -Format 'HH:mm:ss')"
    } | ConvertTo-Json
    
    $result = Invoke-RestMethod -Uri "$url/message/sendText/$instance" -Method Post -Headers @{ 
        "apikey" = $key
        "Content-Type" = "application/json"
    } -Body $body -ErrorAction Stop
    
    Write-Host "✅ Message envoyé: $($result | ConvertTo-Json)" -ForegroundColor Green
    
    Write-Host "`n✅ TOUS LES TESTS SONT RÉUSSIS ! 🎉" -ForegroundColor Green
} catch {
    Write-Host "`n❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`n💡 Vérifiez que Evolution API est démarré sur le port 8080" -ForegroundColor Yellow
    Write-Host "   netstat -ano | findstr :8080" -ForegroundColor White
}
