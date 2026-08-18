# ============================================================
# 🔍 VÉRIFICATION DES LOGS
# ============================================================

Write-Host ""
Write-Host "🔍 Vérification des logs SunuShop" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan
Write-Host ""

# 1. Vérifier les logs en développement
Write-Host "📝 Vérification des logs en développement..." -ForegroundColor Yellow
try {
    $logs = Invoke-RestMethod -Uri "http://localhost:3001/api/log" -ErrorAction SilentlyContinue
    if ($logs) {
        Write-Host "✅ Logs disponibles: $($logs.count)" -ForegroundColor Green
        Write-Host "   Dernier log: $($logs.logs[-1]?.message)" -ForegroundColor Gray
    } else {
        Write-Host "⚠️ Aucun log disponible" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Erreur récupération logs" -ForegroundColor Red
}

# 2. Vérifier les logs en production
Write-Host ""
Write-Host "📝 Vérification des logs en production..." -ForegroundColor Yellow
try {
    $prodLogs = Invoke-RestMethod -Uri "https://www.sunu-shop.org/api/log" -ErrorAction SilentlyContinue
    if ($prodLogs) {
        Write-Host "✅ Logs disponibles en production: $($prodLogs.count)" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Aucun log en production" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Erreur récupération logs production" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 RÉSUMÉ" -ForegroundColor Cyan
Write-Host "========" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Les logs sont configurés pour :"
Write-Host "   - Développement: console.log"
Write-Host "   - Production: API /api/log"
Write-Host ""
Write-Host "📝 Pour voir les logs en développement :"
Write-Host "   npm run dev"
Write-Host "   Invoke-RestMethod http://localhost:3001/api/log"
Write-Host ""
Write-Host "📝 Pour voir les logs en production :"
Write-Host "   Invoke-RestMethod https://www.sunu-shop.org/api/log"
Write-Host ""
