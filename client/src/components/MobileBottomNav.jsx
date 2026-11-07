import React from 'react';
import { Home, Heart, ShoppingBag, UploadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function MobileBottomNav() {
  const {
    activeCategory, setActiveCategory,
    cartCount, wishlist,
    setIsCartOpen, setIsWishlistOpen, setIsAdminOpen,
    isAdminLoggedIn,
    triggerFestiveCelebration, scrollToProducts
  } = useStore();

  const navigate = useNavigate();

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#140F22]/95 backdrop-blur-lg border-t border-amber-900/50 px-1 py-1.5 flex items-center justify-around shadow-2xl">

      {/* घर / Home */}
      <button
        onClick={() => {
          setActiveCategory('all');
          navigate('/');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition ${activeCategory === 'all' ? 'text-amber-400 font-bold' : 'text-amber-200/60'}`}
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span className="font-baloo text-[9px]">मुखपृष्ठ</span>
      </button>

      {/* साड्या */}
      <button
        onClick={() => {
          setActiveCategory('sarees');
          navigate('/');
          if (scrollToProducts) scrollToProducts();
        }}
        className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition ${activeCategory === 'sarees' ? 'text-amber-400 font-bold' : 'text-amber-200/60'}`}
      >
        <span className="text-base leading-none mb-0.5">🥻</span>
        <span className="font-baloo text-[9px]">साड्या</span>
      </button>

      {/* Diwali Centre Button */}
      <button
        onClick={() => {
          setActiveCategory('diwali');
          navigate('/');
          triggerFestiveCelebration();
          if (scrollToProducts) scrollToProducts();
        }}
        className="relative -top-3 flex flex-col items-center justify-center"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/30 diya-glow flex items-center justify-center">
          <div className="w-full h-full bg-[#181128] rounded-full flex items-center justify-center">
            <span className="text-xl diya-flame">🪔</span>
          </div>
        </div>
        <span className="font-baloo text-[9px] font-bold text-amber-300 uppercase mt-0.5">दिवाळी</span>
      </button>

      {/* आवडते / Wishlist */}
      <button
        onClick={() => setIsWishlistOpen(true)}
        className="relative flex flex-col items-center justify-center p-1.5 rounded-lg text-amber-200/60"
      >
        <Heart className="w-5 h-5 mb-0.5" />
        <span className="font-baloo text-[9px]">आवडते</span>
        {wishlist.length > 0 && (
          <span className="absolute top-1 right-1 bg-rose-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {wishlist.length}
          </span>
        )}
      </button>

      {/* बॅग / Cart */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="relative flex flex-col items-center justify-center p-1.5 rounded-lg text-amber-200/60"
      >
        <ShoppingBag className="w-5 h-5 mb-0.5" />
        <span className="font-baloo text-[9px]">बॅग</span>
        {cartCount > 0 && (
          <span className="absolute top-1 right-1 bg-amber-500 text-stone-950 text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      {/* Owner Quick Access - Visible ONLY to the logged-in owner on their phone */}
      {isAdminLoggedIn && (
        <button
          onClick={() => setIsAdminOpen(true)}
          className="flex flex-col items-center justify-center p-1.5 rounded-lg text-amber-300 font-bold"
          title="मालक पॅनेल"
        >
          <UploadCloud className="w-5 h-5 mb-0.5 text-amber-400" />
          <span className="font-baloo text-[9px]">मालक</span>
        </button>
      )}
    </div>
  );
}
