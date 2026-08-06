import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function initAdmin(): App {
  if (getApps().length) return getApps()[0]!;

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (raw) {
    const sa = JSON.parse(raw);
    return initializeApp({
      credential: cert(sa),
      projectId: sa.project_id || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (projectId && clientEmail && privateKey) {
    return initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      projectId,
    });
  }

  return initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "sunushop-prod",
  });
}

export function adminDb() {
  initAdmin();
  return getFirestore();
}
