'use client';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [nom, setNom] = useState('');
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
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCred.user.uid), { uid: userCred.user.uid, email, nom, role: 'client', createdAt: new Date() });
      router.push('/vendeur/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') setError('Email déjà utilisé');
      else if (err.code === 'auth/weak-password') setError('Mot de passe trop faible (min 6 caractères)');
      else setError('Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-center mb-6">Inscription</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Nom complet" required className="w-full border p-2 rounded" value={nom} onChange={e => setNom(e.target.value)} />
          <input type="email" placeholder="Email" required className="w-full border p-2 rounded" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Mot de passe (min 6 caractères)" required className="w-full border p-2 rounded" value={password} onChange={e => setPassword(e.target.value)} />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white p-2 rounded">{loading ? 'Inscription...' : "S'inscrire"}</button>
        </form>
        <p className="text-center mt-4"><Link href="/login" className="text-green-600">Déjà un compte ? Connexion</Link></p>
      </div>
    </div>
  );
}
