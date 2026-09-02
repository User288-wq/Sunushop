// lib/firebase-admin.ts
// ⚠️ CE FICHIER NE DOIT JAMAIS ÊTRE IMPORTÉ CÔTÉ CLIENT
// Utilisez 'use server' ou importez-le uniquement dans les API routes

export const db = null;

// Indiquer que c'est un module serveur
export const __SERVER_ONLY = true;

console.log("🔴 Firebase Admin: mode serveur");
