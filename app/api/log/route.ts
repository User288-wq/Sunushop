import { NextRequest, NextResponse } from 'next/server';

// En mémoire - En production, utiliser une base de données
const logs: any[] = [];

export async function POST(req: NextRequest) {
  try {
    const entry = await req.json();
    logs.push({
      ...entry,
      received_at: new Date().toISOString(),
    });

    // Garder seulement les 1000 derniers logs
    if (logs.length > 1000) {
      logs.splice(0, logs.length - 1000);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  // Retourner les logs (admin seulement)
  return NextResponse.json({
    success: true,
    count: logs.length,
    logs: logs.slice(-100),
  });
}
