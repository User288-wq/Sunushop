// test-minimal.cjs
const admin = require('firebase-admin');
const fs = require('fs');

console.log("🔵 Test Firebase Admin");

try {
  const serviceAccount = JSON.parse(fs.readFileSync('serviceAccountKey.json', 'utf8'));
  console.log("✅ Service account chargé");

  // Vérifier que admin.credential existe
  console.log("🔵 admin.credential:", typeof admin.credential);
  
  if (admin.credential) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://sunushop-prod-default-rtdb.firebaseio.com"
    });
    console.log("✅ Firebase initialisé avec succès !");
  } else {
    console.error("❌ admin.credential est undefined");
  }
} catch (error) {
  console.error("❌ Erreur:", error.message);
}
