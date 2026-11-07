import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, UploadCloud, Menu, X, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const {
    activeCategory, setActiveCategory,
    searchQuery, setSearchQuery,
    cartCount, wishlist,
    setIsCartOpen, setIsWishlistOpen, setIsAdminOpen,
    isAdminLoggedIn, scrollToProducts
  } = useStore();

  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchMobile, setShowSearchMobile] = useState(false);

  const categories = [
    { id: 'all',    label: 'सर्व संग्रह' },
    { id: 'sarees', label: 'साड्या',           badge: 'बनारसी व रेशीम' },
    { id: 'kids',   label: 'मुलांचे कपडे',      badge: 'मुले व मुली' },
    { id: 'men',    label: 'पुरुष शर्ट व कुर्ते', badge: 'पारंपरिक व फॉर्मल' },
    { id: 'diwali', label: 'दिवाळी स्पेशल 🪔',   badge: 'खास निवड' },
  ];

  const handleCategorySelect = (id) => {
    setActiveCategory(id);
    setMobileMenuOpen(false);
    navigate('/');
    if (scrollToProducts) scrollToProducts();
  };

  const handleLogoClick = () => {
    setActiveCategory('all');
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#120F1D]/95 backdrop-blur-md border-b border-amber-900/40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-amber-200 hover:text-white p-2 rounded-lg"
            aria-label="मेनू"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand */}
          <div onClick={handleLogoClick} className="flex items-center gap-3 cursor-pointer group">
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 p-0.5 shadow-md shadow-amber-500/25 group-hover:scale-105 transition diya-glow">
              <div className="w-full h-full bg-[#120F1D] rounded-full flex items-center justify-center">
                <span className="text-xl diya-flame">🪔</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-rozha text-2xl sm:text-3xl font-bold rangoli-gold-text tracking-wide leading-tight drop-shadow-md">
                  समर्थ कलेक्शन
                </span>
                <span className="font-baloo text-[9px] uppercase font-bold tracking-wider bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30">
                  दिवाळी '२६
                </span>
              </div>
              <p className="font-baloo text-[10px] text-amber-300/80 tracking-wider hidden sm:block mt-0.5">
                आडगाव  रेपाळ • पप्पू  बागूल (९२६०४३९१४३)
              </p>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4 relative">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="साड्या, मुलांचे कुर्ते, मुलींचे लेहेंगे, पुरुष शर्ट शोधा..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="font-baloo w-full bg-[#1C172B] text-amber-100 placeholder-amber-400/40 text-sm rounded-full pl-10 pr-10 py-2.5 border border-amber-900/60 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
              />
              <Search className="w-4 h-4 text-amber-400/60 absolute left-3.5 top-3" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-2.5 text-amber-400/60 hover:text-amber-200 text-xs bg-amber-950/60 rounded-full w-5 h-5 flex items-center justify-center">✕</button>
              )}
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => setShowSearchMobile(!showSearchMobile)} className="lg:hidden text-amber-300 hover:text-white p-2 rounded-full hover:bg-amber-950/40">
              <Search className="w-5 h-5" />
            </button>

            <button onClick={() => setIsWishlistOpen(true)} className="relative text-amber-300 hover:text-white p-2 rounded-full hover:bg-amber-950/40 transition" aria-label="आवडते">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce font-baloo">{wishlist.length}</span>
              )}
            </button>

            <button onClick={() => setIsCartOpen(true)} className="relative bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white px-3 sm:px-4 py-2 rounded-full flex items-center gap-2 shadow-md transition" aria-label="बॅग">
              <ShoppingBag className="w-4 h-4 text-amber-200" />
              <span className="hidden sm:inline font-baloo text-xs font-semibold uppercase tracking-wider">बॅग</span>
              {cartCount > 0 && (
                <span className="font-baloo bg-amber-300 text-amber-950 text-xs font-extrabold px-1.5 rounded-full">{cartCount}</span>
              )}
            </button>

            {/* Owner Access Button - Visible ONLY to the logged-in owner */}
            {isAdminLoggedIn && (
              <button
                onClick={() => setIsAdminOpen(true)}
                className="font-baloo flex items-center gap-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-full border border-amber-400/60 transition shadow-md hover:scale-105"
                title="मालक पोर्टल - फोटो अपलोड करा"
              >
                <UploadCloud className="w-3.5 h-3.5 text-amber-200" />
                <span className="hidden sm:inline">मालक पॅनेल</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        {showSearchMobile && (
          <div className="lg:hidden pb-3 pt-1">
            <div className="relative">
              <input type="text" placeholder="साड्या, कुर्ते, लेहेंगे शोधा..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="font-baloo w-full bg-[#1C172B] text-amber-100 placeholder-amber-400/40 text-sm rounded-lg pl-9 pr-9 py-2.5 border border-amber-900/60 focus:outline-none focus:border-amber-400" />
              <Search className="w-4 h-4 text-amber-400/60 absolute left-3 top-3.5" />
              {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3 text-amber-400/60">✕</button>}
            </div>
          </div>
        )}

        {/* Desktop Category Bar */}
        <nav className="hidden md:flex items-center justify-center gap-1 lg:gap-2 py-2.5 border-t border-amber-950/40">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button key={cat.id} onClick={() => handleCategorySelect(cat.id)}
                className={`font-baloo relative px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md border border-amber-400/50'
                    : 'text-amber-200/80 hover:text-amber-100 hover:bg-amber-950/30'
                }`}
              >
                <span>{cat.label}</span>
                {cat.badge && (
                  <span className={`font-baloo text-[9px] px-1.5 rounded-full uppercase ${isActive ? 'bg-amber-950/80 text-amber-200' : 'bg-[#251D33] text-amber-400/80'}`}>
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#181326] border-t border-amber-900/60 px-4 py-4 space-y-2">
          <p className="font-baloo text-[11px] uppercase tracking-wider text-amber-400/60 font-semibold px-2">विभाग निवडा</p>
          <div className="grid grid-cols-1 gap-1">
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => handleCategorySelect(cat.id)}
                className={`font-baloo w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between transition ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-amber-700 to-amber-800 text-white font-semibold'
                    : 'text-amber-200/90 hover:bg-amber-950/40'
                }`}
              >
                <span>{cat.label}</span>
                {cat.badge && <span className="font-baloo text-[10px] bg-black/30 px-2 py-0.5 rounded text-amber-300">{cat.badge}</span>}
              </button>
            ))}
          </div>
          <div className="pt-3 border-t border-amber-950/60">
            <button onClick={() => { setIsAdminOpen(true); setMobileMenuOpen(false); }}
              className="font-baloo w-full bg-[#271F38] text-amber-300 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-xs font-bold border border-amber-600/40">
              <UploadCloud className="w-4 h-4 text-amber-400" />
              <span>क्लायंट फोटो बल्क अपलोड</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
