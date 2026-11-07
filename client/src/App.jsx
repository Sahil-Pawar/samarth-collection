import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import OwnerTopBanner from './components/OwnerTopBanner';
import FestiveBanner from './components/FestiveBanner';
import Navbar from './components/Navbar';
import DiwaliHero from './components/DiwaliHero';
import CategoryNav from './components/CategoryNav';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import AdminModal from './components/AdminModal';
import MobileBottomNav from './components/MobileBottomNav';
import ProductDetailPage from './components/ProductDetailPage';
import AdminPage from './pages/AdminPage';

/* ── Shell ── wraps all pages with common navbar, drawers, footer */
function Shell({ children }) {
  return (
    <div className="min-h-screen bg-[#0D0B12] text-amber-50 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Owner Top Banner appears ONLY when the owner is logged in */}
      <OwnerTopBanner />
      <FestiveBanner />
      <Navbar />

      <main className="flex-1">
        {children}
      </main>

      <Footer />

      {/* Global Drawers & Modals */}
      <CartDrawer />
      <WishlistDrawer />
      <AdminModal />
      <MobileBottomNav />
    </div>
  );
}

/* ── Home Page ── */
function HomePage() {
  return (
    <>
      <DiwaliHero />
      <CategoryNav />
      <ProductGrid />
    </>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Shell>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            {/* Dedicated Owner Portal routes */}
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/owner" element={<AdminPage />} />
            {/* Fallback */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Shell>
      </BrowserRouter>
    </StoreProvider>
  );
}
