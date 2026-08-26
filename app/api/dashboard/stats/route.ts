import { NextResponse } from 'next/server';

// Stockage en mémoire (à remplacer par Firestore)
let orders: any[] = [];
let products: any[] = [];

export async function GET() {
  try {
    // Simuler des données (à connecter à Firestore)
    const stats = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
      totalProducts: products.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      whatsappStatus: await getWhatsAppStatus(),
      recentOrders: orders.slice(-5).reverse(),
    };

    return NextResponse.json({ success: true, stats });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

async function getWhatsAppStatus() {
  try {
    const res = await fetch(`${process.env.EVOLUTION_API_URL}/instance/connectionState/${process.env.EVOLUTION_INSTANCE}`, {
      headers: { apikey: process.env.EVOLUTION_API_KEY || '' },
    });
    const data = await res.json();
    return data.instance?.state || 'unknown';
  } catch {
    return 'unknown';
  }
}
