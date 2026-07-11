'use client';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import dynamicImport from 'next/dynamic';
import { Suspense } from 'react';

const CommandeList = dynamicImport(
  () => import('./CommandeList'),
  { ssr: false, loading: () => <div>Chargement...</div> }
);

export default function MesCommandesPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <CommandeList />
    </Suspense>
  );
}
