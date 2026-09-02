// lib/firebase.ts
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Initialiser Firebase Admin SDK
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (!serviceAccount) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not set');
}

// Vérifier si déjà initialisé (pour éviter les erreurs en développement)
if (!admin.apps.length) {
  const serviceAccountObj = JSON.parse(serviceAccount);
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountObj),
    databaseURL: process.env.FIREBASE_DATABASE_URL || "https://sunushop-prod-default-rtdb.firebaseio.com"
  });
}

export const db = getFirestore();
export const auth = admin.auth();

// Exporter admin pour les autres usages
export default admin;
