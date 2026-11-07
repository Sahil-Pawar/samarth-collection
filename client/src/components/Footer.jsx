import React from 'react';
import { MessageCircle, Truck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function Footer() {
  const { settings, setActiveCategory, setIsAdminOpen, triggerFestiveCelebration, scrollToProducts } = useStore();
  const navigate = useNavigate();

  const handleCategoryNav = (cat) => {
    setActiveCategory(cat);
    navigate('/');
    if (scrollToProducts) scrollToProducts();
  };

  return (
    <footer className="bg-[#0E0B16] text-amber-100/80 border-t border-amber-950/70 pt-12 pb-24 md:pb-12 px-4 sm:px-6 lg:px-8 mt-12 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">

        {/* Festive Greeting Banner */}
        <div
          onClick={triggerFestiveCelebration}
          className="bg-gradient-to-r from-amber-950/60 via-[#271E3B] to-amber-950/60 rounded-3xl p-6 sm:p-8 border border-amber-500/30 text-center cursor-pointer hover:border-amber-400/60 transition group"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-2xl diya-flame">🪔</span>
            <h2 className="font-rozha text-2xl sm:text-3xl rangoli-gold-text">
              शुभ दीपावली - समर्थ कलेक्शन
            </h2>
            <span className="text-2xl diya-flame">🪔</span>
          </div>
          <p className="font-tiro text-sm text-amber-300/90 mb-1">
            आडगाव  रेपाळ • प्रो. पप्पू  बागूल (९२६०४३९१४३)
          </p>
          <p className="font-baloo text-xs sm:text-sm text-amber-200/70 max-w-xl mx-auto leading-relaxed">
            दीपावलीच्या प्रकाशमय सणाच्या मनःपूर्वक शुभेच्छा! आपल्या उत्सवी वस्त्र खरेदीसाठी समर्थ कलेक्शन, आडगाव  रेपाळ सदैव आपल्या सेवेत आहे.
          </p>
          <div className="font-baloo mt-3 inline-flex items-center gap-1.5 text-xs text-amber-400 group-hover:text-amber-200 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>सणाचा आनंद साजरा करा ✨</span>
          </div>
        </div>

        {/* 4 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-xs sm:text-sm">

          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl diya-flame">🪔</span>
              <div>
                <div className="font-rozha text-xl sm:text-2xl rangoli-gold-text">समर्थ कलेक्शन</div>
                <div className="font-baloo text-[11px] text-amber-400/90 font-semibold">आडगाव  रेपाळ</div>
              </div>
            </div>
            <p className="font-baloo text-xs text-amber-300/80 leading-relaxed">
              प्रो. पप्पू  बागूल (मोबाईल: ९२६०४३९१४३)<br/>
              आडगाव  रेपाळचा विश्वासू वस्त्र व्यापार. उत्कृष्ट साड्या, मुलांचे शर्ट-पँट व पुरुषांचे फेस्टिव्ह कुर्ते-शर्ट.
            </p>
            <p className="font-baloo text-[11px] text-amber-400/70">
              📍 {settings.address || 'समर्थ कलेक्शन, मुख्य बाजार, आडगाव  रेपाळ, महाराष्ट्र'}
            </p>
          </div>

          {/* Collections */}
          <div className="space-y-3">
            <h4 className="font-tiro font-bold text-amber-50 text-sm">संग्रह</h4>
            <ul className="space-y-2 text-xs text-amber-200/70 font-baloo">
              <li><button onClick={() => handleCategoryNav('sarees')} className="hover:text-amber-300 transition">• शाही साड्या (बनारसी, कांजीवरम, ऑर्गेंझा)</button></li>
              <li><button onClick={() => handleCategoryNav('kids')} className="hover:text-amber-300 transition">• मुलांचे कुर्ते, शर्ट व पँट</button></li>
              <li><button onClick={() => handleCategoryNav('kids')} className="hover:text-amber-300 transition">• मुलींचे लेहेंगा व फ्रॉक</button></li>
              <li><button onClick={() => handleCategoryNav('men')} className="hover:text-amber-300 transition">• पुरुष फेस्टिव्ह कुर्ते व शर्ट</button></li>
              <li><button onClick={() => handleCategoryNav('diwali')} className="hover:text-amber-300 transition font-semibold text-amber-400">• दिवाळी स्पेशल संग्रह</button></li>
            </ul>
          </div>

          {/* WhatsApp Order */}
          <div className="space-y-3">
            <h4 className="font-tiro font-bold text-amber-50 text-sm">थेट ऑर्डर व संपर्क</h4>
            <p className="font-baloo text-xs text-amber-300/70 leading-relaxed">
              कोणताही पोशाख आवडल्यास "व्हॉट्सअॅप ऑर्डर" बटण दाबून थेट पप्पू  बागूल यांच्याशी संपर्क साधा.
            </p>
            <a
              href={`https://wa.me/${(settings.whatsappNumber || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('नमस्कार! समर्थ कलेक्शन, आडगाव  रेपाळ (पप्पू  बागूल) - कपड्यांबद्दल माहिती हवी आहे.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-baloo inline-flex items-center gap-2 bg-emerald-600/90 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-xl text-xs shadow transition"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>पप्पू  बागूल: ९२६०४३९१४३</span>
            </a>
          </div>

          {/* Store Hours & Service */}
          <div className="space-y-3">
            <h4 className="font-tiro font-bold text-amber-50 text-sm">दुकानाची वेळ व सेवा</h4>
            <p className="font-baloo text-xs text-amber-300/80 leading-relaxed">
              सकाळी ९:०० ते रात्री ९:०० (दिवाळी सणात दररोज उघडे)<br/>
              सर्व प्रकारच्या उत्सवी व पारंपरिक कपड्यांचा समृद्ध संग्रह.
            </p>
            <div className="font-baloo flex items-center gap-2 text-xs text-amber-300/80">
              <Truck className="w-4 h-4 text-amber-400" />
              <span>होम डिलिव्हरी व कुरिअर सेवा उपलब्ध</span>
            </div>
            <div className="font-baloo text-xs text-amber-400/90 font-semibold bg-black/25 p-2 rounded-xl border border-amber-950">
              📍 समर्थ कलेक्शन, मुख्य बाजार, आडगाव  रेपाळ
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-amber-950/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-amber-400/50">
          <p className="font-baloo flex items-center gap-2">
            <span>© २०२६ समर्थ कलेक्शन, आडगाव  रेपाळ • प्रो. पप्पू  बागूल (९२६०४३९१४३). सर्व हक्क राखीव.</span>
            {/* Subtle owner login link for Pappu Bagul */}
            <button
              onClick={() => navigate('/admin')}
              className="text-amber-500/20 hover:text-amber-400/80 text-xs transition p-0.5"
              title="मालक पोर्टल"
            >
              🔒
            </button>
          </p>
          <div className="font-baloo flex items-center gap-4">
            <span>जलद डिस्पॅच</span>
            <span>•</span>
            <span>मोबाईल फर्स्ट बुटीक</span>
            <span>•</span>
            <span className="text-amber-300">शुभ लाभ 🪔</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
