'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { auth } from '@/lib/firebase/client';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { Package, LogOut } from 'lucide-react';

export default function LivreurLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      const checkRole = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.role === 'livreur') {
              setRole('livreur');
            } else {
              router.push('/');
            }
          } else {
            router.push('/');
          }
        } catch (err) {
          console.error(err);
          router.push('/');
        } finally {
          setCheckingRole(false);
        }
      };
      checkRole();
    } else {
      setCheckingRole(false);
    }
  }, [user, loading, router]);

  if (loading || checkingRole) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  if (!user || role !== 'livreur') {
    return null;
  }

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold text-green-600">SunuShop</h1>
          <p className="text-sm text-gray-500">Espace livreur</p>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/livreur/dashboard" className="flex items-center gap-3 px-4 py-2 rounded-lg bg-green-50 text-green-600">
            <Package size={18} /> Commandes
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 w-full mt-10"
          >
            <LogOut size={18} /> Déconnexion
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
