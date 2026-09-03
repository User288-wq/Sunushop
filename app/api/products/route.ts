// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    const snapshot = await db.collection('products').get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ success: true, products, count: products.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const db = getDb();
    const product = {
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    };
    const docRef = await db.collection('products').add(product);
    return NextResponse.json({ success: true, product: { id: docRef.id, ...product } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ AJOUT DE LA MÉTHODE PUT
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: 'ID produit requis' }, { status: 400 });
    }

    const db = getDb();
    const docRef = db.collection('products').doc(id);

    // Vérifier si le document existe
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
    }

    // Mettre à jour avec les nouvelles données
    await docRef.update({
      ...updateData,
      updatedAt: new Date(),
    });

    // Récupérer le produit mis à jour
    const updatedDoc = await docRef.get();
    return NextResponse.json({
      success: true,
      product: { id: updatedDoc.id, ...updatedDoc.data() },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
