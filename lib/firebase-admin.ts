// lib/firebase-admin.ts
import admin from 'firebase-admin';

let app;

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (!serviceAccountJson) {
  console.warn("⚠️ FIREBASE_SERVICE_ACCOUNT_JSON is not set");
}

if (!admin.apps.length && serviceAccountJson) {
  try {
    const serviceAccount = JSON.parse(serviceAccountJson);
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL || "https://sunushop-prod-default-rtdb.firebaseio.com"
    });
    console.log("✅ Firebase Admin initialized with service account");
  } catch (error) {
    console.error("❌ Firebase initialization error:", error);
  }
}

export const db = admin.firestore();
export default admin;
