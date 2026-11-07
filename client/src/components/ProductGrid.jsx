import React, { useState, useEffect } from 'react';
import { RefreshCw, Sparkles, ChevronDown, Check, UploadCloud, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from './ProductCard';

const INITIAL_BATCH_SIZE = 8;
const LOAD_MORE_STEP = 8;

export default function ProductGrid() {
  const {
    products, filteredProducts, activeCategory, searchQuery,
    setSearchQuery, setActiveCategory, setSubCategoryFilter, loading,
    settings, isAdminLoggedIn, setIsAdminOpen
  } = useStore();

  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH_SIZE);

  // Reset pagination whenever category, subcategory, or search changes
  useEffect(() => {
    setVisibleCount(INITIAL_BATCH_SIZE);
  }, [activeCategory, searchQuery]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + LOAD_MORE_STEP);
  };

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const getSectionTitle = () => {
    if (searchQuery)             return `"${searchQuery}" साठी निकाल`;
    if (activeCategory === 'diwali')  return 'दिवाळी महोत्सव विशेष संग्रह';
    if (activeCategory === 'sarees')  return 'शाही साड्या व रेशीम';
    if (activeCategory === 'kids')    return 'मुले-मुलींचे उत्सवी कपडे';
    if (activeCategory === 'men')     return 'पुरुष कुर्ते, शर्ट व पँट';
    return 'संपूर्ण उत्सवी संग्रह';
  };

  const getSectionSubtitle = () => {
    if (activeCategory === 'sarees') return 'बनारसी, कांजीवरम, ऑर्गेंझा व जॉर्जेट बंधाणी साड्यांचा निवडक संग्रह';
    if (activeCategory === 'kids')   return 'मुलांच्या कोमल त्वचेसाठी आरामदायी व रंगीत उत्सवी पोशाख';
    if (activeCategory === 'men')    return 'शाही कुर्ते, लिनन शर्ट व फेस्टिव्ह फॉर्मल पोशाख';
    if (activeCategory === 'diwali') return 'दिवाळीसाठी खास निवडलेले पारंपरिक व आधुनिक पोशाख';
    return 'संपूर्ण कुटुंबासाठी समर्थ कलेक्शन, आडगाव  रेपाळ (पप्पू  बागूल - ९२६०४३९१४३) चा निवडक वस्त्र संग्रह';
  };

  return (
    <section id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 scroll-mt-24">

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 sm:mb-8 border-b border-amber-950/60 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl diya-flame">🪔</span>
            <h2 className="font-tiro text-xl sm:text-2xl md:text-3xl font-bold text-amber-50">
              {getSectionTitle()}
            </h2>
          </div>
          <p className="font-baloo text-xs sm:text-sm text-amber-300/70">
            {getSectionSubtitle()}
          </p>
        </div>
        <div className="font-baloo text-xs text-amber-400/80 font-medium">
          {filteredProducts.length} उत्सवी पोशाख उपलब्ध
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-[#1A1428] rounded-2xl p-4 animate-pulse space-y-3">
              <div className="aspect-[3/4] bg-[#241C36] rounded-xl" />
              <div className="h-4 bg-[#241C36] rounded w-3/4" />
              <div className="h-4 bg-[#241C36] rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        /* Empty Catalog - Waiting for Client to Upload First Batch */
        <div className="bg-[#161224] rounded-3xl border border-amber-500/30 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-5 shadow-2xl">
          <div className="w-18 h-18 rounded-full bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-4xl mx-auto shadow-inner">
            🪔
          </div>
          <div>
            <h3 className="font-rozha text-2xl sm:text-3xl rangoli-gold-text">
              समर्थ कलेक्शन • आडगाव  रेपाळ
            </h3>
            <p className="font-tiro text-sm text-amber-300/90 mt-1">
              प्रो. पप्पू  बागूल (९२६०४३९१४३)
            </p>
            <p className="font-baloo text-xs sm:text-sm text-amber-200/80 leading-relaxed mt-3 max-w-md mx-auto">
              दिवाळी सणाचा नवीन व दर्जेदार वस्त्र संग्रह लवकरच येथे थेट उपलब्ध होत आहे! साड्या, मुलांचे कपडे व पुरुषांचे कुर्ते पाहण्यासाठी व ऑर्डर करण्यासाठी खालील बटणावरून थेट पप्पू  बागूल यांच्याशी संपर्क साधा.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={`https://wa.me/${(settings.whatsappNumber || '+919260439143').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('नमस्कार! समर्थ कलेक्शन, आडगाव  रेपाळ (पप्पू  बागूल) - दिवाळी कपड्यांबद्दल माहिती हवी आहे.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-baloo w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>पप्पू  बागूल यांना व्हॉट्सअॅप करा</span>
            </a>

            {isAdminLoggedIn && (
              <button
                onClick={() => setIsAdminOpen(true)}
                className="font-baloo w-full sm:w-auto bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition"
              >
                <UploadCloud className="w-4 h-4" />
                <span>गॅलरीतून फोटो अपलोड करा</span>
              </button>
            )}
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        /* Empty Filter Search State */
        <div className="bg-[#161224] rounded-3xl border border-amber-950/80 p-8 sm:p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-950/50 border border-amber-500/20 flex items-center justify-center text-3xl mx-auto">🪔</div>
          <h3 className="font-tiro text-lg font-bold text-amber-100">कोणताही पोशाख मिळाला नाही</h3>
          <p className="font-baloo text-xs sm:text-sm text-amber-300/60 leading-relaxed">
            तुमचा शोध किंवा फिल्टर बदला आणि पुन्हा प्रयत्न करा.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setActiveCategory('all'); setSubCategoryFilter('all'); }}
            className="font-baloo inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow hover:scale-105 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>सर्व फिल्टर रीसेट करा</span>
          </button>
        </div>
      ) : (
        <>
          {/* Products Grid (Paginated batch) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Explore More / Load More Section */}
          <div className="mt-10 pt-6 border-t border-amber-950/60 flex flex-col items-center justify-center gap-3">
            
            {/* Progress Count Bar */}
            <div className="text-center font-baloo text-xs text-amber-300/80">
              <span>{Math.min(visibleCount, filteredProducts.length)}</span> पैकी <span>{filteredProducts.length}</span> कपडे दाखवले आहेत
              <div className="w-48 h-1.5 bg-[#201833] rounded-full mx-auto mt-2 overflow-hidden border border-amber-900/40">
                <div
                  className="h-full bg-gradient-to-r from-amber-600 to-yellow-500 rounded-full transition-all duration-300"
                  style={{ width: `${(Math.min(visibleCount, filteredProducts.length) / filteredProducts.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Load More Button */}
            {hasMore ? (
              <button
                onClick={handleLoadMore}
                className="font-baloo inline-flex items-center gap-2 bg-gradient-to-r from-[#2A1F42] to-[#1E1630] hover:from-amber-600 hover:to-amber-700 text-amber-200 hover:text-white px-7 py-3 rounded-full text-sm font-bold border border-amber-500/40 hover:border-amber-400 shadow-lg hover:shadow-amber-500/20 transition-all duration-300 hover:scale-105 group"
              >
                <span>आणखी कपडे पहा ({filteredProducts.length - visibleCount} शिल्लक)</span>
                <ChevronDown className="w-4 h-4 text-amber-400 group-hover:text-white group-hover:translate-y-0.5 transition-transform" />
              </button>
            ) : (
              <div className="font-baloo inline-flex items-center gap-1.5 text-xs text-amber-400/80 bg-[#1D172E] px-4 py-2 rounded-full border border-amber-950">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>सर्व {filteredProducts.length} उपलब्ध कपडे पाहिले आहेत ✨</span>
              </div>
            )}

          </div>
        </>
      )}
    </section>
  );
}
