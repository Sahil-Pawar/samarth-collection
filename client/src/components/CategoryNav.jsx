import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function CategoryNav() {
  const {
    products,
    activeCategory,
    setActiveCategory,
    subCategoryFilter,
    setSubCategoryFilter,
    sortBy,
    setSortBy,
    filteredProducts,
    scrollToProducts
  } = useStore();

  const navigate = useNavigate();

  const mainCategories = [
    { id: 'all',    label: 'सर्व संग्रह' },
    { id: 'sarees', label: 'साड्या' },
    { id: 'kids',   label: 'मुलांचे कपडे' },
    { id: 'men',    label: 'पुरुष शर्ट व कुर्ते' },
    { id: 'diwali', label: 'दिवाळी स्पेशल ✨' }
  ];

  const getSubcategories = () => {
    if (activeCategory === 'sarees') return ['सर्व साड्या', 'बनारसी सिल्क', 'कांजीवरम', 'ऑर्गेंझा व टिशू', 'जॉर्जेट बंधाणी'];
    if (activeCategory === 'kids')   return ['सर्व मुले', 'मुलांचे एथनिक सेट', 'मुलांचे शर्ट व पँट', 'मुलींचे एथनिक', 'मुलींचे फ्रॉक'];
    if (activeCategory === 'men')    return ['सर्व पुरुष', 'कुर्ता व पायजमा', 'फेस्टिव्ह शर्ट', 'पुरुष शर्ट', 'कुर्ता व पँट'];
    return [];
  };

  const subcategories = getSubcategories();

  const handleMainCategoryClick = (catId) => {
    setActiveCategory(catId);
    setSubCategoryFilter('all');
    navigate('/');
    if (scrollToProducts) scrollToProducts();
  };

  const handleSubCategoryClick = (subVal) => {
    setSubCategoryFilter(subVal);
    navigate('/');
    if (scrollToProducts) scrollToProducts();
  };

  return (
    <div className="bg-[#120F1C] border-b border-amber-950/40 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-3">

        {/* Main Tabs + Sort */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {mainCategories.map((cat) => {
              const count = cat.id === 'all'
                ? products.length
                : cat.id === 'diwali'
                  ? products.filter(p => p.isDiwaliSpecial).length
                  : products.filter(p => (p.category || '').toLowerCase() === cat.id).length;
              const isSelected = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleMainCategoryClick(cat.id)}
                  className={`font-baloo flex-shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-900/40 border border-amber-400/60'
                      : 'bg-[#1C162A] text-amber-200/80 hover:text-amber-100 hover:bg-[#281F3D] border border-amber-900/40'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`font-baloo text-[10px] px-1.5 rounded-full ${
                    isSelected ? 'bg-amber-950/80 text-amber-200' : 'bg-black/40 text-amber-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sort + Count (No Price sorting) */}
          <div className="flex items-center justify-between md:justify-end gap-3 text-xs">
            <span className="font-baloo text-amber-300/70 font-medium">
              <strong className="text-amber-200">{filteredProducts.length}</strong> डिझाइन उपलब्ध
            </span>

            <div className="flex items-center gap-1.5 bg-[#1C162A] border border-amber-900/50 rounded-lg px-3 py-1.5 text-amber-200">
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="font-baloo bg-transparent text-xs text-amber-100 focus:outline-none cursor-pointer"
              >
                <option value="popular" className="bg-[#1C162A]">सर्वाधिक लोकप्रिय</option>
                <option value="newest"  className="bg-[#1C162A]">नवीन आगमन</option>
              </select>
            </div>
          </div>
        </div>

        {/* Subcategory Pills */}
        {subcategories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 scrollbar-none border-t border-amber-950/40">
            <span className="font-baloo text-[11px] text-amber-400/60 uppercase tracking-wider font-semibold flex-shrink-0">
              प्रकार:
            </span>
            {subcategories.map((sub) => {
              const isAll = sub.startsWith('सर्व ');
              const matchVal = isAll ? 'all' : sub;
              const isSelected = subCategoryFilter === matchVal;

              return (
                <button
                  key={sub}
                  onClick={() => handleSubCategoryClick(matchVal)}
                  className={`font-baloo flex-shrink-0 text-xs px-3 py-1 rounded-md transition ${
                    isSelected
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50 font-semibold'
                      : 'text-amber-200/60 hover:text-amber-100 hover:bg-amber-950/30'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
