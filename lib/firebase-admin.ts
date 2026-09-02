// lib/firebase-admin.ts
// ⚠️ Ce fichier ne doit JAMAIS être importé côté client

import * as admin from 'firebase-admin';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (!serviceAccount) {
  console.warn("⚠️ FIREBASE_SERVICE_ACCOUNT_JSON is not set");
}

if (!admin.apps.length && serviceAccount) {
  try {
    const serviceAccountObj = JSON.parse(serviceAccount);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountObj),
      databaseURL: process.env.FIREBASE_DATABASE_URL || "https://sunushop-prod-default-rtdb.firebaseio.com"
    });
    console.log("✅ Firebase Admin initialized");
  } catch (error) {
    console.error("❌ Firebase initialization error:", error);
  }
}

export const db = admin.firestore();
export default admin;
