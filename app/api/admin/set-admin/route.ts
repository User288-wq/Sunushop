// app/api/admin/set-admin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import { getDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    // ⚠️ Ne pas initialiser Firebase au niveau du module
    // getDb() sera appelé à l'intérieur de la fonction

    const body = await req.json();
    const { uid, makeAdmin = true } = body;

    if (!uid || typeof uid !== 'string') {
      return NextResponse.json(
        { error: 'uid is required and must be a string' },
        { status: 400 }
      );
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid Authorization header' },
        { status: 401 }
      );
    }

    const idToken = authHeader.split('Bearer ')[1];
    let decodedToken;

    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    if (decodedToken.admin !== true) {
      return NextResponse.json(
        { error: 'Only admins can manage admin claims' },
        { status: 403 }
      );
    }

    const user = await admin.auth().getUser(uid);
    const currentClaims = user.customClaims || {};
    const newClaims = { ...currentClaims, admin: makeAdmin === true };

    await admin.auth().setCustomUserClaims(uid, newClaims);

    return NextResponse.json({
      success: true,
      message: makeAdmin
        ? `User ${uid} is now an admin`
        : `Admin rights removed from user ${uid}`,
      claims: newClaims,
    });
  } catch (error: any) {
    console.error('Error in /api/admin/set-admin:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
