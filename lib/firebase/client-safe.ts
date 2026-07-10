// ⚠️ Ce fichier est 100% dynamique – aucun import statique de Firebase
// Il ne doit être importé que dans des composants client, avec import()

export async function getFirebaseClient() {
  if (typeof window === 'undefined') {
    throw new Error('Firebase ne peut pas être initialisé côté serveur');
  }

  // Tous les imports sont dynamiques
  const { initializeApp, getApps, getApp } = await import('firebase/app');
  const { getAuth, setPersistence, browserLocalPersistence } = await import('firebase/auth');
  const { getFirestore, enableIndexedDbPersistence } = await import('firebase/firestore');
  const { getStorage } = await import('firebase/storage');

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);

  if (typeof window !== 'undefined') {
    setPersistence(auth, browserLocalPersistence);
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') console.warn('Persistence non active (multi-onglets)');
    });
  }

  return { auth, db, storage };
}
