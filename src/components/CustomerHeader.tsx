import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { Language, translations } from '../i18n/translations';
import { Lock, TrendingUp, MessageSquare, Globe, Package, Menu, X, Sparkles } from 'lucide-react';

interface CustomerHeaderProps {
  lang: Language;
  onToggleLanguage: () => void;
  isOwnerLoggedIn: boolean;
  onOpenOwnerPortal: () => void;
  onOpenInquiry: () => void;
  onNavigateSection: (section: 'catalog' | 'rates' | 'orders') => void;
}

export const CustomerHeader: React.FC<CustomerHeaderProps> = ({
  lang,
  onToggleLanguage,
  isOwnerLoggedIn,
  onOpenOwnerPortal,
  onOpenInquiry,
  onNavigateSection,
}) => {
  const t = translations[lang];
  const isBn = lang === 'bn';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileNav = (action: () => void) => {
    setIsMobileMenuOpen(false);
    action();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#d4af37]/20 bg-[#0c0d13]/95 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 md:gap-8 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3">
        {/* Zone 1: Brand Wordmark with Emblem Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onNavigateSection('catalog');
          }}
          className="flex items-center gap-2 transition-opacity hover:opacity-90 shrink-0 min-w-0"
        >
          <BrandLogo size="md" subtitle={t.appSubtitle} />
        </a>

        {/* Zone 2: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs tracking-wider uppercase font-semibold text-slate-300">
          <button
            onClick={() => onNavigateSection('catalog')}
            className="hover:text-[#f3e5ab] transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1"
          >
            {t.navCollections}
          </button>
          <button
            onClick={() => onNavigateSection('rates')}
            className="hover:text-[#f3e5ab] text-[#f3e5ab] transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 flex items-center gap-1.5"
          >
            <TrendingUp className="h-3.5 w-3.5 text-[#d4af37]" />
            <span>{t.navLiveRates}</span>
          </button>
          <button
            onClick={onOpenInquiry}
            className="hover:text-[#f3e5ab] transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 flex items-center gap-1.5"
          >
            <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
            <span>{t.navInquiry}</span>
          </button>
          <button
            onClick={() => onNavigateSection('orders')}
            className="hover:text-[#f3e5ab] transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 flex items-center gap-1.5"
          >
            <Package className="h-3.5 w-3.5 text-slate-400" />
            <span>{t.navTracking}</span>
          </button>
        </nav>

        {/* Zone 3: Actions - Language Change Toggle, Owner Login & Mobile Menu Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Language Switcher Toggle */}
          <button
            onClick={onToggleLanguage}
            title={lang === 'en' ? 'বাংলা ভাষায় পরিবর্তন করুন' : 'Switch to English'}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#171926] hover:bg-[#202234] border border-[#d4af37]/35 text-xs text-[#f3e5ab] transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer shadow-sm hover:border-[#d4af37] active:scale-95"
          >
            <Globe className="h-3.5 w-3.5 text-[#d4af37] shrink-0" />
            <span className="font-bold text-[11px] sm:text-xs">{t.languageToggle}</span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 px-1 py-0.2 rounded bg-black/40 font-mono-numbers">
              {lang.toUpperCase()}
            </span>
          </button>

          {/* Owner Dashboard/Login */}
          <button
            onClick={onOpenOwnerPortal}
            className={`px-2.5 sm:px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap shrink-0 cursor-pointer active:scale-95 ${
              isOwnerLoggedIn
                ? 'bg-[#d4af37] text-slate-950 hover:bg-[#e5c158] shadow-md shadow-[#d4af37]/20'
                : 'bg-[#181a26] hover:bg-[#222538] text-slate-200 border border-slate-700 hover:border-[#d4af37]'
            }`}
          >
            <Lock className="h-3.5 w-3.5 text-[#d4af37] shrink-0" />
            <span className="hidden sm:inline">{isOwnerLoggedIn ? t.ownerDashboard : t.ownerLogin}</span>
            <span className="sm:hidden text-[11px]">{isOwnerLoggedIn ? (isBn ? 'মালিক' : 'Owner') : (isBn ? 'লগইন' : 'Login')}</span>
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-xl bg-[#171926] hover:bg-[#202234] border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="h-4 w-4 text-[#d4af37]" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Tray */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#0e101a] px-4 py-3.5 space-y-2 animate-in slide-in-from-top-2 duration-200 shadow-xl">
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              onClick={() => handleMobileNav(() => onNavigateSection('catalog'))}
              className="p-2.5 rounded-xl bg-[#151726] hover:bg-[#1f2238] border border-slate-800 text-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#d4af37]" />
              <span>{t.navCollections}</span>
            </button>
            <button
              onClick={() => handleMobileNav(() => onNavigateSection('rates'))}
              className="p-2.5 rounded-xl bg-[#151726] hover:bg-[#1f2238] border border-[#d4af37]/30 text-[#f3e5ab] flex items-center gap-2 transition-colors cursor-pointer"
            >
              <TrendingUp className="h-3.5 w-3.5 text-[#d4af37]" />
              <span>{t.navLiveRates}</span>
            </button>
            <button
              onClick={() => handleMobileNav(onOpenInquiry)}
              className="p-2.5 rounded-xl bg-[#151726] hover:bg-[#1f2238] border border-slate-800 text-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
              <span>{t.navInquiry}</span>
            </button>
            <button
              onClick={() => handleMobileNav(() => onNavigateSection('orders'))}
              className="p-2.5 rounded-xl bg-[#151726] hover:bg-[#1f2238] border border-slate-800 text-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Package className="h-3.5 w-3.5 text-slate-400" />
              <span>{t.navTracking}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
