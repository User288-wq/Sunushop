// lib/firebase-admin.ts
import admin from 'firebase-admin';

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

function getDb() {
  // Safer check – never access .length on undefined
  if (!admin.apps || admin.apps.length === 0) {
    if (!serviceAccountJson) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not set');
    }

    try {
      const serviceAccount = JSON.parse(serviceAccountJson);

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      console.log('✅ Firebase Admin initialized');
    } catch (error: any) {
      console.error('❌ Firebase initialization error:', error.message);
      throw error;
    }
  }

  return admin.firestore();
}

export { getDb };
export default admin;
