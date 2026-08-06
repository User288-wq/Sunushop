import YangoDeliveryWidget from '@/components/YangoDeliveryWidget';

export default function ConfirmationPage() {
  const clid = process.env.NEXT_PUBLIC_YANGO_CLID || '';
  const apiKey = process.env.NEXT_PUBLIC_YANGO_API_KEY || '';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">
          ✅ Commande confirmée
        </h1>

        <YangoDeliveryWidget
          clid={clid}
          apiKey={apiKey}
          depotLat={14.716677}   // Latitude de ton dépôt
          depotLng={-17.467686}  // Longitude de ton dépôt
          useLocation={true}
          title="Je fais livrer ma commande"
        />

        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <p className="text-sm text-gray-600">
            Numéro de commande : <span className="font-mono">#SUN-001</span>
          </p>
          <p className="text-sm text-gray-600">
            Montant total : <span className="font-bold">5 000 FCFA</span>
          </p>
        </div>
      </div>
    </div>
  );
}
