import React, { useState } from 'react';
import { X, Heart, ShoppingBag, MessageCircle, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { buildProductWhatsAppLink } from '../utils/whatsapp';

export default function ProductModal() {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    wishlist,
    toggleWishlist,
    settings,
    triggerFestiveCelebration
  } = useStore();

  if (!selectedProduct) return null;

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(
    selectedProduct.sizes && selectedProduct.sizes.length > 0 ? selectedProduct.sizes[0] : ''
  );
  const [addedNotice, setAddedNotice] = useState(false);

  const images = Array.isArray(selectedProduct.images) && selectedProduct.images.length > 0
    ? selectedProduct.images
    : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80'];

  const isWishlisted = wishlist.includes(selectedProduct.id);

  const handleWhatsApp = () => {
    window.open(buildProductWhatsAppLink(settings.whatsappNumber, selectedProduct, selectedSize), '_blank');
  };

  const handleAdd = () => {
    addToCart(selectedProduct, selectedSize);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-[#161224] rounded-3xl border border-amber-500/40 w-full max-w-4xl overflow-hidden shadow-2xl shadow-amber-950/80 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-amber-200 hover:text-white flex items-center justify-center transition border border-amber-900/50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* Image Gallery */}
          <div className="p-4 sm:p-6 bg-[#1A142A] flex flex-col justify-between">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#241C36] mb-3 border border-amber-900/40">
              <img
                src={images[activeImgIndex] || images[0]}
                alt={selectedProduct.title}
                className="w-full h-full object-cover object-top transition duration-300"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {selectedProduct.isDiwaliSpecial && (
                  <span className="font-baloo inline-flex items-center gap-1 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-stone-950 text-xs font-bold px-3 py-1 rounded-full shadow uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    दिवाळी स्पेशल
                  </span>
                )}
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImgIndex(i)}
                    className={`w-16 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition ${
                      activeImgIndex === i ? 'border-amber-400' : 'border-amber-900/40 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="p-5 sm:p-7 flex flex-col justify-between space-y-4">
            <div>
              {/* Category */}
              <div className="flex items-center justify-between text-xs text-amber-400 font-semibold mb-2">
                <span className="font-baloo uppercase tracking-widest bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                  {selectedProduct.category?.toUpperCase()} • {selectedProduct.subCategory}
                </span>
                <span className="font-baloo text-xs text-amber-300/80">
                  समर्थ कलेक्शन • आडगाव  रेपाळ
                </span>
              </div>

              {/* Title in Tiro Devanagari */}
              <h2 className="font-tiro text-xl sm:text-2xl font-bold text-amber-50 leading-snug mb-3">
                {selectedProduct.title}
              </h2>

              {/* Fabric */}
              {selectedProduct.fabric && (
                <div className="font-baloo text-xs text-amber-300/80 mb-4 bg-black/20 p-2.5 rounded-lg border border-amber-950">
                  <span className="text-amber-400 font-semibold">कापड व शिलाई: </span>
                  {selectedProduct.fabric}
                </div>
              )}

              {/* Sizes */}
              {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center justify-between text-xs font-semibold text-amber-200 mb-2">
                    <span className="font-baloo">साइज निवडा:</span>
                    <span className="font-baloo text-amber-400/70 text-[11px]">साइज उपलब्ध</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map((sz, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedSize(sz)}
                        className={`font-baloo px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                          selectedSize === sz
                            ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                            : 'bg-[#251D36] text-amber-200/80 hover:bg-[#34294C] border border-amber-900/50'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock */}
              <div className="font-baloo flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span>{selectedProduct.stockStatus || 'उपलब्ध'} — २४ तासात पाठवले जाईल</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-4 border-t border-amber-950/60">
              <button
                onClick={handleWhatsApp}
                className="font-baloo w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>पप्पू  बागूल यांना व्हॉट्सअॅपवर ऑर्डर करा</span>
              </button>

              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={handleAdd}
                  className="font-baloo col-span-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-200" />
                  <span>{addedNotice ? 'बॅगेत टाकले! ✓' : 'बॅगेत टाका'}</span>
                </button>
                <button
                  onClick={() => { toggleWishlist(selectedProduct.id); if (!isWishlisted) triggerFestiveCelebration(); }}
                  className={`col-span-1 bg-[#231A33] hover:bg-[#302347] rounded-xl flex items-center justify-center transition border border-amber-900/50`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-amber-300'}`} />
                </button>
              </div>

              <div className="font-baloo flex items-center justify-center gap-4 text-[11px] text-amber-400/60 pt-1">
                <span>✓ दर्जेदार कापड</span>
                <span>✓ व्हॉट्सअॅप सहाय्य</span>
                <span>✓ ९२६०४३९१४३</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
