"use client";

import { useState, useRef } from "react";

export default function WhatsAppPage() {
  const [number, setNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);
  const [status, setStatus] = useState<string>('...');
  const [mediaType, setMediaType] = useState<'text' | 'image' | 'pdf' | 'audio'>('text');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const checkStatus = async () => {
    try {
      const res = await fetch('/api/whatsapp/status');
      const data = await res.json();
      setStatus(data.status || 'inconnu');
    } catch (error) {
      setStatus('erreur');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      let url = '/api/whatsapp/send';
      let body: any = { to: number };

      if (mediaType === 'text') {
        body.message = message;
      } else if (selectedFile) {
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(selectedFile);
        });
        
        body = {
          to: number,
          mediaType: mediaType,
          media: base64,
          caption: message || undefined,
        };
        url = '/api/whatsapp/send-media';
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        setResult({ success: true, message: '✅ Message envoyé avec succès !' });
        setMessage('');
        setSelectedFile(null);
        setFileName('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setResult({ success: false, error: data.error || 'Erreur lors de l\'envoi' });
      }
    } catch (error) {
      setResult({ success: false, error: 'Erreur réseau' });
    } finally {
      setLoading(false);
    }
  };

  const mediaIcons = {
    text: '📝',
    image: '🖼️',
    pdf: '📄',
    audio: '🎵',
  };

  const mediaLabels = {
    text: 'Texte',
    image: 'Image',
    pdf: 'PDF',
    audio: 'Audio',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header avec animation */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block bg-green-100 p-4 rounded-full mb-4 animate-float">
            <span className="text-4xl">💬</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold gradient-text">WhatsApp SunuShop</h1>
          <p className="text-gray-600 mt-2">Envoyez des messages et des médias instantanément</p>
        </div>

        {/* Statut */}
        <div className="card p-4 mb-6 animate-slide-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${status === 'open' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-gray-600">Statut WhatsApp</span>
            </div>
            <span className={`font-medium ${status === 'open' ? 'text-green-600' : 'text-red-600'}`}>
              {status === 'open' ? '✅ Connecté' : '❌ Déconnecté'}
            </span>
            <button
              onClick={checkStatus}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              🔄 Rafraîchir
            </button>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={sendMessage} className="card p-6 animate-slide-in" style={{ animationDelay: '0.2s' }}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              📱 Numéro WhatsApp
            </label>
            <input
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="221771234567"
              required
              className="input-modern"
            />
            <p className="text-sm text-gray-500 mt-1">Exemple : 221771234567 (Sénégal)</p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Type de contenu</label>
            <div className="flex gap-2 flex-wrap">
              {(Object.keys(mediaLabels) as Array<keyof typeof mediaLabels>).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMediaType(type)}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    mediaType === type
                      ? 'bg-green-600 text-white shadow-lg shadow-green-200 scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {mediaIcons[type]} {mediaLabels[type]}
                </button>
              ))}
            </div>
          </div>

          {mediaType !== 'text' && (
            <div className="mb-4 animate-fade-in">
              <label className="block text-gray-700 font-medium mb-2">
                📎 Sélectionner un fichier
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept={
                  mediaType === 'image' ? 'image/*' :
                  mediaType === 'pdf' ? '.pdf' :
                  'audio/*'
                }
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-400 transition cursor-pointer"
                required
              />
              {fileName && (
                <p className="text-sm text-green-600 mt-2 animate-fade-in">
                  ✅ {fileName}
                </p>
              )}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              {mediaType === 'text' ? '✏️ Message' : '📝 Légende (optionnel)'}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={mediaType === 'text' ? 'Écrivez votre message ici...' : 'Ajoutez une légende...'}
              rows={4}
              className="input-modern resize-none"
              required={mediaType === 'text'}
            />
          </div>

          <button
            type="submit"
            disabled={loading || status !== 'open'}
            className={`w-full py-3 rounded-xl text-white font-semibold transition-all ${
              loading || status !== 'open'
                ? 'bg-gray-300 cursor-not-allowed'
                : 'btn-primary'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Envoi en cours...
              </span>
            ) : (
              '📤 Envoyer'
            )}
          </button>

          {result && (
            <div className={`mt-4 p-4 rounded-xl animate-fade-in ${
              result.success ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {result.success ? '🎉 ' + result.message : '❌ ' + result.error}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>💡 Astuce : Utilisez l'indicatif du pays (221 pour le Sénégal)</p>
          <p className="mt-1">
            <a href="/dashboard" className="text-green-600 hover:underline transition">📊 Dashboard</a>
            {' • '}
            <a href="/chat" className="text-green-600 hover:underline transition">💬 Chat</a>
          </p>
        </div>
      </div>
    </div>
  );
}
