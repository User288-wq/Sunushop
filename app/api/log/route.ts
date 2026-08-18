import { NextRequest, NextResponse } from 'next/server';

// Stockage en mémoire (redémarrage = perte)
const logs: any[] = [];
const MAX_LOGS = 1000;

export async function POST(req: NextRequest) {
  try {
    const entry = await req.json();
    
    // Ajouter le timestamp
    entry.received_at = new Date().toISOString();
    
    logs.push(entry);
    
    // Limiter le nombre de logs
    if (logs.length > MAX_LOGS) {
      logs.splice(0, logs.length - MAX_LOGS);
    }
    
    console.log('📝 Log reçu:', entry.message);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Erreur log:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    count: logs.length,
    logs: logs.slice(-100), // Les 100 derniers logs
  });
}
