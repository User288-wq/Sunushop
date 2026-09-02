// lib/firebase.ts
import admin from 'firebase-admin';

// ⚠️ CE FICHIER NE DOIT ÊTRE IMPORTÉ QUE CÔTÉ SERVEUR
// (dans les API routes, pages avec getServerSideProps, etc.)

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (!serviceAccount) {
  console.warn("⚠️ FIREBASE_SERVICE_ACCOUNT_JSON is not set");
}

let adminApp;

if (!admin.apps.length && serviceAccount) {
  try {
    const serviceAccountObj = JSON.parse(serviceAccount);
    adminApp = admin.initializeApp({
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
