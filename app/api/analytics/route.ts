import { NextRequest, NextResponse } from 'next/server';

// Stockage en mémoire
const events: any[] = [];
const eventsLimit = 10000;

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : null;

    events.push({
      ...event,
      received_at: new Date().toISOString(),
      ip: ip || 'unknown',
      userAgent: req.headers.get('user-agent') || 'unknown',
    });

    if (events.length > eventsLimit) {
      events.splice(0, events.length - eventsLimit);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Erreur analytics:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '100');
    const days = parseInt(searchParams.get('days') || '7');

    let filtered = events;
    if (type) {
      filtered = filtered.filter(e => e.type === type);
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    filtered = filtered.filter(e => new Date(e.timestamp) >= cutoffDate);

    const stats: any = {
      total: filtered.length,
      byType: {} as Record<string, number>,
      byDay: {} as Record<string, number>,
      byHour: {} as Record<string, number>,
      byCountry: {} as Record<string, number>,
      topProducts: [],
      conversionRate: 0,
      averageSessionDuration: 0,
      bounceRate: 0,
      revenue: 0,
      ordersCount: 0,
      whatsappMessages: 0,
    };

    const productViews: Record<string, { name: string; count: number }> = {};
    const sessions = new Set<string>();
    const onePageSessions = new Set<string>();
    let totalRevenue = 0;
    let orders = 0;
    let whatsappMsgs = 0;

    filtered.forEach(e => {
      stats.byType[e.type] = (stats.byType[e.type] || 0) + 1;
      
      const date = new Date(e.timestamp);
      const day = date.toISOString().split('T')[0];
      const hour = date.getHours();
      
      stats.byDay[day] = (stats.byDay[day] || 0) + 1;
      stats.byHour[hour] = (stats.byHour[hour] || 0) + 1;

      // Sessions
      if (e.sessionId) {
        sessions.add(e.sessionId);
      }

      // Pages vues (pour taux rebond)
      if (e.type === 'page_view') {
        // Simuler le taux rebond
        if (!e.sessionId || !sessions.has(e.sessionId)) {
          onePageSessions.add(e.sessionId || '');
        }
      }

      // Top produits
      if (e.type === 'product_view' && e.data?.productId) {
        if (!productViews[e.data.productId]) {
          productViews[e.data.productId] = { name: e.data.productName || e.data.productId, count: 0 };
        }
        productViews[e.data.productId].count++;
      }

      // Revenus
      if (e.type === 'purchase' && e.data?.total) {
        totalRevenue += e.data.total;
        orders++;
      }

      // Messages WhatsApp
      if (e.type === 'whatsapp_send' || e.type === 'whatsapp_receive') {
        whatsappMsgs++;
      }
    });

    stats.topProducts = Object.entries(productViews)
      .map(([id, data]) => ({ id, name: data.name, count: data.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const productViewsCount = stats.byType['product_view'] || 0;
    const purchasesCount = stats.byType['purchase'] || 0;
    stats.conversionRate = productViewsCount > 0 ? Math.round((purchasesCount / productViewsCount) * 100) : 0;
    stats.bounceRate = sessions.size > 0 ? Math.round((onePageSessions.size / sessions.size) * 100) : 0;
    stats.averageSessionDuration = sessions.size > 0 ? Math.round((filtered.length / sessions.size) * 60) : 0;
    stats.revenue = totalRevenue;
    stats.ordersCount = orders;
    stats.whatsappMessages = whatsappMsgs;

    return NextResponse.json({
      success: true,
      stats,
      events: filtered.slice(-limit),
      totalEvents: events.length,
    });
  } catch (error: any) {
    console.error('❌ Erreur GET analytics:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
