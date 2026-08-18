import { NextRequest, NextResponse } from 'next/server';
import { toggleRule } from '@/lib/whatsapp/auto-reply';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rule = toggleRule(id);
    
    if (!rule) {
      return NextResponse.json(
        { success: false, error: 'Règle non trouvée' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, rule });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
