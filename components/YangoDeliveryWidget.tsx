'use client';

import { useEffect, useRef } from 'react';

interface YangoDeliveryWidgetProps {
  depotLat?: number;
  depotLng?: number;
  size?: 'xs' | 's';
  theme?: 'normal' | 'dark';
  title?: string;
  useLocation?: boolean;
  clid: string;
  apiKey: string;
  lang?: 'fr' | 'en';
}

export default function YangoDeliveryWidget({
  depotLat = 14.716677,
  depotLng = -17.467686,
  size = 's',
  theme = 'normal',
  title = 'Commander une livraison',
  useLocation = true,
  clid,
  apiKey,
  lang = 'fr',
}: YangoDeliveryWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!scriptLoaded.current) {
      const script = document.createElement('script');
      script.src = '//yastatic.net/taxi-widget/ya-taxi-widget.js';
      script.async = true;
      document.body.appendChild(script);
      scriptLoaded.current = true;
    }

    if (containerRef.current && (window as any).YaTaxiWidget) {
      (window as any).YaTaxiWidget.rebuildWidgets();
    }
  }, []);

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-xl shadow-md">
      <div className="mb-3 text-center">
        <h3 className="text-lg font-semibold text-gray-800">🚚 Livraison</h3>
        <p className="text-sm text-gray-500">Choisissez votre mode de livraison</p>
      </div>

      <div
        ref={containerRef}
        className="ya-taxi-widget"
        data-ref="sunushop"
        data-size={size}
        data-theme={theme}
        data-title={title}
        data-use-location={useLocation ? 'true' : 'false'}
        data-point-b={`${depotLat},${depotLng}`}
        data-clid={clid}
        data-apikey={apiKey}
        data-lang={lang}
      ></div>

      <p className="mt-2 text-xs text-center text-gray-400">
        ⚡ Livraison par Yango Delivery
      </p>
    </div>
  );
}
