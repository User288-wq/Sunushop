import { NextRequest, NextResponse } from 'next/server';
import { getRules, addRule, deleteRule, toggleRule } from '@/lib/whatsapp/auto-reply';

export async function GET() {
  try {
    const rules = getRules();
    return NextResponse.json({ success: true, rules });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { keywords, response, matchType } = await req.json();
    
    if (!keywords || keywords.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Mots-clés requis' },
        { status: 400 }
      );
    }
    
    if (!response || response.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Réponse requise' },
        { status: 400 }
      );
    }
    
    const rule = addRule({
      keywords,
      response,
      matchType: matchType || 'contains',
      enabled: true,
    });
    
    return NextResponse.json({ success: true, rule });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID requis' },
        { status: 400 }
      );
    }
    
    const result = deleteRule(id);
    return NextResponse.json({ success: result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
