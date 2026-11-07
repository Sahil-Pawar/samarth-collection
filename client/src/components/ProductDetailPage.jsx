import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Heart, ShoppingBag, MessageCircle,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { buildProductWhatsAppLink } from '../utils/whatsapp';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    products, wishlist, toggleWishlist,
    addToCart, settings, triggerFestiveCelebration
  } = useStore();

  const product = products.find(p => p.id === id);

  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [addedNotice, setAddedNotice] = useState(false);

  // Scroll to top whenever product id changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveImg(0);
    setSelectedSize('');
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="text-5xl diya-flame">🪔</div>
        <h2 className="font-tiro text-xl text-amber-200">उत्पादन सापडले नाही</h2>
        <button onClick={() => navigate('/')} className="font-baloo bg-amber-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-amber-500 transition">
          संग्रहाकडे परत जा
        </button>
      </div>
    );
  }

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80'];

  const size = selectedSize || (product.sizes && product.sizes[0]) || '';
  const isWishlisted = wishlist.includes(product.id);

  // Related products: same category, exclude current
  const related = products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 8);

  const handleWhatsApp = () => {
    window.open(buildProductWhatsAppLink(settings.whatsappNumber, product, size), '_blank');
  };

  const handleAdd = () => {
    addToCart(product, size);
    setAddedNotice(true);
    triggerFestiveCelebration();
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const prevImg = () => setActiveImg(i => (i === 0 ? images.length - 1 : i - 1));
  const nextImg = () => setActiveImg(i => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 fade-in-up">

      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="font-baloo flex items-center gap-2 text-amber-300 hover:text-amber-100 text-sm mb-6 group transition"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
        <span>मुख्य संग्रहाकडे जा</span>
      </button>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">

        {/* ——— Image Gallery ——— */}
        <div className="space-y-3">
          {/* Main Image */}
          <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-[#1A1428] border border-amber-900/40 shadow-xl">
            <img
              src={images[activeImg]}
              alt={product.title}
              className="w-full h-full object-cover object-top transition duration-300"
            />

            {/* Nav arrows (only if multiple images) */}
            {images.length > 1 && (
              <>
                <button onClick={prevImg} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition backdrop-blur-sm">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={nextImg} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition backdrop-blur-sm">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Diwali badge */}
            {product.isDiwaliSpecial && (
              <div className="absolute top-4 left-4">
                <span className="font-baloo inline-flex items-center gap-1 bg-gradient-to-r from-amber-600 to-yellow-500 text-stone-950 text-xs font-extrabold px-3 py-1 rounded-full shadow-lg uppercase">
                  🪔 दिवाळी स्पेशल
                </span>
              </div>
            )}

            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 right-4 font-baloo text-xs bg-black/60 text-amber-200 px-2.5 py-1 rounded-full backdrop-blur-sm">
                {activeImg + 1} / {images.length}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition ${
                    activeImg === i ? 'border-amber-400 scale-105' : 'border-amber-900/40 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ——— Product Info (No Prices, No Long Description, Image Focused) ——— */}
        <div className="flex flex-col justify-between gap-5">

          <div className="space-y-4">
            {/* Category */}
            <div className="flex items-center justify-between">
              <span className="font-baloo text-xs uppercase tracking-widest bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full border border-amber-500/20 font-semibold">
                {product.category?.toUpperCase()} • {product.subCategory}
              </span>
              <span className="font-baloo text-xs text-amber-300/80">
                समर्थ कलेक्शन • आडगाव  रेपाळ
              </span>
            </div>

            {/* Title */}
            <h1 className="font-tiro text-2xl sm:text-3xl font-bold text-amber-50 leading-snug">
              {product.title}
            </h1>

            {/* Fabric (Brief info only) */}
            {product.fabric && (
              <div className="font-baloo text-sm bg-black/20 p-3 rounded-xl border border-amber-950/60 text-amber-200/90">
                <span className="text-amber-400 font-semibold">कापड: </span>
                {product.fabric}
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <p className="font-baloo text-sm font-semibold text-amber-200 mb-2">साइज निवडा:</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedSize(sz)}
                      className={`font-baloo px-4 py-2 rounded-xl text-sm font-medium transition ${
                        (selectedSize || product.sizes[0]) === sz
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

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="font-baloo text-sm text-amber-300/80">
                <span className="font-semibold text-amber-400">उपलब्ध रंग: </span>
                {product.colors.join(' • ')}
              </div>
            )}

            {/* Stock Status */}
            <div className="font-baloo flex items-center gap-2 text-sm text-emerald-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              {product.stockStatus || 'उपलब्ध'} — २४ तासात पाठवले जाईल
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3 pt-4 border-t border-amber-950/60">
            {/* WhatsApp */}
            <button
              onClick={handleWhatsApp}
              className="font-baloo w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold py-4 px-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-emerald-950/50 transition text-base"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>पप्पू  बागूल यांना व्हॉट्सअॅपवर ऑर्डर करा (९२६०४३९१४३)</span>
            </button>

            {/* Add to bag + Wishlist */}
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={handleAdd}
                className="font-baloo col-span-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition text-sm"
              >
                <ShoppingBag className="w-5 h-5 text-amber-200" />
                {addedNotice ? 'बॅगेत टाकले! ✓' : 'बॅगेत टाका'}
              </button>
              <button
                onClick={() => { toggleWishlist(product.id); if (!isWishlisted) triggerFestiveCelebration(); }}
                className="col-span-1 bg-[#231A33] hover:bg-[#302347] rounded-2xl flex items-center justify-center transition border border-amber-900/50"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-amber-300'}`} />
              </button>
            </div>

            {/* Trust note */}
            <div className="font-baloo text-center text-xs text-amber-300/80 pt-1">
              समर्थ कलेक्शन • आडगाव  रेपाळ • पप्पू  बागूल: ९२६०४३९१४३
            </div>
          </div>
        </div>
      </div>

      {/* ——— Related Products ——— */}
      {related.length > 0 && (
        <div className="border-t border-amber-950/60 pt-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl diya-flame">🪔</span>
            <h2 className="font-tiro text-xl sm:text-2xl font-bold text-amber-50">
              याच विभागातील इतर कपडे
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
