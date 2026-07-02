'use client';
import { useEffect, useState } from 'react';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState('Vérification en cours...');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleSignIn = async () => {
      if (typeof window === 'undefined') return;
      
      try {
        if (isSignInWithEmailLink(auth, window.location.href)) {
          let email = window.localStorage.getItem('emailForSignIn');
          if (!email) {
            email = window.prompt('Veuillez fournir votre email pour confirmation');
          }
          if (!email) {
            setError('Email requis pour la connexion');
            return;
          }
          await signInWithEmailLink(auth, email, window.location.href);
          window.localStorage.removeItem('emailForSignIn');
          setStatus(' Connexion réussie, redirection...');
          setTimeout(() => router.push('/'), 2000);
        } else {
          setError('Lien invalide ou expiré');
        }
      } catch (err: any) {
        console.error(err);
        setError(`Erreur : ${err.message}`);
        setStatus('');
      }
    };
    
    handleSignIn();
  }, [router]);

  if (error) {
    return <div className="text-center py-20 text-red-600">{error}</div>;
  }

  return <div className="text-center py-20">{status}</div>;
}
