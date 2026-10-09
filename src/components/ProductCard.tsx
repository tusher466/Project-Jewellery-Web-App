import React, { useState } from 'react';
import { JewelryItem } from '../types';
import { Language, translations } from '../i18n/translations';
import { formatBDT } from '../services/marketRates';
import { MessageSquare, ArrowUpRight, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface ProductCardProps {
  lang: Language;
  product: JewelryItem;
  onSelectProduct: (product: JewelryItem) => void;
  onOpenInquiry: (product: JewelryItem) => void;
  onOpenCheckout: (product: JewelryItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  lang,
  product,
  onSelectProduct,
  onOpenInquiry,
  onOpenCheckout,
}) => {
  const isBn = lang === 'bn';
  const t = translations[lang];
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group relative flex flex-col bg-[#141520] border border-slate-800/80 hover:border-[#d4af37]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/70 cursor-pointer"
    >
      {/* Product Image Area */}
      <div className="relative aspect-4/3 w-full bg-[#0a0b10] overflow-hidden">
        <img
          src={product.images[activeImageIdx] || product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Hallmark Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#0e1017]/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#d4af37]/35 text-[11px] text-[#f3e5ab] font-bold shadow-md">
          <span>{product.metal.replace(/-/g, ' ').toUpperCase()}</span>
        </div>

        {/* Shop Stock Status Badge */}
        {product.stockStatus && (
          <div
            className={`absolute top-3 right-3 px-2 py-0.5 rounded-lg text-[10px] font-bold tracking-wide backdrop-blur-md shadow-md border ${
              product.stockStatus === 'sold-out'
                ? 'bg-red-950/85 text-red-300 border-red-500/50'
                : product.stockStatus === 'low-stock'
                ? 'bg-amber-950/85 text-amber-300 border-amber-500/50'
                : product.stockStatus === 'made-to-order'
                ? 'bg-sky-950/85 text-sky-300 border-sky-500/50'
                : 'bg-emerald-950/85 text-emerald-300 border-emerald-500/50'
            }`}
          >
            {product.stockStatus === 'sold-out'
              ? (isBn ? 'স্টক শেষ' : 'Sold Out')
              : product.stockStatus === 'low-stock'
              ? (isBn ? 'সীমিত স্টক' : 'Low Stock')
              : product.stockStatus === 'made-to-order'
              ? (isBn ? 'অর্ডারে তৈরি' : 'Made to Order')
              : (isBn ? 'মজুত আছে' : 'In Stock')}
          </div>
        )}

        {/* Multi-image arrows (appear on hover) */}
        {product.images.length > 1 && (
          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
              onClick={handlePrevImage}
              className="p-1.5 rounded-full bg-black/75 hover:bg-black text-white text-xs backdrop-blur-sm transition-transform active:scale-95 cursor-pointer"
              title="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="p-1.5 rounded-full bg-black/75 hover:bg-black text-white text-xs backdrop-blur-sm transition-transform active:scale-95 cursor-pointer"
              title="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Quick View Button Hover Overlay on Image */}
        <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center p-4 pointer-events-none group-hover:pointer-events-auto z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="px-4 py-2.5 rounded-full bg-[#12131e]/90 hover:bg-[#d4af37] text-white hover:text-slate-950 border border-[#d4af37]/60 font-bold text-xs tracking-wider flex items-center gap-2 backdrop-blur-md shadow-2xl transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 cursor-pointer"
          >
            <Eye className="h-4 w-4" />
            <span>{t.quickView}</span>
          </button>
        </div>

        {/* Thumbnail Dots */}
        <div className="absolute bottom-2.5 inset-x-0 flex justify-center gap-1 z-10">
          {product.images.slice(0, 5).map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                activeImageIdx === idx ? 'w-4 bg-[#d4af37]' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Metadata & Content */}
      <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
        <div className="space-y-1.5">
          {/* Metadata Line */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300">
              {product.weightGrams}g ({product.weightVhori || 1} {isBn ? 'ভরি' : 'Vhori'})
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-medium">
              {t.stockLabel} {isBn ? 'উপলব্ধ' : product.stock}
            </span>
          </div>

          <h3 className="text-base font-bold text-white group-hover:text-[#f3e5ab] transition-colors leading-snug">
            {isBn && product.nameBn ? product.nameBn : product.name}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {isBn && product.descriptionBn ? product.descriptionBn : product.description}
          </p>
        </div>

        {/* Price & Actions Baseline */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase block font-medium">
              {t.acquisitionPrice}
            </span>
            <div className="text-lg font-bold text-[#f3e5ab] font-mono-numbers">
              {formatBDT(product.price, isBn)}
            </div>
          </div>

          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {/* Quick View Button in Action Bar */}
            <button
              type="button"
              onClick={() => onSelectProduct(product)}
              className="p-2 rounded-xl bg-[#1a1c2a] hover:bg-[#d4af37]/20 text-slate-300 hover:text-[#f3e5ab] border border-slate-700/80 hover:border-[#d4af37]/50 transition-colors cursor-pointer flex items-center gap-1"
              title={t.quickView}
            >
              <Eye className="h-4 w-4 text-[#d4af37]" />
              <span className="text-[11px] font-semibold hidden md:inline">{t.quickView}</span>
            </button>
            <button
              onClick={() => onOpenInquiry(product)}
              className="p-2 rounded-xl bg-[#1a1c2a] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-colors cursor-pointer"
              title={t.messageOwner}
            >
              <MessageSquare className="h-4 w-4 text-[#d4af37]" />
            </button>
            <button
              onClick={() => onOpenCheckout(product)}
              className="px-3 py-1.5 bg-[#d4af37] hover:bg-[#e5c158] text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
              title={t.orderNow}
            >
              <span>{t.orderNow}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
