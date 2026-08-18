import { NextRequest, NextResponse } from 'next/server';
import { tiktokService } from '@/lib/tiktok/tiktok-service';

export async function POST(req: NextRequest) {
  try {
    const { productId, title, description, price, imageUrl, videoUrl, productUrl } = await req.json();

    if (!title || !price || !imageUrl || !productUrl) {
      return NextResponse.json(
        { error: 'Données manquantes pour le partage' },
        { status: 400 }
      );
    }

    const product = {
      title,
      description: description || 'Découvrez ce produit sur SunuShop !',
      price,
      imageUrl,
      videoUrl,
      productUrl,
    };

    // Partager sur TikTok
    const result = await tiktokService.shareProduct(product);

    // Générer les liens de partage
    const shareLinks = {
      tiktok: tiktokService.generateShareLink(product),
      whatsapp: tiktokService.generateWhatsAppShare(product),
      copy: productUrl,
    };

    // Générer le script vidéo
    const script = tiktokService.generateVideoScript(product);

    return NextResponse.json({
      success: true,
      result,
      shareLinks,
      script,
      hashtags: tiktokService.suggestHashtags('Mode'),
      trends: tiktokService.getTikTokTrends(),
    });
  } catch (error: any) {
    console.error('❌ Erreur partage TikTok:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
