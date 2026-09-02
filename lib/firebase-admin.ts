import "server-only";
import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let db: Firestore | null = null;

function init() {
  if (getApps().length) {
    return getFirestore(getApps()[0]!);
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL ou FIREBASE_PRIVATE_KEY manquant"
    );
  }

  privateKey = privateKey.replace(/\\n/g, "\n");

  const app = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });

  return getFirestore(app);
}

export function getDb(): Firestore {
  if (!db) db = init();
  return db;
}
