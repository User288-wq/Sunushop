// lib/firebase-admin.ts
import * as admin from 'firebase-admin';

let initialized = false;

export function getDb() {
  if (initialized) {
    return admin.firestore();
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (!serviceAccountJson) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is missing');
  }

  let serviceAccount: any;
  try {
    serviceAccount = JSON.parse(serviceAccountJson);
  } catch (err) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON');
  }

  // Vérification basique du service account
  if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
    throw new Error('Service account JSON is incomplete (missing project_id / private_key / client_email)');
  }

  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    initialized = true;
    console.log('✅ Firebase Admin initialized');
  } catch (error: any) {
    console.error('Firebase init error:', error);
    throw new Error(`Firebase init failed: ${error.message}`);
  }

  return admin.firestore();
}

export default admin;
