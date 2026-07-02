'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/vendeur/dashboard');
    } catch (err: any) {
      console.error(err);
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-center mb-6">Connexion</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" required className="w-full border p-2 rounded" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Mot de passe" required className="w-full border p-2 rounded" value={password} onChange={e => setPassword(e.target.value)} />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white p-2 rounded">{loading ? 'Connexion...' : 'Se connecter'}</button>
        </form>
        <p className="text-center mt-4"><Link href="/register" className="text-green-600">Pas de compte ? Inscription</Link></p>
      </div>
    </div>
  );
}
