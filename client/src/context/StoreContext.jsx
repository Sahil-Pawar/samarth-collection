import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Settings
  const [settings, setSettings] = useState({
    storeName: 'समर्थ कलेक्शन',
    storeLocation: 'आडगाव  रेपाळ',
    ownerName: 'पप्पू  बागूल',
    storeTagline: 'आडगाव  रेपाळचा विश्वासू वस्त्र व्यापार • साड्या, मुले व पुरुष',
    whatsappNumber: '+919260439143',
    displayPhone: '9260439143',
    announcement: '🪔 शुभ दीपावली महोत्सव २०२६ | समर्थ कलेक्शन, आडगाव  रेपाळ (पप्पू  बागूल - ९२६०४३९१४३) | साड्या, मुले व पुरुष कपड्यांचा खास संग्रह | व्हॉट्सअॅपवर थेट ऑर्डर करा 🪔',
    currencySymbol: '₹'
  });

  // Filter & Search states
  const [activeCategory, setActiveCategory] = useState('all'); // all, sarees, kids, men, diwali
  const [subCategoryFilter, setSubCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState(10000);

  // UI state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPin, setAdminPin] = useState(() => {
    try {
      return localStorage.getItem('samarth_admin_pin') || '';
    } catch {
      return '';
    }
  });
  const [isDiwaliSparksActive, setIsDiwaliSparksActive] = useState(true);

  // Auto-verify saved pin for client convenience on their personal phone
  useEffect(() => {
    if (adminPin) {
      fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: adminPin })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setIsAdminLoggedIn(true);
        } else {
          localStorage.removeItem('samarth_admin_pin');
          setAdminPin('');
          setIsAdminLoggedIn(false);
        }
      })
      .catch(() => {});
    }
  }, [adminPin]);

  // Cart & Wishlist persistence
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('utsav_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('utsav_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('utsav_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('utsav_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Fetch initial products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      }
    } catch (err) {
      console.warn('API error, falling back or checking server:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch settings
  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.settings) {
          setSettings(prev => ({ ...prev, ...data.settings }));
        }
      }
    } catch (err) {
      console.warn('Settings load error:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSettings();
  }, []);

  // Festive Confetti trigger
  const triggerFestiveCelebration = () => {
    try {
      const count = 200;
      const defaults = {
        origin: { y: 0.7 }
      };

      function fire(particleRatio, opts) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
        colors: ['#F59E0B', '#EF4444', '#10B981']
      });
      fire(0.2, {
        spread: 60,
        colors: ['#D4AF37', '#FFAE34', '#FFFFFF']
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
        colors: ['#FFE29F', '#800020', '#F59E0B']
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45
      });
    } catch (e) {
      console.log('Confetti effect', e);
    }
  };

  // Cart operations
  const addToCart = (product, selectedSize = '') => {
    const size = selectedSize || (product.sizes && product.sizes[0]) || 'Standard';
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id && item.selectedSize === size);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [...prev, { ...product, quantity: 1, selectedSize: size }];
      }
    });
    setIsCartOpen(true);
    triggerFestiveCelebration();
  };

  const removeFromCart = (productId, selectedSize) => {
    setCart(prev => prev.filter(item => !(item.id === productId && item.selectedSize === selectedSize)));
  };

  const updateCartQty = (productId, selectedSize, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === productId && item.selectedSize === selectedSize) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const clearCart = () => setCart([]);

  // Wishlist operations
  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Product CRUD (Client Protected)
  const getPin = () => adminPin || localStorage.getItem('samarth_admin_pin') || 'samarth2026';

  const addProduct = async (productData) => {
    let res;
    try {
      res = await fetch('/api/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-pin': getPin()
        },
        body: JSON.stringify(productData)
      });
    } catch (netErr) {
      throw new Error(`सर्व्हरशी संपर्क होऊ शकला नाही (${netErr.message})`);
    }

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`सर्व्हर त्रुटी (${res.status}): ${text ? text.slice(0, 100) : 'अवैध प्रतिसाद'}`);
    }

    if (data.success && data.product) {
      setProducts(prev => [data.product, ...prev]);
      return data.product;
    }
    throw new Error(data.message || 'उत्पादन जोडता आले नाही');
  };

  const updateProduct = async (id, updatedData) => {
    let res;
    try {
      res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-pin': getPin()
        },
        body: JSON.stringify(updatedData)
      });
    } catch (netErr) {
      throw new Error(`सर्व्हरशी संपर्क होऊ शकला नाही (${netErr.message})`);
    }

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`सर्व्हर त्रुटी (${res.status})`);
    }

    if (data.success && data.product) {
      setProducts(prev => prev.map(p => p.id === id ? data.product : p));
      return data.product;
    }
    throw new Error(data.message || 'अपडेट अयशस्वी');
  };

  const deleteProduct = async (id) => {
    let res;
    try {
      res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-pin': getPin()
        }
      });
    } catch (netErr) {
      throw new Error(`सर्व्हरशी संपर्क होऊ शकला नाही (${netErr.message})`);
    }

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`सर्व्हर त्रुटी (${res.status})`);
    }

    if (data.success) {
      setProducts(prev => prev.filter(p => p.id !== id));
      return true;
    }
    throw new Error(data.message || 'हटवणे अयशस्वी');
  };

  const clearAllProducts = async () => {
    let res;
    try {
      res = await fetch('/api/products-clear-all', {
        method: 'DELETE',
        headers: {
          'x-admin-pin': getPin()
        }
      });
    } catch (netErr) {
      throw new Error(`सर्व्हरशी संपर्क होऊ शकला नाही (${netErr.message})`);
    }

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`सर्व्हर त्रुटी (${res.status})`);
    }

    if (data.success) {
      setProducts([]);
      return true;
    }
    throw new Error(data.message || 'कॅटलॉग रिकामा करता आला नाही');
  };

  // Bulk Upload and Instant Product Generation (Client Phone Gallery Ready)
  const bulkUploadAndCreate = async (formData) => {
    let res;
    try {
      res = await fetch('/api/products/bulk-upload-create', {
        method: 'POST',
        headers: {
          'x-admin-pin': getPin()
        },
        body: formData // contains images files + presets
      });
    } catch (netErr) {
      throw new Error(`इंटरनेट किंवा सर्व्हरशी संपर्क होऊ शकला नाही: ${netErr.message}`);
    }

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      if (res.status === 413) {
        throw new Error('फोटोंचा आकार जास्त आहे. कृपया एका वेळी कमी (उदा. ५ ते १०) फोटो निवडा.');
      }
      if (res.status === 401) {
        throw new Error('अनधिकृत: कृपया मालक PIN पुन्हा टाकून लॉगिन करा.');
      }
      if (res.status === 404) {
        throw new Error('सर्व्हर API सापडले नाही (४०४). कृपया Netlify Functions सक्रिय असल्याची खात्री करा.');
      }
      throw new Error(`सर्व्हर त्रुटी (${res.status}): ${text ? text.slice(0, 100) : 'अपेक्षित प्रतिसाद मिळाला नाही'}`);
    }

    if (!res.ok || !data.success) {
      throw new Error(data.message || `अपलोड अयशस्वी (${res.status})`);
    }

    if (data.success && Array.isArray(data.products)) {
      setProducts(prev => [...data.products, ...prev]);
      triggerFestiveCelebration();
      return data;
    }
    return data;
  };

  // Admin Verification & Session Storage
  const verifyAdmin = async (pin) => {
    const res = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin })
    });
    const data = await res.json();
    if (data.success) {
      setIsAdminLoggedIn(true);
      setAdminPin(pin);
      try {
        localStorage.setItem('samarth_admin_pin', pin);
      } catch {}
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setAdminPin('');
    try {
      localStorage.removeItem('samarth_admin_pin');
    } catch {}
  };

  const saveSettings = async (newSettings, pin) => {
    const activePin = pin || getPin();
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'x-admin-pin': activePin
      },
      body: JSON.stringify({ ...newSettings, pin: activePin })
    });
    const data = await res.json();
    if (data.success && data.settings) {
      setSettings(prev => ({ ...prev, ...data.settings }));
      if (newSettings.adminPin) {
        setAdminPin(newSettings.adminPin);
        try {
          localStorage.setItem('samarth_admin_pin', newSettings.adminPin);
        } catch {}
      }
      return true;
    }
    throw new Error(data.message || 'Failed to save settings');
  };

  // Derived calculations
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartOriginalTotal = cart.reduce((acc, item) => acc + ((item.originalPrice || item.price * 1.5) * item.quantity), 0);
  const cartSavings = Math.max(0, cartOriginalTotal - cartTotal);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Filtered Products
  const filteredProducts = products.filter(product => {
    // Category check
    if (activeCategory === 'diwali') {
      if (!product.isDiwaliSpecial) return false;
    } else if (activeCategory !== 'all') {
      if ((product.category || '').toLowerCase() !== activeCategory.toLowerCase()) {
        return false;
      }
    }

    // Subcategory check
    if (subCategoryFilter !== 'all') {
      if ((product.subCategory || '').toLowerCase() !== subCategoryFilter.toLowerCase()) {
        return false;
      }
    }

    // Price range
    if (product.price > priceRange) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (product.title || '').toLowerCase().includes(q);
      const matchDesc = (product.description || '').toLowerCase().includes(q);
      const matchSub = (product.subCategory || '').toLowerCase().includes(q);
      const matchFabric = (product.fabric || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchSub && !matchFabric) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'discount') return (b.discountPercent || 0) - (a.discountPercent || 0);
    if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    // popular (default)
    return (b.rating || 0) - (a.rating || 0);
  });

  const scrollToProducts = () => {
    setTimeout(() => {
      const el = document.getElementById('products-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  return (
    <StoreContext.Provider value={{
      products,
      filteredProducts,
      loading,
      error,
      settings,
      activeCategory,
      setActiveCategory,
      subCategoryFilter,
      setSubCategoryFilter,
      searchQuery,
      setSearchQuery,
      sortBy,
      setSortBy,
      priceRange,
      setPriceRange,
      selectedProduct,
      setSelectedProduct,
      cart,
      cartCount,
      cartTotal,
      cartOriginalTotal,
      cartSavings,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      wishlist,
      toggleWishlist,
      isCartOpen,
      setIsCartOpen,
      isWishlistOpen,
      setIsWishlistOpen,
      isAdminOpen,
      setIsAdminOpen,
      isAdminLoggedIn,
      setIsAdminLoggedIn,
      isDiwaliSparksActive,
      setIsDiwaliSparksActive,
      triggerFestiveCelebration,
      addProduct,
      updateProduct,
      deleteProduct,
      clearAllProducts,
      bulkUploadAndCreate,
      verifyAdmin,
      logoutAdmin,
      adminPin,
      saveSettings,
      fetchProducts,
      scrollToProducts
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
