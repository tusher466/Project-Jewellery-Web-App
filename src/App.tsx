/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CustomerInquiry, CustomerOrder, JewelryCategory, JewelryItem } from './types';
import {
  getJewelryItems,
  getOrders,
  getInquiries,
  isOwnerAuthenticated,
} from './services/storage';
import { Language, translations } from './i18n/translations';
import { formatBDT, toBnDigits } from './services/marketRates';
import { BrandLogo } from './components/BrandLogo';
import { CustomerHeader } from './components/CustomerHeader';
import { CustomerHero } from './components/CustomerHero';
import { LiveRatesDashboard } from './components/LiveRatesDashboard';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { InquiryModal } from './components/InquiryModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OwnerAuthModal } from './components/OwnerAuthModal';
import { OwnerDashboard } from './components/OwnerDashboard';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import {
  Sparkles,
  Search,
  Gem,
  Lock,
  Globe,
  TrendingUp,
} from 'lucide-react';

export default function App() {
  // Language State: 'en' (Capriola font) | 'bn' (Hind Siliguri font)
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('rk_jewellery_lang');
      return saved === 'bn' ? 'bn' : 'en';
    } catch {
      return 'en';
    }
  });

  const isBn = lang === 'bn';
  const t = translations[lang];

  // Global Data State
  const [items, setItems] = useState<JewelryItem[]>([]);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [isOwnerLoggedIn, setIsOwnerLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<'store' | 'owner-dashboard'>('store');

  // Active Modals
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<JewelryItem | null>(null);
  const [selectedProductForInquiry, setSelectedProductForInquiry] = useState<JewelryItem | null>(null);
  const [isGeneralInquiryOpen, setIsGeneralInquiryOpen] = useState(false);
  const [selectedProductForCheckout, setSelectedProductForCheckout] = useState<JewelryItem | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMetal, setSelectedMetal] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Customer order tracking search
  const [trackingOrderNumber, setTrackingOrderNumber] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<CustomerOrder | null>(null);

  // Apply font & language classes on body
  useEffect(() => {
    if (lang === 'bn') {
      document.body.classList.add('lang-bn');
      document.body.classList.remove('lang-en');
    } else {
      document.body.classList.add('lang-en');
      document.body.classList.remove('lang-bn');
    }
    try {
      localStorage.setItem('rk_jewellery_lang', lang);
    } catch {
      // ignore
    }
  }, [lang]);

  // Initialize data on mount
  useEffect(() => {
    setItems(getJewelryItems());
    setOrders(getOrders());
    setInquiries(getInquiries());
    setIsOwnerLoggedIn(isOwnerAuthenticated());
  }, []);

  const handleToggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'bn' : 'en'));
  };

  // Filter and sort items
  const filteredItems = items
    .filter((item) => {
      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesMetal = selectedMetal === 'all' || item.metal === selectedMetal;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.nameBn && item.nameBn.includes(searchQuery)) ||
        item.collection.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesMetal && matchesSearch;
    })
    .sort((a, b) => {
      if (sortOrder === 'price-asc') return a.price - b.price;
      if (sortOrder === 'price-desc') return b.price - a.price;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });

  const featuredItem = items.find((i) => i.isFeatured) || items[0];

  const handleOpenOwnerPortal = () => {
    if (isOwnerAuthenticated()) {
      setIsOwnerLoggedIn(true);
      setCurrentView('owner-dashboard');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingOrderNumber.trim()) return;
    const found = orders.find(
      (o) => o.orderNumber.toLowerCase() === trackingOrderNumber.trim().toLowerCase()
    );
    setSearchedOrder(found || null);
  };

  // If viewing owner dashboard and authenticated
  if (currentView === 'owner-dashboard' && isOwnerLoggedIn) {
    return (
      <OwnerDashboard
        lang={lang}
        onToggleLanguage={handleToggleLanguage}
        items={items}
        orders={orders}
        inquiries={inquiries}
        onItemsChange={(newItems) => setItems(newItems)}
        onOrdersChange={(newOrders) => setOrders(newOrders)}
        onInquiriesChange={(newInqs) => setInquiries(newInqs)}
        onExitToStore={() => setCurrentView('store')}
      />
    );
  }

  return (
    <div
      className={`min-h-screen bg-[#0c0d13] text-[#e5e7eb] flex flex-col selection:bg-[#d4af37]/30 selection:text-white ${
        lang === 'bn' ? 'lang-bn font-bn' : 'lang-en font-en'
      }`}
    >
      {/* Customer Header */}
      <CustomerHeader
        lang={lang}
        onToggleLanguage={handleToggleLanguage}
        isOwnerLoggedIn={isOwnerLoggedIn}
        onOpenOwnerPortal={handleOpenOwnerPortal}
        onOpenInquiry={() => setIsGeneralInquiryOpen(true)}
        onNavigateSection={(sec) => {
          const el = document.getElementById(sec);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Customer Hero */}
      <CustomerHero
        lang={lang}
        featuredItem={featuredItem}
        onExploreCollection={() => {
          const el = document.getElementById('catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onViewLiveRates={() => {
          const el = document.getElementById('rates');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenInquiry={() => setIsGeneralInquiryOpen(true)}
        onSelectProduct={(p) => setSelectedProductForDetail(p)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-3.5 sm:px-4 md:px-6 py-8 sm:py-12 flex-1 space-y-10 sm:space-y-16 w-full">
        {/* Section 1: Live Gold & Silver Market Rates Dashboard (BAJUS Standard) */}
        <section id="rates">
          <LiveRatesDashboard lang={lang} />
        </section>

        {/* Section 2: Product Catalog & Filters */}
        <section id="catalog" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-bold">
                {isBn ? 'আরকে জুয়েলারি কালেকশন' : 'RK Jewellery Collection'}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mt-1">
                {t.catalogTitle}
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                {t.catalogSubtitle}
              </p>
            </div>

            {/* Search and Sort */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="bg-[#141520] border border-slate-800 focus:border-[#d4af37] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none transition-colors w-56 shadow-sm"
                />
              </div>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'featured' | 'price-asc' | 'price-desc')}
                className="bg-[#141520] border border-slate-800 focus:border-[#d4af37] rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none transition-colors shadow-sm cursor-pointer font-medium"
              >
                <option value="featured">{t.sortFeatured}</option>
                <option value="price-asc">{t.sortPriceAsc}</option>
                <option value="price-desc">{t.sortPriceDesc}</option>
              </select>
            </div>
          </div>

          {/* Interactive Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', label: t.allMasterpieces },
                { id: 'rings', label: t.rings },
                { id: 'necklaces', label: t.necklaces },
                { id: 'bracelets', label: t.bracelets },
                { id: 'earrings', label: t.earrings },
                { id: 'bridal-sets', label: t.bridalSets },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer font-bold ${
                    selectedCategory === cat.id
                      ? 'bg-[#d4af37] text-slate-950 shadow-md shadow-[#d4af37]/20 scale-105'
                      : 'bg-[#141520] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800/80'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Metal Filter */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold">{t.filterMetal}</span>
              <select
                value={selectedMetal}
                onChange={(e) => setSelectedMetal(e.target.value)}
                className="bg-[#141520] border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none cursor-pointer font-medium"
              >
                <option value="all">{t.allMetals}</option>
                <option value="22k-gold">{isBn ? '২২ ক্যারেট সোনা' : '22K Hallmark Gold'}</option>
                <option value="21k-gold">{isBn ? '২১ ক্যারেট সোনা' : '21K Hallmark Gold'}</option>
                <option value="18k-gold">{isBn ? '১৮ ক্যারেট সোনা' : '18K Hallmark Gold'}</option>
                <option value="platinum-950">{isBn ? 'প্লাটিনাম ৯৫০' : 'Platinum 950'}</option>
                <option value="925-silver">{isBn ? 'রূপা (Silver)' : '925 Silver'}</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {items.length === 0 ? (
            <div className="py-16 px-6 text-center bg-gradient-to-b from-[#141522] to-[#0f1019] rounded-3xl border border-[#d4af37]/30 shadow-2xl space-y-4 max-w-2xl mx-auto">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                <Gem className="h-7 w-7" />
              </div>
              <h4 className="text-xl font-bold text-white">
                {isBn ? 'আরকে জুয়েলারি এক্সক্লুসিভ কালেকশন' : 'RK Jewellery Signature Atelier'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                {isBn
                  ? 'আমাদের স্বর্ণকারদের দ্বারা খাঁটি ২২ ক্যারেট হলমার্ক সোনার নতুন ব্রাইডাল সেট ও অলংকার তৈরি হচ্ছে। কাস্টম অর্ডার বা অনুসন্ধানের জন্য সরাসরি আমাদের সাথে হোয়াটসঅ্যাপে যোগাযোগ করুন।'
                  : 'Our master goldsmiths are handcrafting bespoke 22K Hallmark gold bridal sets, rings, and fine jewelry. Reach our concierge directly via WhatsApp or visit our boutique showroom.'}
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={`https://wa.me/8801711234567?text=${encodeURIComponent(
                    isBn ? 'আসসালামু আলাইকুম, আমি আরকে জুয়েলারির কাস্টম গহনা সম্পর্কে জানতে আগ্রহী।' : 'Hello RK Jewellery, I would like to inquire about fine bespoke jewelry.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg transition-colors"
                >
                  <span>{isBn ? 'হোয়াটসঅ্যাপে যোগাযোগ করুন' : 'Inquire on WhatsApp'}</span>
                </a>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-5 py-2.5 bg-[#d4af37]/20 hover:bg-[#d4af37]/35 text-[#f3e5ab] border border-[#d4af37]/50 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  <span>{isBn ? 'মালিকানা লগইন (পণ্য যোগ করুন)' : 'Proprietor Login (Add Items)'}</span>
                </button>
              </div>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {filteredItems.map((product) => (
                <ProductCard
                  key={product.id}
                  lang={lang}
                  product={product}
                  onSelectProduct={(p) => setSelectedProductForDetail(p)}
                  onOpenInquiry={(p) => setSelectedProductForInquiry(p)}
                  onOpenCheckout={(p) => setSelectedProductForCheckout(p)}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-[#141520] rounded-2xl border border-slate-800 space-y-3">
              <Gem className="h-8 w-8 text-slate-600 mx-auto" />
              <h4 className="text-lg text-white font-bold">{t.noProductsFound}</h4>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedMetal('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f3e5ab] rounded-xl text-xs font-bold hover:bg-[#d4af37]/30 transition-colors cursor-pointer"
              >
                {t.resetFilters}
              </button>
            </div>
          )}
        </section>

        {/* Section 3: Customer Acquisitions & Order Tracking */}
        <section id="orders" className="p-6 md:p-8 rounded-3xl bg-[#12131d] border border-slate-800 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-bold">
                {isBn ? 'গ্রাহক সেবা ও ট্র্যাকিং' : 'Client Services'}
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">
                {t.trackingTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {t.trackingSubtitle}
              </p>
            </div>

            {/* Tracking Search Form */}
            <form onSubmit={handleTrackOrder} className="flex gap-2">
              <input
                type="text"
                value={trackingOrderNumber}
                onChange={(e) => setTrackingOrderNumber(e.target.value)}
                placeholder={t.trackingInputPlaceholder}
                className="bg-[#181a28] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37] font-mono-numbers w-56 font-bold"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#d4af37] hover:bg-[#e5c158] text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-md shadow-[#d4af37]/20"
              >
                {t.trackButton}
              </button>
            </form>
          </div>

          {searchedOrder ? (
            <div className="p-5 bg-[#181a28] rounded-2xl border border-[#d4af37]/35 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 pb-3">
                <div>
                  <span className="text-xs text-[#d4af37] font-mono-numbers font-bold">
                    {searchedOrder.orderNumber}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    {isBn ? 'গ্রাহকের নাম: ' : 'Client: '} {searchedOrder.customerName}
                  </h4>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">{t.totalSettled}</div>
                  <div className="text-base font-bold text-[#f3e5ab] font-mono-numbers">
                    {formatBDT(searchedOrder.totalAmount, isBn)}
                  </div>
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {[
                  { key: 'pending', label: t.orderMilestone1 },
                  { key: 'confirmed', label: t.orderMilestone2 },
                  { key: 'in-crafting', label: t.orderMilestone3 },
                  { key: 'shipped', label: t.orderMilestone4 },
                ].map((step, idx) => {
                  const isCurrent = searchedOrder.status === step.key;
                  const isPast =
                    ['pending', 'confirmed', 'in-crafting', 'shipped', 'delivered'].indexOf(searchedOrder.status) >= idx;
                  return (
                    <div
                      key={step.key}
                      className={`p-3 rounded-xl border text-center transition-colors ${
                        isCurrent
                          ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f3e5ab] font-bold shadow-sm'
                          : isPast
                          ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                          : 'bg-[#10111a] border-slate-800 text-slate-600'
                      }`}
                    >
                      {step.label}
                    </div>
                  );
                })}
              </div>

              <div className="text-xs text-slate-300 flex items-center justify-between pt-1">
                <span>{isBn ? 'ডেলিভারি জেলা:' : 'Destination:'} {searchedOrder.city}, {searchedOrder.district}</span>
                {searchedOrder.specialRequirements && (
                  <span className="italic text-amber-300">"{searchedOrder.specialRequirements}"</span>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-[#161826] rounded-2xl border border-slate-800 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
              <span>{isBn ? 'টেস্ট করার জন্য নমুনা অর্ডার নম্বর:' : 'Sample order numbers to test:'} <strong className="text-white font-mono-numbers">RK-2026-501</strong>, <strong className="text-white font-mono-numbers">RK-2026-502</strong></span>
              <button
                onClick={() => {
                  setTrackingOrderNumber('RK-2026-501');
                  setSearchedOrder(orders.find((o) => o.orderNumber === 'RK-2026-501') || null);
                }}
                className="text-[#d4af37] hover:underline font-bold cursor-pointer"
              >
                {t.autofillSample}
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Customer Footer */}
      <footer className="border-t border-slate-800/80 bg-[#090a0f] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <BrandLogo size="md" subtitle={t.tagline} />

          <div className="flex items-center gap-6">
            <button
              onClick={handleToggleLanguage}
              className="text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Globe className="h-3.5 w-3.5 text-[#d4af37]" />
              <span>{isBn ? 'ভাষা: বাংলা (Hind Siliguri)' : 'Language: English (Capriola)'}</span>
            </button>
            <button
              onClick={() => setIsGeneralInquiryOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t.navInquiry}
            </button>
            <button
              onClick={handleOpenOwnerPortal}
              className="text-[#d4af37] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <Lock className="h-3 w-3" />
              <span>{t.ownerLogin}</span>
            </button>
          </div>

          <div className="text-right">
            <span>© {new Date().getFullYear()} RK Jewellery. {isBn ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All rights reserved.'}</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Product Detail Modal */}
      <ProductDetailModal
        lang={lang}
        isOpen={!!selectedProductForDetail}
        product={selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
        onOpenInquiry={(p) => {
          setSelectedProductForDetail(null);
          setSelectedProductForInquiry(p);
        }}
        onOpenCheckout={(p) => {
          setSelectedProductForDetail(null);
          setSelectedProductForCheckout(p);
        }}
      />

      {/* 2. Direct Inquiry Modal */}
      <InquiryModal
        lang={lang}
        isOpen={!!selectedProductForInquiry || isGeneralInquiryOpen}
        product={selectedProductForInquiry}
        onClose={() => {
          setSelectedProductForInquiry(null);
          setIsGeneralInquiryOpen(false);
        }}
        onInquirySubmitted={(inq) => {
          setInquiries((prev) => [inq, ...prev]);
        }}
      />

      {/* 3. Checkout Modal */}
      {selectedProductForCheckout && (
        <CheckoutModal
          lang={lang}
          isOpen={true}
          product={selectedProductForCheckout}
          onClose={() => setSelectedProductForCheckout(null)}
          onOrderPlaced={(newOrder) => {
            setOrders((prev) => [newOrder, ...prev]);
          }}
        />
      )}

      {/* 4. Owner Authentication Modal (Strictly verifies email privately without leaking it!) */}
      <OwnerAuthModal
        lang={lang}
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsOwnerLoggedIn(true);
          setCurrentView('owner-dashboard');
        }}
      />

      {/* Floating WhatsApp Quick Contact Button */}
      <FloatingWhatsApp lang={lang} />
    </div>
  );
}
