# 🪔 UTSAV VASTRA - Festive Diwali Cloth Collection Website

A modern, responsive, mobile-first festive clothing collection web application specially designed for **Diwali**. Built with **React 19 + Vite + Tailwind CSS** on the frontend and an **Express.js** backend with persistent JSON storage and direct multi-file & bulk image upload capabilities.

---

## ✨ Features

### 🥻 Complete Clothing Collections
- **Sarees**: Royal Banarasi Silk, Peacock Teal Kanjeevaram, Sheer Mustard Organza, Rajasthani Bandhani Georgette.
- **Kids Wear**: 
  - **Boys**: Embroidered Kurta & Pant Sets with Brocade Vests, Festive Printed Shirts & Trousers.
  - **Girls**: Golden Yellow & Pink Festive Lehenga Cholis, Ruby Red Anarkali Frocks.
- **Men's Apparel**: Royal Wine Embroidered Silk Kurtas, Festive Gold Jacquard Shirts, Classic Linen-Cotton Shirts, Raw Silk Kurtas with Chinos.
- **Diwali Specials**: Flat 40% - 50% discount tags, sparkling badges, and countdown offers.

### 🚀 Direct Server Bulk Media Upload (Client-Ready)
- **Bulk Image Uploader**: Drag & drop or select **5, 10, 20+ images** received from clients at once.
- **Automatic Catalog Generation**: Uploaded photos are stored on the server's `/uploads` folder and immediately published to the live store with customizable default categories, styles, pricing, and Diwali Special flags.
- **Single Product Editor**: Add individual custom products with multi-image support or external URLs.
- **Catalog Management**: Quick price updates, stock status toggles, and deletion.

### 📱 Mobile-First & Intuitive Experience
- App-like **Mobile Bottom Navigation Bar** (Home, Sarees, Diwali specials, Wishlist, Cart, Admin).
- **Responsive 2-column mobile grid** like top fashion ecommerce apps (Myntra/Ajio).
- **Product Quick View Modal** with multi-image thumbnail gallery, size selector, and fabric details.
- **Cart & Wishlist Drawers** with persistent localStorage.

### 💬 1-Click WhatsApp Ordering & Inquiry
- Every product features a **"WhatsApp Order"** button that opens a prefilled WhatsApp message with product title, code, price, and chosen size.
- **WhatsApp Cart Checkout**: Formats the entire cart order with savings calculations and sends it straight to the store owner's WhatsApp number.

### 🪔 Diwali Festive Atmosphere
- Deep royal burgundy, crimson maroon, and warm golden color palette.
- Animated glowing Diya lamps (`diya-flame`).
- Interactive Diwali fireworks and sparkles (`canvas-confetti`).

---

## 🛠️ Project Structure

```
d:\Cloth Project\
├── client/                     # Frontend (React 19, Vite, Tailwind CSS, Lucide)
│   ├── src/
│   │   ├── components/         # Navbar, DiwaliHero, ProductGrid, ProductModal,
│   │   │                       # CartDrawer, WishlistDrawer, AdminModal, etc.
│   │   ├── context/            # StoreContext (state, cart, filters, WhatsApp)
│   │   ├── utils/              # whatsapp.js (message links builder)
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── dist/                   # Production build
│   └── vite.config.js
├── data/
│   ├── products.json           # Catalog database
│   └── settings.json           # WhatsApp number, store announcement, admin PIN
├── server/
│   ├── uploads/                # Direct image storage for client uploads
│   └── server.js               # Express API & static file server
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Run in Development Mode
Starts both the Express API (port 5000) and the Vite hot-reloading client (port 5173):
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 2. Run in Production Mode
Builds the client and serves everything from a single Express server:
```bash
npm run build
npm start
```
Open **`http://localhost:5000`** in your browser.

---

## 🔐 Admin & Bulk Upload Portal

- Click **"Upload & Admin"** in the top navigation or the bottom mobile bar.
- Enter the Admin PIN:
  - **Default PIN:** `diwali2026` or `1234`
- You can change your WhatsApp Business Number, store announcement, and Admin PIN in the **WhatsApp & Settings** tab.
