import { NextResponse } from 'next/server';
import { pushService } from '@/lib/push/push-service';

export async function GET() {
  try {
    const subscribers = pushService.getSubscriptions();
    
    return NextResponse.json({
      success: true,
      count: subscribers.length,
      subscribers: subscribers.map((sub) => ({
        endpoint: sub.endpoint,
        keys: sub.keys,
      })),
    });
  } catch (error: any) {
    console.error('❌ Erreur récupération abonnés:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
