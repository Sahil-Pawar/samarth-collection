import React from 'react';
import { X, Heart, ShoppingBag, Trash2, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { buildProductWhatsAppLink } from '../utils/whatsapp';

export default function WishlistDrawer() {
  const { isWishlistOpen, setIsWishlistOpen, wishlist, toggleWishlist, products, addToCart, settings } = useStore();
  const navigate = useNavigate();

  if (!isWishlistOpen) return null;

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  const handleProductClick = (id) => {
    setIsWishlistOpen(false);
    navigate(`/product/${id}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end">
      <div className="absolute inset-0" onClick={() => setIsWishlistOpen(false)} />
      <div className="relative w-full max-w-md bg-[#161224] h-full shadow-2xl border-l border-amber-900/60 flex flex-col z-10">

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-amber-950 flex items-center justify-between bg-[#1B152B]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="font-tiro text-lg font-bold text-amber-50">आवडती यादी</h2>
            <span className="font-baloo text-xs bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-bold">
              {wishlistedProducts.length} वस्तू
            </span>
          </div>
          <button onClick={() => setIsWishlistOpen(false)} className="p-1.5 rounded-full hover:bg-black/40 text-amber-300 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {wishlistedProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-950/40 border border-rose-500/20 flex items-center justify-center">
                <Heart className="w-8 h-8 text-rose-400" />
              </div>
              <h3 className="font-tiro text-base font-semibold text-amber-200">आवडती यादी रिकामी आहे</h3>
              <p className="font-baloo text-xs text-amber-400/60 max-w-xs">
                आवडलेल्या साड्या, कुर्ते आणि मुलांच्या कपड्यांवर ❤️ दाबा.
              </p>
            </div>
          ) : (
            wishlistedProducts.map((product) => {
              const img = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '';
              return (
                <div key={product.id} className="bg-[#1F1730] p-3 rounded-xl border border-amber-900/40 flex gap-3">
                  <img
                    src={img}
                    alt={product.title}
                    onClick={() => handleProductClick(product.id)}
                    className="w-16 h-20 object-cover rounded-lg bg-[#271E3D] flex-shrink-0 cursor-pointer"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4
                          onClick={() => handleProductClick(product.id)}
                          className="font-tiro text-xs font-semibold text-amber-100 hover:text-amber-300 cursor-pointer line-clamp-1"
                        >
                          {product.title}
                        </h4>
                        <button onClick={() => toggleWishlist(product.id)} className="text-rose-400/80 hover:text-rose-300 p-0.5">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="font-baloo text-[10px] text-amber-400/80 uppercase">
                        {product.subCategory || product.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-amber-950">
                      <button
                        onClick={() => { addToCart(product); toggleWishlist(product.id); }}
                        className="font-baloo flex-1 bg-amber-600/90 hover:bg-amber-600 text-white text-[11px] font-semibold py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>बॅगेत टाका</span>
                      </button>
                      <a
                        href={buildProductWhatsAppLink(settings.whatsappNumber, product)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold py-1.5 px-2.5 rounded-lg flex items-center justify-center transition"
                        title="व्हॉट्सअॅप ऑर्डर"
                      >
                        <MessageCircle className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
