// scripts/set-admin.ts
import * as admin from 'firebase-admin';

// On réutilise la même logique que ton lib/firebase-admin.ts
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (!serviceAccountJson) {
  console.error('❌ FIREBASE_SERVICE_ACCOUNT_JSON manquant');
  process.exit(1);
}

const serviceAccount = JSON.parse(serviceAccountJson);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

async function setAdmin(uid: string) {
  try {
    // On récupère les claims existants pour ne pas les écraser
    const user = await admin.auth().getUser(uid);
    const currentClaims = user.customClaims || {};

    await admin.auth().setCustomUserClaims(uid, {
      ...currentClaims,
      admin: true,          // ← le claim important
    });

    console.log(`✅ Admin claim ajouté avec succès pour l'utilisateur : ${uid}`);
    console.log('Claims actuels :', { ...currentClaims, admin: true });
  } catch (error: any) {
    console.error('❌ Erreur :', error.message);
  } finally {
    process.exit(0);
  }
}

// ======================
// ⬇️  CHANGE ICI  ⬇️
// ======================
const USER_UID = 'COLLE_ICI_LE_UID_DE_TON_UTILISATEUR';

setAdmin(USER_UID);
