import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    enabled: process.env.USE_CHATBOT === 'true',
  });
}
