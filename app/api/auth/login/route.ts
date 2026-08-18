import { NextRequest, NextResponse } from 'next/server';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp, getApps, getApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return NextResponse.json({
      success: true,
      message: 'Connexion réussie',
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      },
    });
  } catch (error: any) {
    console.error('Erreur connexion:', error);
    
    let message = 'Erreur de connexion';
    if (error.code === 'auth/user-not-found') {
      message = 'Utilisateur non trouvé';
    } else if (error.code === 'auth/wrong-password') {
      message = 'Mot de passe incorrect';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Email invalide';
    }

    return NextResponse.json(
      { error: message, code: error.code },
      { status: 401 }
    );
  }
}
