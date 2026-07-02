'use client';
import { useState, useEffect } from 'react';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import Link from 'next/link';

export default function MagicLinkPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionCodeSettings, setActionCodeSettings] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setActionCodeSettings({
        url: `${window.location.origin}/auth-callback`,
        handleCodeInApp: true,
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionCodeSettings) {
      setError('Veuillez réessayer');
      return;
    }
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      setMessage(` Lien envoyé à ${email}. Vérifiez vos emails.`);
      setEmail('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erreur lors de l\'envoi du lien');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Connexion sans mot de passe</h1>
      {message && <div className="bg-green-100 text-green-700 p-2 rounded mb-4">{message}</div>}
      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Votre email"
          className="w-full border rounded-lg px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50">
          {loading ? 'Envoi en cours...' : '📧 Recevoir le lien magique'}
        </button>
      </form>
      <p className="text-center mt-4">
        <Link href="/login" className="text-green-600">← Retour à la connexion classique</Link>
      </p>
    </div>
  );
}
