# ============================================================
# SUNUSHOP WHATSAPP - FAST OF FAST
# Site: https://www.sunu-shop.org
# ============================================================

$APIIKEY = "429683C4C977415CAAFCCE10F7D57E11"
$EVO_URL = "http://localhost:8080"
$INSTANCE = "sunushop"
$SITE_URL = "https://www.sunu-shop.org"

# FONCTION PRINCIPALE - Envoyer un message
function wa {
    param([string]$Number, [string]$Text)
    $body = @{ number = $Number; text = $Text } | ConvertTo-Json
    try {
        $result = Invoke-RestMethod "$EVO_URL/message/sendText/$INSTANCE" `
            -Method Post `
            -Headers @{ apikey = $APIIKEY; "Content-Type" = "application/json" } `
            -Body $body -TimeoutSec 10
        Write-Host "✅ Envoyé à $Number" -ForegroundColor Green
        Write-Host "   ID: $($result.key.id)" -ForegroundColor Gray
        return $result
    } catch {
        Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# FONCTION - État de WhatsApp
function status {
    try {
        $state = Invoke-RestMethod "$EVO_URL/instance/connectionState/$INSTANCE" `
            -Headers @{ apikey = $APIIKEY } -TimeoutSec 5
        $s = $state.instance.state
        Write-Host "📱 WhatsApp: " -NoNewline
        Write-Host $s -ForegroundColor $(if($s -eq "open"){"Green"}else{"Yellow"})
        if ($s -eq "open") { Write-Host "   ✅ Connecté - $SITE_URL" -ForegroundColor Green }
        return $s
    } catch {
        Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
        return "error"
    }
}

# FONCTION - Info instance
function info {
    try {
        $instances = Invoke-RestMethod "$EVO_URL/instance/fetchInstances" `
            -Headers @{ apikey = $APIIKEY }
        $inst = $instances | Where-Object { $_.name -eq $INSTANCE }
        if ($inst) {
            Write-Host "📱 Instance: $($inst.name)" -ForegroundColor Cyan
            Write-Host "   Statut: $($inst.connectionStatus)" -ForegroundColor $(if($inst.connectionStatus -eq "open"){"Green"}else{"Yellow"})
            Write-Host "   WUID: $($inst.ownerJid)" -ForegroundColor Gray
            Write-Host "   Profil: $($inst.profileName)" -ForegroundColor Gray
            Write-Host "   Messages: $($inst._count.Message)" -ForegroundColor Gray
            Write-Host "   Site: $SITE_URL" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# FONCTION - Envoyer le catalogue
function catalogue {
    param([string]$Number)
    wa $Number "📚 Découvrez notre catalogue sur $SITE_URL/catalogue"
}

# FONCTION - Envoyer les coordonnées
function contact {
    param([string]$Number)
    wa $Number "📞 SunuShop - Contact: +221 78 014 30 70 | Site: $SITE_URL"
}

# FONCTION - Envoyer une image
function waimage {
    param([string]$Number, [string]$ImageUrl, [string]$Caption = "")
    $body = @{
        number = $Number
        mediatype = "image"
        mimetype = "image/jpeg"
        media = $ImageUrl
        caption = $Caption
    } | ConvertTo-Json -Depth 5
    try {
        $result = Invoke-RestMethod "$EVO_URL/message/sendMedia/$INSTANCE" `
            -Method Post `
            -Headers @{ apikey = $APIIKEY; "Content-Type" = "application/json" } `
            -Body $body -TimeoutSec 15
        Write-Host "✅ Image envoyée à $Number" -ForegroundColor Green
        return $result
    } catch {
        Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# FONCTION - Envoi groupé
function broadcast {
    param([string[]]$Numbers, [string]$Text, [int]$Delay = 3)
    Write-Host "📢 Broadcast à $($Numbers.Count) destinataires..." -ForegroundColor Cyan
    foreach ($n in $Numbers) {
        Write-Host "   → $n..." -NoNewline
        $r = wa $n $Text
        if ($r) { Write-Host " ✅" -ForegroundColor Green } else { Write-Host " ❌" -ForegroundColor Red }
        Start-Sleep -Seconds $Delay
    }
    Write-Host "✅ Terminé" -ForegroundColor Green
}

# ALIAS RAPIDES
Set-Alias -Name w -Value wa
Set-Alias -Name s -Value status
Set-Alias -Name i -Value info
Set-Alias -Name cat -Value catalogue
Set-Alias -Name c -Value contact
Set-Alias -Name img -Value waimage

# VARIABLES PRÉDÉFINIES
$MOI = "221773509559"
$MOUSSA = "221780143070"
$SITE = "www.sunu-shop.org"

# MESSAGE DE BIENVENUE
Clear-Host
Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                               ║" -ForegroundColor Cyan
Write-Host "║   🚀 SUNUSHOP WHATSAPP - FAST OF FAST 🚀                    ║" -ForegroundColor Cyan
Write-Host "║   🌐 $SITE_URL                                  ║" -ForegroundColor Cyan
Write-Host "║                                                               ║" -ForegroundColor Cyan
Write-Host "║   Commandes:                                                  ║" -ForegroundColor Cyan
Write-Host "║   ───────────────────────────────────────────────────────────  ║" -ForegroundColor Cyan
Write-Host "║   w 221XXXXXXX 'message'  → Envoyer un message               ║" -ForegroundColor White
Write-Host "║   img 221XXXXXXX URL 'caption' → Envoyer image               ║" -ForegroundColor White
Write-Host "║   cat 221XXXXXXX          → Envoyer le catalogue             ║" -ForegroundColor White
Write-Host "║   c 221XXXXXXX            → Envoyer les coordonnées          ║" -ForegroundColor White
Write-Host "║   status / s              → Vérifier l'état                 ║" -ForegroundColor White
Write-Host "║   info / i                → Infos instance                  ║" -ForegroundColor White
Write-Host "║   broadcast @numéros 'msg' → Envoi groupé                   ║" -ForegroundColor White
Write-Host "║                                                               ║" -ForegroundColor Cyan
Write-Host "║   Variables:                                                  ║" -ForegroundColor Cyan
Write-Host "║   ───────────────────────────────────────────────────────────  ║" -ForegroundColor Cyan
Write-Host "║   `$MOI    = $MOI (ton compte)                    ║" -ForegroundColor Yellow
Write-Host "║   `$MOUSSA = $MOUSSA (Moussa)                    ║" -ForegroundColor Yellow
Write-Host "║   `$SITE   = $SITE                                ║" -ForegroundColor Yellow
Write-Host "║                                                               ║" -ForegroundColor Cyan
Write-Host "║   Exemples:                                                   ║" -ForegroundColor Cyan
Write-Host "║   ───────────────────────────────────────────────────────────  ║" -ForegroundColor Cyan
Write-Host "║   w `$MOUSSA 'Salut Moussa !'                                 ║" -ForegroundColor White
Write-Host "║   cat `$MOUSSA                                                 ║" -ForegroundColor White
Write-Host "║   c `$MOUSSA                                                   ║" -ForegroundColor White
Write-Host "║   s                                                           ║" -ForegroundColor White
Write-Host "║                                                               ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

Write-Host "`n✅ Prêt !" -ForegroundColor Green
