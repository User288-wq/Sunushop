import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Importer Firebase dynamiquement seulement côté client
    const initAuth = async () => {
      try {
        const { getFirebaseClient } = await import('@/lib/firebase/client-safe');
        const { auth } = await getFirebaseClient();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user);
          setLoading(false);
        });
        return unsubscribe;
      } catch (err) {
        console.error('Erreur initialisation auth:', err);
        setLoading(false);
        return () => {};
      }
    };

    let cleanup: (() => void) | undefined;

    initAuth().then((unsubscribe) => {
      if (unsubscribe) {
        cleanup = unsubscribe;
      }
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return { user, loading };
}
