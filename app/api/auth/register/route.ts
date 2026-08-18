import { NextRequest, NextResponse } from 'next/server';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
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
    const { email, password, displayName } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Créer l'utilisateur
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Mettre à jour le profil
    if (displayName) {
      await updateProfile(user, { displayName });
    }

    return NextResponse.json({
      success: true,
      message: 'Compte créé avec succès',
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      },
    });
  } catch (error: any) {
    console.error('Erreur inscription:', error);
    
    let message = 'Erreur lors de l\'inscription';
    if (error.code === 'auth/email-already-in-use') {
      message = 'Cet email est déjà utilisé';
    } else if (error.code === 'auth/weak-password') {
      message = 'Le mot de passe doit contenir au moins 6 caractères';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Email invalide';
    }

    return NextResponse.json(
      { error: message, code: error.code },
      { status: 400 }
    );
  }
}
