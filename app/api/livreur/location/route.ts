import { NextRequest, NextResponse } from 'next/server';

// Stockage en mémoire des positions des livreurs
// En production, utiliser une base de données
const livreurPositions: Record<string, { lat: number; lng: number; timestamp: number }> = {};

export async function POST(req: NextRequest) {
  try {
    const { livreurId, lat, lng } = await req.json();

    if (!livreurId || lat === undefined || lng === undefined) {
      return NextResponse.json(
        { error: 'Données incomplètes' },
        { status: 400 }
      );
    }

    // Mettre à jour la position
    livreurPositions[livreurId] = {
      lat,
      lng,
      timestamp: Date.now(),
    };

    return NextResponse.json({
      success: true,
      message: 'Position mise à jour',
      position: livreurPositions[livreurId],
    });
  } catch (error) {
    console.error('Erreur mise à jour position:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const livreurId = searchParams.get('id');

    if (livreurId) {
      // Récupérer la position d'un livreur spécifique
      const position = livreurPositions[livreurId];
      if (!position) {
        return NextResponse.json(
          { error: 'Livreur non trouvé' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        position,
      });
    }

    // Récupérer toutes les positions
    return NextResponse.json({
      success: true,
      positions: livreurPositions,
    });
  } catch (error) {
    console.error('Erreur récupération positions:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
