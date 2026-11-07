import React, { useState } from 'react';
import { Heart, ShoppingBag, Sparkles, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { buildProductWhatsAppLink } from '../utils/whatsapp';

export default function ProductCard({ product }) {
  const {
    wishlist, toggleWishlist, addToCart,
    settings, triggerFestiveCelebration
  } = useStore();

  const navigate = useNavigate();
  const [imgIndex, setImgIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const isWishlisted = wishlist.includes(product.id);
  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'];
  const currentImage = images[imgIndex] || images[0];

  const goToProduct = () => navigate(`/product/${product.id}`);

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    window.open(buildProductWhatsAppLink(settings.whatsappNumber, product), '_blank');
  };
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };
  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product.id);
    if (!isWishlisted) triggerFestiveCelebration();
  };

  return (
    <div
      onClick={goToProduct}
      className="group relative bg-gradient-to-b from-[#1C152B] to-[#140E22] rounded-2xl overflow-hidden border border-amber-900/35 hover:border-amber-400/60 transition-all duration-300 shadow-md hover:shadow-2xl hover:shadow-amber-500/15 flex flex-col cursor-pointer card-glow-hover"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#241C36]">
        <img
          src={imageError
            ? 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
            : currentImage}
          alt={product.title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover object-top group-hover:scale-106 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#140E22]/90 via-transparent to-black/25 pointer-events-none" />

        {/* Modern Diwali Special Badge */}
        {product.isDiwaliSpecial && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="font-baloo inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-stone-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-lg border border-amber-200/50 uppercase tracking-wider backdrop-blur-sm">
              <Sparkles className="w-3 h-3 fill-stone-950 text-stone-950" />
              <span>दिवाळी स्पेशल</span>
            </span>
          </div>
        )}

        {/* Modern Floating Wishlist Icon Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2.5 right-2.5 z-10 w-9 h-9 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-200 shadow-lg ${
            isWishlisted
              ? 'bg-rose-500/25 border-rose-400 text-rose-400 scale-105 shadow-rose-950/60'
              : 'bg-black/45 border-white/15 text-white/90 hover:text-rose-400 hover:border-rose-400/50 hover:bg-black/70 hover:scale-110'
          }`}
          aria-label="आवडते"
        >
          <Heart className={`w-4 h-4 transition-transform duration-200 ${isWishlisted ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
        </button>

        {/* Modern Quick View Floating Button on Hover (Desktop) */}
        <div className="absolute inset-x-3 bottom-3 z-10 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <span className="font-baloo bg-black/80 hover:bg-black text-amber-200 text-xs font-semibold py-1.5 px-4 rounded-full backdrop-blur-md border border-amber-400/40 flex items-center justify-center gap-1.5 shadow-xl transition-all">
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-300" />
            <span>सविस्तर पहा</span>
          </span>
        </div>

        {/* Modern Image Carousel Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10 sm:group-hover:opacity-0 transition-opacity">
            {images.slice(0, 4).map((_, i) => (
              <span
                key={i}
                onMouseEnter={(e) => { e.stopPropagation(); setImgIndex(i); }}
                className={`h-1 rounded-full transition-all duration-300 ${imgIndex === i ? 'bg-amber-300 w-3.5' : 'bg-white/40 w-1'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content Details */}
      <div className="p-3 sm:p-4 flex flex-col justify-between flex-1 gap-2.5">
        <div>
          {/* Subcategory Pill */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="font-baloo text-[10px] text-amber-400/90 uppercase tracking-wider font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 truncate">
              {product.subCategory || product.category}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="font-tiro text-sm sm:text-base text-amber-100 group-hover:text-amber-300 transition line-clamp-2 leading-snug font-medium">
            {product.title}
          </h3>

          {/* Available Sizes Pills */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.sizes.slice(0, 3).map((sz, i) => (
                <span key={i} className="font-baloo text-[9px] bg-[#231A33] text-amber-300/80 px-2 py-0.5 rounded-md border border-amber-900/60 font-medium">
                  {sz}
                </span>
              ))}
              {product.sizes.length > 3 && (
                <span className="font-baloo text-[9px] text-amber-400/60 self-center">+{product.sizes.length - 3}</span>
              )}
            </div>
          )}
        </div>

        {/* Action Row — Modern WhatsApp Pill + Bag Button */}
        <div className="grid grid-cols-5 gap-1.5 pt-2 border-t border-amber-950/60">
          
          {/* Modern WhatsApp Button */}
          <button
            onClick={handleWhatsApp}
            className="font-baloo col-span-4 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40 border border-emerald-400/30 transition-all duration-200 hover:shadow-emerald-500/20 active:scale-95"
            title="व्हॉट्सअॅपवर ऑर्डर करा"
          >
            {/* Modern WhatsApp Vector Logo */}
            <svg className="w-4 h-4 fill-white flex-shrink-0" viewBox="0 0 24 24">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.77 14.15c-.24.67-1.39 1.29-1.92 1.37-.5.08-1.15.11-3.32-.78-2.66-1.1-4.38-3.8-4.52-3.98-.13-.18-1.07-1.42-1.07-2.71 0-1.29.68-1.93.92-2.19.24-.26.53-.33.7-.33.18 0 .35 0 .5.01.16.01.38-.06.59.45.24.57.81 1.98.88 2.13.07.15.12.33.02.53-.1.2-.15.33-.3.51-.15.18-.32.4-.46.54-.15.15-.31.32-.13.63.18.31.79 1.3 1.7 2.11 1.17 1.04 2.15 1.37 2.46 1.52.31.15.49.13.67-.08.18-.21.78-.91.99-1.22.21-.31.42-.26.7-.15.28.11 1.79.84 2.1 1 .31.15.52.23.6.35.08.13.08.76-.16 1.43z"/>
            </svg>
            <span className="truncate">व्हॉट्सअॅप ऑर्डर</span>
          </button>

          {/* Modern Cart Button */}
          <button
            onClick={handleAddToCart}
            className="col-span-1 bg-[#261C3B] hover:bg-amber-500 text-amber-300 hover:text-stone-950 rounded-xl flex items-center justify-center transition-all duration-200 border border-amber-600/30 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/20 active:scale-95"
            aria-label="बॅगेत टाका"
            title="बॅगेत टाका"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
