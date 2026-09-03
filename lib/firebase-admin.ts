// lib/firebase-admin.ts
import admin from 'firebase-admin';

let initialized = false;

export function getDb() {
  console.log("🔵 getDb() appelé");

  if (initialized) {
    console.log("✅ Firebase déjà initialisé");
    return admin.firestore();
  }

  // Vérifier les variables individuelles
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  console.log("🔵 projectId:", projectId ? "✅" : "❌");
  console.log("🔵 clientEmail:", clientEmail ? "✅" : "❌");
  console.log("🔵 privateKey:", privateKey ? "✅" : "❌");

  if (projectId && clientEmail && privateKey) {
    try {
      privateKey = privateKey.replace(/\\n/g, '\n');
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      initialized = true;
      console.log("✅ Firebase initialized from individual variables");
      return admin.firestore();
    } catch (error: any) {
      console.error("❌ Error with individual variables:", error.message);
    }
  }

  // Fallback: FIREBASE_SERVICE_ACCOUNT_JSON
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  console.log("🔵 serviceAccountJson:", serviceAccountJson ? "✅" : "❌");

  if (serviceAccountJson) {
    try {
      const serviceAccount = JSON.parse(serviceAccountJson);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      initialized = true;
      console.log("✅ Firebase initialized from SERVICE_ACCOUNT_JSON");
      return admin.firestore();
    } catch (error: any) {
      console.error("❌ Error with SERVICE_ACCOUNT_JSON:", error.message);
      throw new Error(`Firebase initialization failed: ${error.message}`);
    }
  }

  throw new Error('No Firebase configuration found');
}

export default admin;
