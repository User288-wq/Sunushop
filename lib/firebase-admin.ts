// lib/firebase-admin.ts
import admin from 'firebase-admin';

console.log("🔵 Chargement de firebase-admin.ts");

function getDb() {
  console.log("🔵 getDb() appelé");

  // Vérifier si admin est déjà initialisé
  if (admin.apps && admin.apps.length > 0) {
    console.log("✅ Firebase déjà initialisé");
    return admin.firestore();
  }

  // Essayer plusieurs sources pour la clé de service
  let serviceAccount = null;
  let serviceAccountStr = '';

  // Source 1 : FIREBASE_SERVICE_ACCOUNT_JSON
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (serviceAccountJson) {
    serviceAccountStr = serviceAccountJson;
    console.log("🔵 Source: FIREBASE_SERVICE_ACCOUNT_JSON");
  }

  // Source 2 : Variables individuelles
  if (!serviceAccountStr) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (projectId && clientEmail && privateKey) {
      serviceAccountStr = JSON.stringify({
        project_id: projectId,
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, '\n'),
      });
      console.log("🔵 Source: variables individuelles");
    }
  }

  if (!serviceAccountStr) {
    console.error("❌ Aucune configuration Firebase trouvée");
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not set');
  }

  try {
    console.log("🔵 Tentative de parsing du JSON...");
    serviceAccount = JSON.parse(serviceAccountStr);
    console.log("✅ JSON parsé avec succès");
    console.log("🔵 project_id:", serviceAccount.project_id);
    console.log("🔵 client_email:", serviceAccount.client_email);

    console.log("🔵 Initialisation de Firebase Admin...");
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL || "https://sunushop-prod-default-rtdb.firebaseio.com"
    });
    console.log("✅ Firebase Admin initialized");

    return admin.firestore();
  } catch (error: any) {
    console.error("❌ Firebase initialization error:", error.message);
    console.error("❌ Stack:", error.stack);
    throw new Error(`Firebase initialization failed: ${error?.message || 'Unknown error'}`);
  }
}

export { getDb };
export default admin;
