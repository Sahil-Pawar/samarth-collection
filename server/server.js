const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure upload directory exists
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Data paths
const DATA_DIR = path.join(__dirname, '..', 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Helper to read JSON
function readJSON(file, fallback = []) {
  try {
    if (!fs.existsSync(file)) return fallback;
    const content = fs.readFileSync(file, 'utf-8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.error(`Error reading ${file}:`, err);
    return fallback;
  }
}

// Helper to write JSON
function writeJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing to ${file}:`, err);
    return false;
  }
}

// Multer Storage Configuration for bulk and single uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    // Sanitize and append timestamp + random suffix to prevent collisions
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const ext = path.extname(cleanName);
    const base = path.basename(cleanName, ext);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, `${base}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif|avif/i;
  const isExt = allowed.test(path.extname(file.originalname).toLowerCase());
  const isMime = allowed.test(file.mimetype);
  if (isExt && isMime) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, webp, gif, avif) are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB per file
  fileFilter: fileFilter
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static uploaded images
app.use('/uploads', express.static(UPLOADS_DIR));

// Admin Security Middleware — Ensures only authorized client can upload or manage products
function requireAdminAuth(req, res, next) {
  const settings = readJSON(SETTINGS_FILE, { adminPin: 'samarth2026' });
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
}

// ----------------- ROUTES -----------------

// 1. Settings Endpoints
app.get('/api/settings', (req, res) => {
  const settings = readJSON(SETTINGS_FILE, {});
  // Do not expose admin PIN directly in GET
  const { adminPin, ...safeSettings } = settings;
  res.json({ success: true, settings: safeSettings });
});

app.post('/api/admin/verify', (req, res) => {
  const { pin } = req.body;
  const settings = readJSON(SETTINGS_FILE, { adminPin: 'samarth2026' });
  const validPin = settings.adminPin || 'samarth2026';
  if (pin && pin === validPin) {
    return res.json({ success: true, message: 'Admin verified successfully' });
  }
  return res.status(401).json({ success: false, message: 'Invalid Admin PIN' });
});

app.put('/api/settings', requireAdminAuth, (req, res) => {
  const { pin, ...newSettings } = req.body;
  const current = readJSON(SETTINGS_FILE, {});
  const updated = { ...current, ...newSettings };
  writeJSON(SETTINGS_FILE, updated);
  const { adminPin, ...safeSettings } = updated;
  res.json({ success: true, settings: safeSettings });
});

// 2. Upload Endpoint (Single or Bulk Files) - Protected by requireAdminAuth
app.post('/api/upload', upload.array('images', 50), requireAdminAuth, (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No image files uploaded' });
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      // Serve relative path or absolute path
      url: `/uploads/${file.filename}`,
      fullUrl: `${protocol}://${host}/uploads/${file.filename}`
    }));

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
app.get('/api/products', (req, res) => {
  const { category, search, diwaliOnly, sort } = req.query;
  let products = readJSON(PRODUCTS_FILE, []);

  // Filter by category
  if (category && category !== 'all') {
    products = products.filter(p => (p.category || '').toLowerCase() === category.toLowerCase());
  }

  // Filter by Diwali special
  if (diwaliOnly === 'true') {
    products = products.filter(p => p.isDiwaliSpecial === true);
  }

  // Search filter (title, description, subCategory, fabric)
  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p =>
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.subCategory && p.subCategory.toLowerCase().includes(q)) ||
      (p.fabric && p.fabric.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (sort === 'price-low') {
    products.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
  } else if (sort === 'price-high') {
    products.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
  } else if (sort === 'newest') {
    products.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  } else if (sort === 'discount') {
    products.sort((a, b) => (Number(b.discountPercent) || 0) - (Number(a.discountPercent) || 0));
  }

  res.json({ success: true, count: products.length, products });
});

app.get('/api/products/:id', (req, res) => {
  const products = readJSON(PRODUCTS_FILE, []);
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, product });
});

