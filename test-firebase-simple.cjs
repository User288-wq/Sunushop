// test-firebase-simple.cjs
const admin = require('firebase-admin');
const fs = require('fs');

console.log("🔵 firebase-admin version:", require('firebase-admin/package.json').version);

try {
  // Lire le service account
  const serviceAccount = JSON.parse(fs.readFileSync('serviceAccountKey.json', 'utf8'));
  console.log("✅ Service account chargé");
  
  // Initialiser
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://sunushop-prod-default-rtdb.firebaseio.com"
  });
  
  console.log("✅ Firebase initialisé avec succès !");
  const db = admin.firestore();
  console.log("✅ Firestore prêt");
  
} catch (error) {
  console.error("❌ Erreur:", error.message);
  console.error("❌ Stack:", error.stack);
}
