import React from 'react';
import { Phone } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function FestiveBanner() {
  const { settings } = useStore();

  const marqueeText = settings.announcement ||
    '🪔 शुभ दीपावली महोत्सव २०२६ | समर्थ कलेक्शन, आडगाव  रेपाळ (पप्पू  बागूल - ९२६०४३९१४३) | साड्या, मुले व पुरुष कपड्यांचा खास संग्रह | व्हॉट्सअॅपवर थेट ऑर्डर करा 🪔';

  return (
    <div className="bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 text-amber-50 py-2 shadow-md border-b border-amber-400/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center gap-4 px-4">

        {/* Fixed left label */}
        <div className="hidden md:flex items-center gap-2 text-amber-100 font-semibold font-baloo text-xs flex-shrink-0 bg-amber-900/30 px-3 py-1 rounded-full border border-amber-300/30">
          <span className="diya-flame text-sm">🪔</span>
          <span>समर्थ कलेक्शन • आडगाव  रेपाळ</span>
        </div>

        {/* Marquee */}
        <div className="marquee-wrap flex-1 py-0.5">
          <div className="marquee-track font-baloo text-xs sm:text-sm font-semibold text-amber-50">
            <span className="px-8">{marqueeText}</span>
            <span className="px-8">{marqueeText}</span>
            <span className="px-8">{marqueeText}</span>
          </div>
        </div>

        {/* Fixed right phone */}
        <a
          href={`https://wa.me/${(settings.whatsappNumber || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('नमस्कार! समर्थ कलेक्शन, आडगाव  रेपाळ (पप्पू  बागूल) - दिवाळी कपड्यांबद्दल माहिती हवी आहे.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:flex items-center gap-1.5 flex-shrink-0 font-baloo text-xs hover:text-white transition font-semibold bg-black/20 px-2.5 py-1 rounded-md"
        >
          <Phone className="w-3.5 h-3.5 text-green-300" />
          <span>पप्पू  बागूल: ९२६०४३९१४३</span>
        </a>
      </div>
    </div>
  );
}