// Create single product (Secured for client only)
app.post('/api/products', requireAdminAuth, (req, res) => {
  try {
    const products = readJSON(PRODUCTS_FILE, []);
    const productData = req.body;

    const newProduct = {
      id: productData.id || `prod_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      title: productData.title || 'Untitled Collection Item',
      category: productData.category || 'sarees',
      subCategory: productData.subCategory || 'Festive Wear',
      price: Number(productData.price) || 999,
      originalPrice: Number(productData.originalPrice) || (Number(productData.price) ? Math.round(Number(productData.price) * 1.5) : 1499),
      discountPercent: productData.discountPercent || (
        productData.originalPrice && productData.price
          ? Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100)
          : 30
      ),
      isDiwaliSpecial: productData.isDiwaliSpecial === true || productData.isDiwaliSpecial === 'true',
      tag: productData.tag || (productData.isDiwaliSpecial ? 'Diwali Special' : 'New Arrival'),
      rating: 4.8 + Math.round(Math.random() * 2) / 10,
      reviewsCount: Math.floor(Math.random() * 40) + 12,
      images: Array.isArray(productData.images) && productData.images.length > 0
        ? productData.images
        : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
      description: productData.description || 'Premium festive cloth collection designed with high-grade fabric and authentic craftsmanship.',
      sizes: Array.isArray(productData.sizes) && productData.sizes.length > 0
        ? productData.sizes
        : (productData.category === 'sarees' ? ['Free Size (5.5m + Blouse)'] : ['S', 'M', 'L', 'XL']),
      colors: Array.isArray(productData.colors) && productData.colors.length > 0
        ? productData.colors
        : ['Festive Special'],
      fabric: productData.fabric || 'Festive Quality Fabric',
      stockStatus: productData.stockStatus || 'In Stock',
      featured: productData.featured || false,
      createdAt: new Date().toISOString()
    };

    products.unshift(newProduct);
    writeJSON(PRODUCTS_FILE, products);

    res.status(201).json({ success: true, product: newProduct });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// BULK UPLOAD + INSTANT PRODUCT CREATION (Secured for client only)
app.post('/api/products/bulk-upload-create', upload.array('images', 50), requireAdminAuth, (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded' });
    }

    const {
      defaultCategory = 'sarees',
      defaultSubCategory = 'Festive Collection',
      defaultPrice = 1999,
      defaultOriginalPrice = 3499,
      isDiwaliSpecial = 'true',
      defaultTag = 'Diwali Dhamaka',
      titlePrefix = ''
    } = req.body;

    const products = readJSON(PRODUCTS_FILE, []);
    const newProducts = [];

    req.files.forEach((file, idx) => {
      const cleanOriginal = path.basename(file.originalname, path.extname(file.originalname))
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());

      const title = titlePrefix
        ? `${titlePrefix} - ${cleanOriginal || `Item #${idx + 1}`}`
        : `${defaultCategory.toUpperCase()} - ${cleanOriginal || `Festive Item #${idx + 1}`}`;

      const price = Number(defaultPrice) || 1999;
      const originalPrice = Number(defaultOriginalPrice) || Math.round(price * 1.6);
      const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);

      const item = {
        id: `prod_${Date.now()}_${idx}_${Math.floor(Math.random() * 1000)}`,
        title,
        category: defaultCategory.toLowerCase(),
        subCategory: defaultSubCategory,
        price,
        originalPrice,
        discountPercent,
        isDiwaliSpecial: isDiwaliSpecial === 'true' || isDiwaliSpecial === true,
        tag: defaultTag || 'Diwali Special',
        rating: 4.8 + (idx % 3) * 0.1,
        reviewsCount: 15 + (idx * 5) % 40,
        images: [`/uploads/${file.filename}`],
        description: `Stunning ${defaultCategory} outfit perfect for Diwali celebrations. High-definition fabric, elegant silhouette, and festive sheen.`,
        sizes: defaultCategory === 'sarees'
          ? ['Free Size (5.5m + Blouse)']
          : (defaultCategory === 'kids' ? ['2-3 Yrs', '4-5 Yrs', '6-7 Yrs', '8-9 Yrs'] : ['M', 'L', 'XL', 'XXL']),
        colors: ['Festive Festive'],
        fabric: defaultCategory === 'sarees' ? 'Silk Blend' : 'Premium Cotton Blend',
        stockStatus: 'In Stock',
        featured: idx < 3,
        createdAt: new Date().toISOString()
      };

      newProducts.push(item);
      products.unshift(item);
    });

    writeJSON(PRODUCTS_FILE, products);

    res.status(201).json({
      success: true,
      message: `Successfully created ${newProducts.length} products from bulk upload!`,
      count: newProducts.length,
      products: newProducts
    });
  } catch (err) {
    console.error('Bulk upload & create error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update product (Secured for client only)
app.put('/api/products/:id', requireAdminAuth, (req, res) => {
  const products = readJSON(PRODUCTS_FILE, []);
  const index = products.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const updated = {
    ...products[index],
    ...req.body,
    price: Number(req.body.price) || products[index].price,
    originalPrice: Number(req.body.originalPrice) || products[index].originalPrice,
    updatedAt: new Date().toISOString()
  };

  if (updated.originalPrice && updated.price) {
    updated.discountPercent = Math.round(((updated.originalPrice - updated.price) / updated.originalPrice) * 100);
  }

  products[index] = updated;
  writeJSON(PRODUCTS_FILE, products);

  res.json({ success: true, product: updated });
});

// Delete product (Secured for client only)
app.delete('/api/products/:id', requireAdminAuth, (req, res) => {
  let products = readJSON(PRODUCTS_FILE, []);
  const target = products.find(p => p.id === req.params.id);

  if (!target) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // Remove local uploaded image file if it belongs to local /uploads
  if (Array.isArray(target.images)) {
    target.images.forEach(imgUrl => {
      if (imgUrl.startsWith('/uploads/')) {
        const filePath = path.join(UPLOADS_DIR, path.basename(imgUrl));
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (e) {
            console.warn('Failed to delete image file:', filePath, e.message);
          }
        }
      }
    });
  }

  products = products.filter(p => p.id !== req.params.id);
  writeJSON(PRODUCTS_FILE, products);

  res.json({ success: true, message: 'Product deleted successfully' });
});

// Clear all products (Secured for client only)
app.delete('/api/products-clear-all', requireAdminAuth, (req, res) => {
  try {
    if (fs.existsSync(UPLOADS_DIR)) {
      const files = fs.readdirSync(UPLOADS_DIR);
      for (const file of files) {
        fs.unlinkSync(path.join(UPLOADS_DIR, file));
      }
    }
  } catch (e) {
    console.warn('Error clearing uploads dir:', e.message);
  }

  writeJSON(PRODUCTS_FILE, []);
  res.json({ success: true, message: 'All products and uploaded images cleared successfully' });
});

// Reset demo catalog
app.post('/api/products/reset-demo', (req, res) => {
  // Can reload sample data if requested
  res.json({ success: true, message: 'Catalog active' });
});

// Production: serve built client app
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.use((req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🪔 UTSAV Cloth Collection Server running on port ${PORT}`);
  console.log(`📁 Uploads available at: http://localhost:${PORT}/uploads`);
  console.log(`🛍️ API available at: http://localhost:${PORT}/api/products`);
});
