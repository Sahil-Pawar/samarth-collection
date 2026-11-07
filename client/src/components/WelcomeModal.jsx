import React, { useEffect } from 'react';
import { X, Sparkles, MessageCircle, ArrowRight, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function WelcomeModal() {
  const { isWelcomeOpen, setIsWelcomeOpen, triggerFestiveCelebration, scrollToProducts, settings } = useStore();

  useEffect(() => {
    if (isWelcomeOpen) {
      // Trigger festive celebration confetti upon arrival
      const timer = setTimeout(() => {
        triggerFestiveCelebration();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isWelcomeOpen]);

  const isAdminPath = typeof window !== 'undefined' && 
    (window.location.pathname.includes('/admin') || window.location.pathname.includes('/owner'));

  if (!isWelcomeOpen || isAdminPath) return null;

  const handleClose = () => {
    setIsWelcomeOpen(false);
    try {
      sessionStorage.setItem('samarth_welcomed', 'true');
    } catch {}
  };

  const handleExplore = () => {
    handleClose();
    if (scrollToProducts) {
      scrollToProducts();
    }
  };

  const handleWhatsApp = () => {
    const phone = (settings.whatsappNumber || '+919260439143').replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent('नमस्कार! समर्थ कलेक्शन, आडगाव  रेपाळ (पप्पू  बागूल) - दिवाळी कपड्यांबद्दल माहिती हवी आहे.')}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={handleClose} />

      {/* Main Luxury Modal Card */}
      <div 
        className="relative w-full max-w-lg bg-gradient-to-b from-[#1C142B] via-[#160F24] to-[#0E0A17] rounded-3xl border border-amber-500/50 p-6 sm:p-8 text-center shadow-2xl shadow-amber-500/20 overflow-hidden z-10 transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Glows */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/80 text-amber-300 hover:text-white flex items-center justify-center transition border border-amber-900/60 z-20"
          aria-label="बंद करा"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Animated Diya Avatar with Glowing Halo */}
        <div className="relative mx-auto mb-4 w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 p-1 shadow-xl shadow-amber-500/30 diya-glow flex items-center justify-center animate-bounce-subtle">
          <div className="w-full h-full bg-[#181126] rounded-full flex items-center justify-center">
            <span className="text-4xl diya-flame">🪔</span>
          </div>
        </div>

        {/* Diwali Festival Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-kalam text-sm sm:text-base tracking-wider font-bold">शुभ दीपावली महोत्सव २०२६</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </div>

        {/* Welcome Headline in Trending Marathi Typography */}
        <div className="space-y-1 mb-4">
          <p className="font-tiro text-base sm:text-lg text-amber-200/90 font-medium tracking-wide">
            तुमचे सहर्ष स्वागत आहे!
          </p>
          <h2 className="font-rozha text-3xl sm:text-5xl font-normal rangoli-gold-text leading-tight drop-shadow-md tracking-wide">
            समर्थ कलेक्शन मध्ये
          </h2>
          <div className="font-baloo text-xs sm:text-sm text-amber-300 font-semibold flex items-center justify-center gap-2 mt-1">
            <span>आडगाव  रेपाळ</span>
            <span className="text-amber-500">•</span>
            <span>प्रो. पप्पू  बागूल (९२६०४३९१४३)</span>
          </div>
        </div>

        {/* Welcoming Description */}
        <p className="font-baloo text-xs sm:text-sm text-amber-200/75 leading-relaxed max-w-md mx-auto mb-5">
          दिवाळीच्या या मंगलमय पर्वात आपल्या संपूर्ण कुटुंबासाठी खास शाही साड्या, लहान मुलांचे उत्सवी कपडे आणि पुरुषांचे फेस्टिव्ह शर्ट-कुर्ते यांचा दर्जेदार संग्रह येथे उपलब्ध आहे.
        </p>

        {/* 3 Modern Category Highlights */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="bg-[#241A38]/80 border border-amber-900/60 p-2.5 rounded-2xl text-center">
            <span className="text-xl block mb-1">🥻</span>
            <h4 className="font-tiro text-xs font-bold text-amber-100">शाही साड्या</h4>
            <p className="font-baloo text-[10px] text-amber-400/70 mt-0.5">बनारसी व सिल्क</p>
          </div>
          <div className="bg-[#241A38]/80 border border-amber-900/60 p-2.5 rounded-2xl text-center">
            <span className="text-xl block mb-1">👦</span>
            <h4 className="font-tiro text-xs font-bold text-amber-100">मुलांचे कपडे</h4>
            <p className="font-baloo text-[10px] text-amber-400/70 mt-0.5">शर्ट, पँट व फ्रॉक</p>
          </div>
          <div className="bg-[#241A38]/80 border border-amber-900/60 p-2.5 rounded-2xl text-center">
            <span className="text-xl block mb-1">👔</span>
            <h4 className="font-tiro text-xs font-bold text-amber-100">पुरुष कपडे</h4>
            <p className="font-baloo text-[10px] text-amber-400/70 mt-0.5">कुर्ते व फेस्टिव्ह शर्ट</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={handleExplore}
            className="font-baloo w-full bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 hover:from-amber-500 hover:to-yellow-400 text-stone-950 font-extrabold py-3.5 px-6 rounded-2xl shadow-xl shadow-amber-950/60 transition-all duration-300 hover:scale-102 flex items-center justify-center gap-2 text-sm sm:text-base group"
          >
            <span>दिवाळी संग्रह पहा ✨</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleWhatsApp}
            className="font-baloo w-full bg-[#201831] hover:bg-[#2C2142] text-amber-200 hover:text-white font-semibold py-2.5 px-4 rounded-xl border border-amber-900/60 transition flex items-center justify-center gap-2 text-xs"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            <span>पप्पू  बागूल यांच्याशी व्हॉट्सअॅपवर बोला (९२६०४३९१४३)</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="font-baloo flex items-center justify-center gap-4 text-[10px] sm:text-[11px] text-amber-400/60 mt-4 pt-3 border-t border-amber-950/60">
          <span className="flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-400" />
            दर्जेदार कापड
          </span>
          <span className="flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-400" />
            आडगाव  रेपाळचा विश्वास
          </span>
          <span className="flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-400" />
            थेट ऑर्डर
          </span>
        </div>

      </div>

    </div>
  );
}
