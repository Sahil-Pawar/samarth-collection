const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

let getStoreFunc = null;
try {
  const blobs = require('@netlify/blobs');
  getStoreFunc = blobs.getStore;
} catch (e) {
  console.warn('Netlify Blobs package not available:', e.message);
}

const app = express();

app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Multer memory storage for Netlify serverless functions
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB per file
});

// Default settings
const DEFAULT_SETTINGS = {
  storeName: "समर्थ कलेक्शन",
  storeNameEn: "Samarth Collection",
  ownerName: "पप्पू  बागूल",
  storeLocation: "आडगाव  रेपाळ",
  storeTagline: "आडगाव  रेपाळचा विश्वासू वस्त्र व्यापार • साड्या, मुले व पुरुष",
  whatsappNumber: "+919260439143",
  displayPhone: "9260439143",
  announcement: "🪔 शुभ दीपावली महोत्सव २०२६ | समर्थ कलेक्शन, आडगाव  रेपाळ (पप्पू  बागूल - ९२६०४३९१४३) | साड्या, मुले व पुरुष कपड्यांचा खास संग्रह | व्हॉट्सअॅपवर थेट ऑर्डर करा 🪔",
  currencySymbol: "₹",
  adminPin: "samarth2026",
  address: "समर्थ कलेक्शन, मुख्य बाजार, आडगाव  रेपाळ, महाराष्ट्र"
};

// In-memory fallbacks (keeps session warm across invocations)
let cachedProducts = [];
let cachedSettings = { ...DEFAULT_SETTINGS };

// Safe Netlify Blobs helpers
function getBlobStore(name) {
  if (!getStoreFunc) return null;
  try {
    return getStoreFunc(name);
  } catch (e) {
    return null;
  }
}

async function readSettings() {
  const store = getBlobStore('settings');
  if (store) {
    try {
      const s = await store.get('config', { type: 'json' });
      if (s) {
        cachedSettings = { ...DEFAULT_SETTINGS, ...s };
        return cachedSettings;
      }
    } catch (e) {
      // Blobs unconfigured, use cachedSettings
    }
  }
  return cachedSettings;
}

async function writeSettings(newSettings) {
  cachedSettings = { ...cachedSettings, ...newSettings };
  const store = getBlobStore('settings');
  if (store) {
    try {
      await store.setJSON('config', cachedSettings);
    } catch (e) {}
  }
}

async function readProducts() {
  const store = getBlobStore('products');
  if (store) {
    try {
      const list = await store.get('catalog', { type: 'json' });
      if (Array.isArray(list)) {
        cachedProducts = list;
        return list;
      }
    } catch (e) {}
  }
  return cachedProducts;
}

async function writeProducts(productsList) {
  cachedProducts = productsList;
  const store = getBlobStore('products');
  if (store) {
    try {
      await store.setJSON('catalog', productsList);
    } catch (e) {}
  }
}

