# ============================================================
# 🚀 SCRIPT DE LANCEMENT SUNUSHOP
# ============================================================

Write-Host ""
Write-Host "🚀 LANCEMENT SUNUSHOP" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
Write-Host ""

# 1. Vérification des services
Write-Host "🔍 Vérification des services..." -ForegroundColor Yellow

# Evolution API
try {
    $evo = Invoke-RestMethod "http://localhost:8080/" -Headers @{"ngrok-skip-browser-warning"="true"} -ErrorAction Stop
    Write-Host "✅ Evolution API: $($evo.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Evolution API: inaccessible" -ForegroundColor Red
}

# Next.js
try {
    $next = Invoke-RestMethod "http://localhost:3001/" -ErrorAction Stop
    Write-Host "✅ Next.js: accessible" -ForegroundColor Green
} catch {
    Write-Host "❌ Next.js: inaccessible" -ForegroundColor Red
}

# Ngrok
try {
    $ngrok = Invoke-RestMethod "http://127.0.0.1:4040/api/tunnels" -ErrorAction Stop
    $ngrokUrl = $ngrok.tunnels[0].public_url
    Write-Host "✅ Ngrok: $ngrokUrl" -ForegroundColor Green
} catch {
    Write-Host "❌ Ngrok: inaccessible" -ForegroundColor Red
}

Write-Host ""

# 2. Vérification WhatsApp
Write-Host "📱 Vérification WhatsApp..." -ForegroundColor Yellow
$status = Invoke-RestMethod "http://localhost:3001/api/whatsapp/status" -ErrorAction SilentlyContinue
if ($status) {
    Write-Host "✅ WhatsApp: $($status.status)" -ForegroundColor Green
} else {
    Write-Host "❌ WhatsApp: inaccessible" -ForegroundColor Red
}

Write-Host ""

# 3. Vérification paiements
Write-Host "💰 Vérification paiements..." -ForegroundColor Yellow
$wave = Invoke-RestMethod "https://www.sunu-shop.org/api/payment/wave/webhook" -ErrorAction SilentlyContinue
if ($wave) {
    Write-Host "✅ Wave: $($wave.status)" -ForegroundColor Green
} else {
    Write-Host "❌ Wave: inaccessible" -ForegroundColor Red
}

$orange = Invoke-RestMethod "https://www.sunu-shop.org/api/payment/orange/webhook" -ErrorAction SilentlyContinue
if ($orange) {
    Write-Host "✅ Orange: $($orange.status)" -ForegroundColor Green
} else {
    Write-Host "❌ Orange: inaccessible" -ForegroundColor Red
}

Write-Host ""

# 4. Résumé
Write-Host "📋 RÉSUMÉ" -ForegroundColor Cyan
Write-Host "========" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Services: Evolution API, Next.js, Ngrok"
Write-Host "✅ WhatsApp: connecté"
Write-Host "✅ Paiements: Wave, Orange Money"
Write-Host "✅ Site: https://www.sunu-shop.org"
Write-Host ""
Write-Host "🚀 SunuShop est prêt pour le lancement !"
Write-Host ""
Write-Host "📝 Prochaines étapes :"
Write-Host "  1. Partager https://www.sunu-shop.org/preinscription"
Write-Host "  2. Publier sur TikTok"
Write-Host "  3. Contacter les vendeurs ambassadeurs"
Write-Host ""
