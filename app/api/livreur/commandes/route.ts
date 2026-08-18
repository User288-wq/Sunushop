import { NextRequest, NextResponse } from 'next/server';

// Données mockées - Remplacer par Firestore
const commandes = [
  {
    id: 'CMD-001',
    client: 'Moussa Diouf',
    telephone: '221771234567',
    adresse: 'Dakar, Sicap Liberté',
    produits: ['Sac à dos', 'T-shirt'],
    total: 25000,
    status: 'en_attente',
    created_at: new Date().toISOString(),
    livraison: {
      lat: 14.7167,
      lng: -17.4677,
    },
  },
  {
    id: 'CMD-002',
    client: 'Aminata Ndiaye',
    telephone: '221773456789',
    adresse: 'Dakar, Ouakam',
    produits: ['Chaussures'],
    total: 35000,
    status: 'en_cours',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    livraison: {
      lat: 14.7287,
      lng: -17.4787,
    },
  },
  {
    id: 'CMD-003',
    client: 'Cheikh Fall',
    telephone: '221775678901',
    adresse: 'Dakar, Grand Dakar',
    produits: ['Ordinateur', 'Souris'],
    total: 450000,
    status: 'livré',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    livraison: {
      lat: 14.6957,
      lng: -17.4567,
    },
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const livreurId = searchParams.get('livreurId') || 'LIV-001';

    return NextResponse.json({
      success: true,
      commandes: commandes,
      stats: {
        total: commandes.length,
        en_attente: commandes.filter(c => c.status === 'en_attente').length,
        en_cours: commandes.filter(c => c.status === 'en_cours').length,
        livré: commandes.filter(c => c.status === 'livré').length,
      },
    });
  } catch (error) {
    console.error('Erreur récupération commandes:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { commandeId, status } = await req.json();

    const commande = commandes.find(c => c.id === commandeId);
    if (!commande) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    // Mettre à jour le statut uniquement
    commande.status = status;

    return NextResponse.json({
      success: true,
      commande,
    });
  } catch (error) {
    console.error('Erreur mise à jour commande:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
