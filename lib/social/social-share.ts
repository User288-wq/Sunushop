// ============================================================
// 📱 PARTAGE SOCIAL UNIFIÉ
// ============================================================

export interface SocialShareData {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  productUrl: string;
  videoUrl?: string;
  category?: string;
}

export interface SocialShareResult {
  platform: string;
  url: string;
  success: boolean;
  error?: string;
}

class SocialShareService {
  // ============================================================
  // 1. Ouvrir un lien dans l'application native ou navigateur
  // ============================================================

  openLink(url: string, platform: string): void {
    if (typeof window === 'undefined') return;

    // Ouvrir dans un nouvel onglet
    window.open(url, '_blank');
  }

  // ============================================================
  // 2. TikTok - Partage et navigation
  // ============================================================

  shareTikTok(data: SocialShareData): SocialShareResult {
    // URL de partage TikTok (web)
    const text = encodeURIComponent(`${data.title} - ${data.price.toLocaleString()} FCFA\n\nDécouvrez ce produit sur SunuShop !`);
    const url = encodeURIComponent(data.productUrl);
    
    // Lien TikTok
    const shareUrl = `https://www.tiktok.com/share/video?text=${text}&url=${url}`;

    // Tentative d'ouvrir l'app TikTok (deep link)
    const appUrl = `tiktok://share?text=${text}&url=${url}`;

    // Ouvrir TikTok (tentative app, fallback web)
    if (typeof window !== 'undefined') {
      // Essayer d'ouvrir l'app
      const appWindow = window.open(appUrl, '_blank');
      // Si l'app ne s'ouvre pas, utiliser le web
      setTimeout(() => {
        if (!appWindow || appWindow.closed) {
          window.open(shareUrl, '_blank');
        }
      }, 500);
    }

    return {
      platform: 'tiktok',
      url: shareUrl,
      success: true,
    };
  }

  // ============================================================
  // 3. WhatsApp - Partage et navigation
  // ============================================================

  shareWhatsApp(data: SocialShareData): SocialShareResult {
    const message = encodeURIComponent(
      `🛍️ ${data.title}\n💰 ${data.price.toLocaleString()} FCFA\n📱 ${data.productUrl}\n\nCommandez sur SunuShop !`
    );

    // Lien WhatsApp (mobile) et WhatsApp Web (desktop)
    const waLink = `https://wa.me/?text=${message}`;
    const waAppLink = `whatsapp://send?text=${message}`;

    if (typeof window !== 'undefined') {
      // Détecter le mobile
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const targetUrl = isMobile ? waAppLink : waLink;
      window.open(targetUrl, '_blank');
    }

    return {
      platform: 'whatsapp',
      url: waLink,
      success: true,
    };
  }

  // ============================================================
  // 4. X (Twitter) - Partage et navigation
  // ============================================================

  shareTwitter(data: SocialShareData): SocialShareResult {
    const text = encodeURIComponent(
      `${data.title} - ${data.price.toLocaleString()} FCFA\n\nDécouvrez ce produit sur SunuShop !`
    );
    const url = encodeURIComponent(data.productUrl);
    const hashtags = 'SunuShop,ShoppingSn,DakarShop';

    const shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${hashtags}`;

    if (typeof window !== 'undefined') {
      window.open(shareUrl, '_blank');
    }

    return {
      platform: 'twitter',
      url: shareUrl,
      success: true,
    };
  }

  // ============================================================
  // 5. Instagram - Partage et navigation
  // ============================================================

  shareInstagram(data: SocialShareData): SocialShareResult {
    // Instagram n'a pas de partage direct via lien
    // On redirige vers le profil ou le store
    const caption = encodeURIComponent(
      `${data.title} - ${data.price.toLocaleString()} FCFA\n\n${data.description || ''}\n\n#SunuShop #ShoppingSn`
    );
    const url = encodeURIComponent(data.productUrl);

    // Lien vers Instagram (app)
    const instagramApp = `instagram://share?text=${caption}`;
    // Lien vers le store
    const instagramWeb = `https://www.instagram.com/create/story?text=${caption}`;

    if (typeof window !== 'undefined') {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const targetUrl = isMobile ? instagramApp : instagramWeb;
      window.open(targetUrl, '_blank');
    }

    return {
      platform: 'instagram',
      url: instagramWeb,
      success: true,
    };
  }

  // ============================================================
  // 6. Facebook - Partage et navigation
  // ============================================================

  shareFacebook(data: SocialShareData): SocialShareResult {
    const url = encodeURIComponent(data.productUrl);
    const quote = encodeURIComponent(`${data.title} - ${data.price.toLocaleString()} FCFA`);

    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`;

    if (typeof window !== 'undefined') {
      window.open(shareUrl, '_blank');
    }

    return {
      platform: 'facebook',
      url: shareUrl,
      success: true,
    };
  }

  // ============================================================
  // 7. Partager sur toutes les plateformes
  // ============================================================

  shareAll(data: SocialShareData): SocialShareResult[] {
    const results: SocialShareResult[] = [];

    try {
      results.push(this.shareTikTok(data));
      results.push(this.shareWhatsApp(data));
      results.push(this.shareTwitter(data));
      results.push(this.shareInstagram(data));
      results.push(this.shareFacebook(data));
    } catch (error: any) {
      results.push({
        platform: 'error',
        url: '',
        success: false,
        error: error.message,
      });
    }

    return results;
  }

  // ============================================================
  // 8. Générer tous les liens
  // ============================================================

  generateAllLinks(data: SocialShareData): Record<string, string> {
    const text = encodeURIComponent(`${data.title} - ${data.price.toLocaleString()} FCFA`);
    const url = encodeURIComponent(data.productUrl);

    return {
      tiktok: `https://www.tiktok.com/share/video?text=${text}&url=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      instagram: `https://www.instagram.com/create/story?text=${text}%20${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
    };
  }
}

export const socialShareService = new SocialShareService();
