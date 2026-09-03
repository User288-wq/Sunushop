// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const db = getDb();

    // Ajouter directement via Admin SDK (compte de service)
    const product = {
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    };

    const docRef = await db.collection('products').add(product);
    
    return NextResponse.json({
      success: true,
      product: { id: docRef.id, ...product },
    });
  } catch (error: any) {
    console.error('POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
