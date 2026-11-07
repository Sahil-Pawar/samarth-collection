import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Truck, MessageCircle, Flame } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function DiwaliHero() {
  const { setActiveCategory, settings, triggerFestiveCelebration, scrollToProducts } = useStore();

  const handleCategory = (catId) => {
    setActiveCategory(catId);
    if (scrollToProducts) scrollToProducts();
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#1C142A] via-[#150F21] to-[#0D0B12] pt-6 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-amber-950/60">

      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Festive Store Badge with custom font-kalam */}
        <div className="flex justify-center mb-5">
          <div
            onClick={triggerFestiveCelebration}
            className="inline-flex items-center gap-2.5 px-6 py-2 rounded-full bg-gradient-to-r from-amber-950/90 via-amber-900/60 to-amber-950/90 border border-amber-500/50 shadow-xl shadow-amber-950/60 cursor-pointer hover:scale-105 transition"
          >
            <span className="diya-flame text-xl">🪔</span>
            <span className="font-kalam text-xl sm:text-2xl text-amber-200 tracking-wider font-bold drop-shadow">
              शुभ दीपावली महोत्सव २०२६
            </span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
        </div>

        {/* Store Name Hero (Rozha One luxury font) */}
        <div className="text-center max-w-4xl mx-auto mb-3">
          <h1 className="font-rozha text-5xl sm:text-7xl md:text-8xl font-normal rangoli-gold-text leading-tight mb-2 drop-shadow-2xl tracking-wide">
            समर्थ कलेक्शन
          </h1>
          <div className="font-tiro text-sm sm:text-base text-amber-300 tracking-widest mb-3 flex items-center justify-center gap-2 flex-wrap">
            <span>आडगाव  रेपाळ</span>
            <span className="text-amber-500">•</span>
            <span className="text-amber-200 font-baloo font-bold">पप्पू  बागूल (९२६०४३९१४३)</span>
          </div>
          <p className="font-baloo text-sm sm:text-base md:text-lg text-amber-200/75 leading-relaxed max-w-2xl mx-auto">
            दिवाळीच्या आनंदात परिधान करा आमचे निवडक शाही साड्या, मुले-मुलींचे उत्सवी कपडे आणि पुरुषांचे फेस्टिव्ह शर्ट व कुर्ते.
          </p>
        </div>

        {/* Modern Category Cards with High-Definition Photo Icons from Google/Unsplash */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mb-8 mt-8">

          {/* 1. शाही साड्या */}
          <div
            onClick={() => handleCategory('sarees')}
            className="group cursor-pointer bg-gradient-to-b from-[#241A38]/90 to-[#191129]/90 hover:from-[#31234E] hover:to-[#221638] p-4 sm:p-5 rounded-2xl border border-amber-500/25 hover:border-amber-400/70 transition-all duration-300 shadow-lg hover:shadow-amber-500/20 hover:-translate-y-1.5 text-center card-glow-hover"
          >
            {/* Real HD Photo Avatar Icon */}
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 mx-auto mb-3 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-md group-hover:scale-108 transition-transform duration-300">
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=240&h=240&q=85"
                alt="शाही साड्या"
                className="w-full h-full object-cover object-top rounded-full"
                loading="lazy"
              />
            </div>
            <h2 className="font-tiro font-bold text-sm sm:text-base text-amber-100 group-hover:text-amber-300 leading-snug">
              शाही साड्या
            </h2>
            <p className="font-baloo text-[11px] text-amber-400/70 mt-0.5">बनारसी व रेशीम</p>
            <span className="font-baloo inline-block mt-2.5 text-[10px] bg-amber-950/80 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30 font-semibold group-hover:border-amber-400">
              खास डिझाइन
            </span>
          </div>

          {/* 2. मुलांचे कपडे */}
          <div
            onClick={() => handleCategory('kids')}
            className="group cursor-pointer bg-gradient-to-b from-[#241A38]/90 to-[#191129]/90 hover:from-[#31234E] hover:to-[#221638] p-4 sm:p-5 rounded-2xl border border-blue-500/25 hover:border-blue-400/70 transition-all duration-300 shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1.5 text-center card-glow-hover"
          >
            {/* Real HD Photo Avatar Icon */}
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 mx-auto mb-3 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-blue-500 to-indigo-300 shadow-md group-hover:scale-108 transition-transform duration-300">
              <img
                src="https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=240&h=240&q=85"
                alt="मुलांचे कपडे"
                className="w-full h-full object-cover object-top rounded-full"
                loading="lazy"
              />
            </div>
            <h2 className="font-tiro font-bold text-sm sm:text-base text-amber-100 group-hover:text-blue-300 leading-snug">
              मुलांचे कपडे
            </h2>
            <p className="font-baloo text-[11px] text-amber-400/70 mt-0.5">शर्ट, पँट व कुर्ते</p>
            <span className="font-baloo inline-block mt-2.5 text-[10px] bg-blue-950/80 text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-500/30 font-semibold group-hover:border-blue-400">
              नवीन व्हरायटी
            </span>
          </div>

          {/* 3. मुलींचे कपडे */}
          <div
            onClick={() => handleCategory('kids')}
            className="group cursor-pointer bg-gradient-to-b from-[#241A38]/90 to-[#191129]/90 hover:from-[#31234E] hover:to-[#221638] p-4 sm:p-5 rounded-2xl border border-rose-500/25 hover:border-rose-400/70 transition-all duration-300 shadow-lg hover:shadow-rose-500/20 hover:-translate-y-1.5 text-center card-glow-hover"
          >
            {/* Real HD Photo Avatar Icon */}
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 mx-auto mb-3 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-rose-500 to-pink-300 shadow-md group-hover:scale-108 transition-transform duration-300">
              <img
                src="https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=240&h=240&q=85"
                alt="मुलींचे कपडे"
                className="w-full h-full object-cover object-top rounded-full"
                loading="lazy"
              />
            </div>
            <h2 className="font-tiro font-bold text-sm sm:text-base text-amber-100 group-hover:text-pink-300 leading-snug">
              मुलींचे कपडे
            </h2>
            <p className="font-baloo text-[11px] text-amber-400/70 mt-0.5">लेहेंगा व फ्रॉक</p>
            <span className="font-baloo inline-block mt-2.5 text-[10px] bg-rose-950/80 text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-500/30 font-semibold group-hover:border-rose-400">
              दिवाळी स्पेशल
            </span>
          </div>

          {/* 4. पुरुष शर्ट व कुर्ते */}
          <div
            onClick={() => handleCategory('men')}
            className="group cursor-pointer bg-gradient-to-b from-[#241A38]/90 to-[#191129]/90 hover:from-[#31234E] hover:to-[#221638] p-4 sm:p-5 rounded-2xl border border-emerald-500/25 hover:border-emerald-400/70 transition-all duration-300 shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-1.5 text-center card-glow-hover"
          >
            {/* Real HD Photo Avatar Icon */}
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 mx-auto mb-3 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-emerald-500 to-teal-300 shadow-md group-hover:scale-108 transition-transform duration-300">
              <img
                src="https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=240&h=240&q=85"
                alt="पुरुष शर्ट व कुर्ते"
                className="w-full h-full object-cover object-top rounded-full"
                loading="lazy"
              />
            </div>
            <h2 className="font-tiro font-bold text-sm sm:text-base text-amber-100 group-hover:text-emerald-300 leading-snug">
              पुरुष शर्ट व कुर्ते
            </h2>
            <p className="font-baloo text-[11px] text-amber-400/70 mt-0.5">कुर्ते व फॉर्मल</p>
            <span className="font-baloo inline-block mt-2.5 text-[10px] bg-emerald-950/80 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-semibold group-hover:border-emerald-400">
              ट्रेंडिंग
            </span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => handleCategory('diwali')}
            className="font-baloo bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 hover:from-amber-500 hover:to-yellow-400 text-stone-950 font-bold px-6 py-3 rounded-full text-sm sm:text-base shadow-lg shadow-amber-500/20 transition hover:scale-105 flex items-center gap-2 border border-amber-300/40"
          >
            <Flame className="w-4 h-4 text-red-900 fill-red-900" />
            <span>दिवाळी स्पेशल कपडे पहा</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href={`https://wa.me/${(settings.whatsappNumber || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('नमस्कार! समर्थ कलेक्शन, आडगाव  रेपाळ (पप्पू  बागूल) - दिवाळी कपड्यांचा कॅटलॉग व्हॉट्सअॅपवर पाठवा.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-baloo bg-[#231A33] hover:bg-[#2F2345] text-emerald-400 font-semibold px-5 py-3 rounded-full text-sm sm:text-base border border-emerald-500/40 hover:border-emerald-400 transition flex items-center gap-2 shadow"
          >
            <MessageCircle className="w-4 h-4" />
            <span>व्हॉट्सअॅपवर संपर्क करा</span>
          </a>
        </div>

        {/* Modern Trust Badges */}
        <div className="mt-10 pt-6 border-t border-amber-950/40 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="font-baloo flex items-center justify-center gap-2 text-amber-200/80 text-xs sm:text-sm">
            <span className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <Sparkles className="w-4 h-4" />
            </span>
            <span>उत्कृष्ट दर्जाचे कापड</span>
          </div>
          <div className="font-baloo flex items-center justify-center gap-2 text-amber-200/80 text-xs sm:text-sm">
            <span className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <Truck className="w-4 h-4" />
            </span>
            <span>जलद डिलिव्हरी</span>
          </div>
          <div className="font-baloo flex items-center justify-center gap-2 text-amber-200/80 text-xs sm:text-sm">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <MessageCircle className="w-4 h-4" />
            </span>
            <span>पप्पू  बागूल: ९२६०४३९१४३</span>
          </div>
          <div className="font-baloo flex items-center justify-center gap-2 text-amber-200/80 text-xs sm:text-sm">
            <span className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span>थेट फोटो ऑर्डर</span>
          </div>
        </div>

      </div>
    </section>
  );
}