// Security Middleware
async function requireAdminAuth(req, res, next) {
  try {
    const settings = await readSettings();
    const validPin = settings.adminPin || 'samarth2026';
    
    const providedPin = 
      req.headers['x-admin-pin'] || 
      (req.headers.authorization && req.headers.authorization.replace('Bearer ', '')) ||
      (req.body && req.body.adminPin) ||
      req.query.adminPin;

    if (providedPin && providedPin === validPin) {
      return next();
    }
    return res.status(401).json({ 
      success: false, 
      message: 'सुरक्षित प्रवेश: फक्त अधिकृत मालक (पप्पू  बागूल) फोटो अपलोड करू शकतात. योग्य Admin PIN आवश्यक आहे.' 
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// ----------------- ROUTES -----------------

// 1. Settings Endpoints
app.get(['/api/settings', '/settings'], async (req, res) => {
  try {
    const settings = await readSettings();
    const { adminPin, ...safeSettings } = settings;
    res.json({ success: true, settings: safeSettings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post(['/api/admin/verify', '/admin/verify'], async (req, res) => {
  try {
    const { pin } = req.body;
    const settings = await readSettings();
    const validPin = settings.adminPin || 'samarth2026';
    if (pin && pin === validPin) {
      return res.json({ success: true, message: 'Admin verified successfully' });
    }
    return res.status(401).json({ success: false, message: 'Invalid Admin PIN' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put(['/api/settings', '/settings'], requireAdminAuth, async (req, res) => {
  try {
    const { pin, ...newSettings } = req.body;
    const current = await readSettings();
    const updated = { ...current, ...newSettings };
    await writeSettings(updated);
    const { adminPin, ...safeSettings } = updated;
    res.json({ success: true, settings: safeSettings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Upload Endpoint
app.post(['/api/upload', '/upload'], upload.array('images', 50), requireAdminAuth, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No image files uploaded' });
    }

    const uploadStore = getBlobStore('uploads');
    const uploadedFiles = [];

    for (const file of req.files) {
      const ext = path.extname(file.originalname) || '.jpg';
      const filename = `img_${Date.now()}_${Math.floor(Math.random() * 10000)}${ext}`;

      // Convert to clean data URI (works everywhere on Netlify without filesystem)
      const dataUri = `data:${file.mimetype || 'image/jpeg'};base64,${file.buffer.toString('base64')}`;

      // Also try saving to Blobs if available
      if (uploadStore) {
        try {
          await uploadStore.set(filename, file.buffer, {
            metadata: { contentType: file.mimetype }
          });
        } catch (e) {}
      }

      uploadedFiles.push({
        filename,
        originalname: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        url: uploadStore ? `/uploads/${filename}` : dataUri
      });
    }

    res.json({
      success: true,
      count: uploadedFiles.length,
      files: uploadedFiles
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, message: err.message || 'File upload failed' });
  }
});

// 3. Products Endpoints
app.get(['/api/products', '/products'], async (req, res) => {
  try {
    const { category, search, diwaliOnly, sort } = req.query;
    let products = await readProducts();

    if (category && category !== 'all') {
      products = products.filter(p => (p.category || '').toLowerCase() === category.toLowerCase());
    }

    if (diwaliOnly === 'true') {
      products = products.filter(p => p.isDiwaliSpecial === true);
    }

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(q)) ||
        (p.fabric && p.fabric.toLowerCase().includes(q))
      );
    }

    if (sort === 'newest') {
      products.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else {
      products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    res.json({ success: true, count: products.length, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get(['/api/products/:id', '/products/:id'], async (req, res) => {
  try {
    const products = await readProducts();
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create single product
app.post(['/api/products', '/products'], requireAdminAuth, async (req, res) => {
  try {
    const products = await readProducts();
    const productData = req.body;

    const newProduct = {
      id: productData.id || `prod_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      title: productData.title || 'नवीन उत्सवी वस्त्र',
      category: productData.category || 'sarees',
      subCategory: productData.subCategory || 'उत्सवी पोशाख',
      isDiwaliSpecial: productData.isDiwaliSpecial === true || productData.isDiwaliSpecial === 'true',
      rating: 4.8 + Math.round(Math.random() * 2) / 10,
      reviewsCount: Math.floor(Math.random() * 40) + 12,
      images: Array.isArray(productData.images) && productData.images.length > 0
        ? productData.images
        : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
      sizes: Array.isArray(productData.sizes) && productData.sizes.length > 0
        ? productData.sizes
        : (productData.category === 'sarees' ? ['फ्री साइज (५.५ मीटर + ब्लाउज)'] : ['S', 'M', 'L', 'XL']),
      colors: Array.isArray(productData.colors) && productData.colors.length > 0
        ? productData.colors
        : ['उत्सवी रंग'],
      fabric: productData.fabric || 'उत्कृष्ट फॅब्रिक',
      stockStatus: productData.stockStatus || 'उपलब्ध',
      featured: productData.featured || false,
      createdAt: new Date().toISOString()
    };

    products.unshift(newProduct);
    await writeProducts(products);

    res.status(201).json({ success: true, product: newProduct });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Bulk upload + Instant Product Creation
app.post(['/api/products/bulk-upload-create', '/products/bulk-upload-create'], upload.array('images', 50), requireAdminAuth, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'किमान एक फोटो निवडा' });
    }

    const {
      defaultCategory = 'sarees',
      defaultSubCategory = 'शाही फेस्टिव्ह कलेक्शन',
      isDiwaliSpecial = 'true',
      titlePrefix = '',
      defaultSizes = ''
    } = req.body;

    const uploadStore = getBlobStore('uploads');
    const products = await readProducts();
    const newProducts = [];

    const sizesArr = defaultSizes
      ? defaultSizes.split(',').map(s => s.trim()).filter(Boolean)
      : (defaultCategory === 'sarees' ? ['फ्री साइज (५.५ मीटर + ब्लाउज)'] : ['S', 'M', 'L', 'XL']);

    for (let idx = 0; idx < req.files.length; idx++) {
      const file = req.files[idx];
      const ext = path.extname(file.originalname) || '.jpg';
      const filename = `bulk_${Date.now()}_${idx}_${Math.floor(Math.random() * 10000)}${ext}`;

      // Convert to self-contained Base64 data URI (guarantees images render without external filesystem)
      const dataUri = `data:${file.mimetype || 'image/jpeg'};base64,${file.buffer.toString('base64')}`;

      let imageUrl = dataUri;

      // If Blobs is enabled on the Netlify site, save and use /uploads/ path
      if (uploadStore) {
        try {
          await uploadStore.set(filename, file.buffer, {
            metadata: { contentType: file.mimetype }
          });
          imageUrl = `/uploads/${filename}`;
        } catch (e) {
          imageUrl = dataUri; // gracefully fallback to dataUri
        }
      }

      const cleanOriginal = path.basename(file.originalname, ext)
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());

      const title = titlePrefix
        ? `${titlePrefix} #${idx + 1}`
        : `${cleanOriginal || `नवीन उत्सवी वस्त्र #${idx + 1}`}`;

      const item = {
        id: `prod_${Date.now()}_${idx}_${Math.floor(Math.random() * 1000)}`,
        title,
        category: defaultCategory.toLowerCase(),
        subCategory: defaultSubCategory,
        isDiwaliSpecial: isDiwaliSpecial === 'true' || isDiwaliSpecial === true,
        rating: 4.8 + (idx % 3) * 0.1,
        reviewsCount: 15 + (idx * 5) % 40,
        images: [imageUrl],
        sizes: sizesArr,
        colors: ['उत्सवी रंग'],
        fabric: defaultCategory === 'sarees' ? 'रेशीम सिल्क' : 'प्रीमियम कॉटन',
        stockStatus: 'उपलब्ध',
        featured: idx < 3,
        createdAt: new Date().toISOString()
      };

      newProducts.push(item);
      products.unshift(item);
    }

    await writeProducts(products);

    res.status(201).json({
      success: true,
      message: `${newProducts.length} फोटो थेट अपलोड झाले!`,
      count: newProducts.length,
      products: newProducts
    });
  } catch (err) {
    console.error('Bulk upload & create error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update product
app.put(['/api/products/:id', '/products/:id'], requireAdminAuth, async (req, res) => {
  try {
    const products = await readProducts();
    const index = products.findIndex(p => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updated = {
      ...products[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    products[index] = updated;
    await writeProducts(products);

    res.json({ success: true, product: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete single product
app.delete(['/api/products/:id', '/products/:id'], requireAdminAuth, async (req, res) => {
  try {
    let products = await readProducts();
    const target = products.find(p => p.id === req.params.id);

    if (!target) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const uploadStore = getBlobStore('uploads');
    if (uploadStore && Array.isArray(target.images)) {
      for (const imgUrl of target.images) {
        if (imgUrl.startsWith('/uploads/')) {
          const fn = path.basename(imgUrl);
          try {
            await uploadStore.delete(fn);
          } catch {}
        }
      }
    }

    products = products.filter(p => p.id !== req.params.id);
    await writeProducts(products);

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Clear all products
app.delete(['/api/products-clear-all', '/products-clear-all'], requireAdminAuth, async (req, res) => {
  try {
    await writeProducts([]);
    res.json({ success: true, message: 'All products cleared successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Serve uploaded image from Netlify Blobs if requested
app.get(['/uploads/:filename', '/api/uploads/:filename'], async (req, res) => {
  try {
    const uploadStore = getBlobStore('uploads');
    if (!uploadStore) return res.status(404).send('Image store unavailable');

    const filename = req.params.filename;
    const blob = await uploadStore.get(filename, { type: 'arrayBuffer' });
    if (!blob) return res.status(404).send('Image not found');

    const metadata = await uploadStore.getMetadata(filename);
    res.setHeader('Content-Type', metadata?.metadata?.contentType || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(Buffer.from(blob));
  } catch (err) {
    console.error('Error serving blob image:', err);
    res.status(404).send('Image not found');
  }
});

// Global Express Error Handler - Guarantees JSON response, NEVER empty body
app.use((err, req, res, next) => {
  console.error('Unhandled Netlify API error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Server error occurred'
  });
});

module.exports.handler = serverless(app, {
  binary: ['image/*', 'multipart/form-data', '*/*']
});
