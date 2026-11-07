import React from 'react';
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { buildCartWhatsAppLink } from '../utils/whatsapp';

export default function CartDrawer() {
  const {
    isCartOpen, setIsCartOpen,
    cart, updateCartQty, removeFromCart, clearCart,
    settings, triggerFestiveCelebration
  } = useStore();

  if (!isCartOpen) return null;

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;
    window.open(buildCartWhatsAppLink(settings.whatsappNumber, cart), '_blank');
    triggerFestiveCelebration();
  };

  const totalItems = cart.reduce((a, b) => a + b.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="relative w-full max-w-md bg-[#161224] h-full shadow-2xl border-l border-amber-900/60 flex flex-col z-10">

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-amber-950 flex items-center justify-between bg-[#1B152B]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h2 className="font-tiro text-lg font-bold text-amber-50">माझी बॅग</h2>
            <span className="font-baloo text-xs bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full font-bold">
              {totalItems} वस्तू
            </span>
          </div>
          <button onClick={() => setIsCartOpen(false)} className="p-1.5 rounded-full hover:bg-black/40 text-amber-300 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-950/40 border border-amber-500/20 flex items-center justify-center text-3xl">🪔</div>
              <h3 className="font-tiro text-base font-semibold text-amber-200">बॅग रिकामी आहे</h3>
              <p className="font-baloo text-xs text-amber-400/60 max-w-xs">
                आमच्या साड्या, मुलांचे कपडे आणि पुरुष कुर्ते पहा आणि बॅगेत टाका.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="font-baloo mt-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow hover:scale-105 transition"
              >
                संग्रह पहा
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const img = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : '';
              return (
                <div key={`${item.id}-${item.selectedSize}`} className="bg-[#1F1730] p-3 rounded-xl border border-amber-900/40 flex gap-3">
                  <img src={img} alt={item.title} className="w-16 h-20 object-cover rounded-lg bg-[#271E3D] flex-shrink-0" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-tiro text-xs font-semibold text-amber-100 line-clamp-1">{item.title}</h4>
                        <button onClick={() => removeFromCart(item.id, item.selectedSize)} className="text-amber-400/50 hover:text-rose-400 p-0.5 transition">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="font-baloo text-[11px] text-amber-400/70 mt-0.5">
                        साइज: <span className="text-amber-200 font-medium">{item.selectedSize || 'फ्री साइज'}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-amber-950/60">
                      <span className="font-baloo text-xs text-amber-300 font-semibold">
                        नग: {item.quantity}
                      </span>
                      <div className="flex items-center gap-1.5 bg-[#2A1F40] px-2 py-0.5 rounded-md border border-amber-900/40">
                        <button onClick={() => updateCartQty(item.id, item.selectedSize, -1)} className="text-amber-300 hover:text-white p-0.5">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-baloo text-xs font-semibold text-amber-100 min-w-[16px] text-center">{item.quantity}</span>
                        <button onClick={() => updateCartQty(item.id, item.selectedSize, 1)} className="text-amber-300 hover:text-white p-0.5">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer (No Prices) */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-amber-950 bg-[#1A1429] space-y-3">
            <div className="text-center">
              <p className="font-baloo text-xs text-amber-200 font-medium">
                निवडलेले एकूण पोशाख: <strong className="text-amber-300">{totalItems} नग</strong>
              </p>
              <p className="font-baloo text-[11px] text-amber-400/70 mt-0.5">
                समर्थ कलेक्शन • आडगाव  रेपाळ • पप्पू  बागूल (९२६०४३९१४३)
              </p>
            </div>

            <button
              onClick={handleWhatsAppCheckout}
              className="font-baloo w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition text-sm"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>पप्पू  बागूल यांना व्हॉट्सअॅपवर यादी पाठवा</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <div className="font-baloo flex items-center justify-between text-[11px] text-amber-400/60 pt-1">
              <span>ऑर्डर थेट व्हॉट्सअॅपवर जाते</span>
              <button onClick={clearCart} className="hover:text-rose-400 underline transition">बॅग रिकामी करा</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
