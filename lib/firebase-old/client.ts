// lib/firebase/client.ts
// Version mockée pour éviter les erreurs de build

export const auth = {
  currentUser: null,
  signInWithEmailAndPassword: async () => { throw new Error("Firebase désactivé"); },
  createUserWithEmailAndPassword: async () => { throw new Error("Firebase désactivé"); },
  signOut: async () => {},
  sendSignInLinkToEmail: async () => {},
  isSignInWithEmailLink: () => false,
  signInWithEmailLink: async () => {},
};

export const db = {
  collection: () => ({
    doc: () => ({
      get: async () => ({ exists: false, data: () => ({}) }),
      set: async () => {},
    }),
  }),
  doc: () => ({
    get: async () => ({ exists: false, data: () => ({}) }),
    set: async () => {},
  }),
};

export default { auth, db };
