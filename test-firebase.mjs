// test-firebase.mjs
import admin from 'firebase-admin';
import fs from 'fs';

const serviceAccount = JSON.parse(fs.readFileSync('serviceAccountKey.json', 'utf8'));

console.log("🔵 Initialisation de Firebase...");
console.log("🔵 Project ID:", serviceAccount.project_id);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sunushop-prod-default-rtdb.firebaseio.com"
});

console.log("✅ Firebase initialized");

const db = admin.firestore();
console.log("✅ Firestore ready");

// Tester une opération simple
async function test() {
  try {
    const docRef = db.collection('test').doc('test');
    await docRef.set({ test: 'Hello Firebase!' });
    console.log("✅ Écriture réussie dans Firestore");
    
    const doc = await docRef.get();
    console.log("✅ Lecture réussie:", doc.data());
    
    await docRef.delete();
    console.log("✅ Nettoyage réussi");
  } catch (error) {
    console.error("❌ Erreur:", error.message);
  }
}

test();
