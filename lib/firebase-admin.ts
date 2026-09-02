// lib/firebase-admin.ts
import * as admin from 'firebase-admin';

let app: admin.app.App | null = null;

export function getDb() {
  if (app) {
    return app.firestore();
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (!serviceAccountJson) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not set');
  }

  let serviceAccount: admin.ServiceAccount;
  try {
    serviceAccount = JSON.parse(serviceAccountJson);
  } catch (error) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON');
  }

  // Vérifications de base
  if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
    throw new Error('Service Account JSON is incomplete');
  }

  try {
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      // databaseURL n'est pas obligatoire pour Firestore, mais on le met si tu l'utilises
      databaseURL: process.env.FIREBASE_DATABASE_URL || `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`,
    });

    console.log('✅ Firebase Admin initialized successfully');
  } catch (error: any) {
    console.error('❌ Firebase Admin initialization failed:', error.message);
    throw error;
  }

  return app.firestore();
}

export default admin;
