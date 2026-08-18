import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { product, platforms } = await req.json();

    if (!product || !product.title || !product.price || !product.productUrl) {
      return NextResponse.json(
        { error: 'Données du produit manquantes' },
        { status: 400 }
      );
    }

    // Générer les liens de partage
    const url = encodeURIComponent(product.productUrl);
    const title = encodeURIComponent(`${product.title} - ${product.price.toLocaleString()} FCFA`);

    const links = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`,
      instagram: `https://www.instagram.com/create/story?text=${title}%20${url}`,
      whatsapp: `https://wa.me/?text=${title}%20${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
    };

    // Simuler une publication réussie
    const results: any = {};
    const selectedPlatforms = platforms || ['facebook', 'whatsapp'];

    for (const platform of selectedPlatforms) {
      if (links[platform as keyof typeof links]) {
        results[platform] = {
          success: true,
          message: `Partagé sur ${platform}`,
          url: links[platform as keyof typeof links],
        };
      }
    }

    return NextResponse.json({
      success: true,
      results,
      links,
      message: 'Partage réussi',
    });
  } catch (error: any) {
    console.error('❌ Erreur partage:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
