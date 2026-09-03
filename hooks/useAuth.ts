// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier que auth est bien initialisé
    if (!auth) {
      console.warn('⚠️ Firebase Auth non initialisé');
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });
      return () => {
        if (unsubscribe) unsubscribe();
      };
    } catch (error) {
      console.error('❌ Erreur onAuthStateChanged:', error);
      setLoading(false);
      return;
    }
  }, []);

  return { user, loading };
}
