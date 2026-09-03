// lib/firebase-admin.ts
import admin from 'firebase-admin';

// ⚠️ Ne pas initialiser Firebase au niveau du module
// L'initialisation se fait uniquement à l'appel de getDb()

let initialized = false;

export function getDb() {
  if (initialized) {
    return admin.firestore();
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (!serviceAccountJson) {
    console.warn("⚠️ FIREBASE_SERVICE_ACCOUNT_JSON is not set");
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not set');
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountJson);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    initialized = true;
    console.log("✅ Firebase Admin initialized");
    return admin.firestore();
  } catch (error: any) {
    console.error("❌ Firebase initialization error:", error.message);
    throw new Error(`Firebase initialization failed: ${error.message}`);
  }
}

export default admin;
