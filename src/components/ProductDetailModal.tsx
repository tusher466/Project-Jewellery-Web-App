import React, { useState, useEffect } from 'react';
import { JewelryItem } from '../types';
import { Language, translations } from '../i18n/translations';
import { formatBDT } from '../services/marketRates';
import { X, MessageSquare, ShieldCheck, Truck, ChevronLeft, ChevronRight, Eye, Sparkles } from 'lucide-react';

interface ProductDetailModalProps {
  lang: Language;
  isOpen: boolean;
  product: JewelryItem | null;
  onClose: () => void;
  onOpenInquiry: (product: JewelryItem) => void;
  onOpenCheckout: (product: JewelryItem) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  lang,
  isOpen,
  product,
  onClose,
  onOpenInquiry,
  onOpenCheckout,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset image index when switching products
  useEffect(() => {
    setActiveImageIndex(0);
  }, [product?.id]);

  if (!isOpen || !product) return null;
  const isBn = lang === 'bn';
  const t = translations[lang];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl my-6 bg-[#12131b] border border-[#d4af37]/35 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
      >
        {/* Top Bar with Quick View indicator */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-[#161824]">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f3e5ab] text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <Eye className="h-3.5 w-3.5 text-[#d4af37]" />
              <span>{isBn ? 'কুইক ভিউ' : 'Quick View'}</span>
            </span>
            <span className="text-[11px] font-mono-numbers text-slate-400 tracking-wider uppercase font-semibold">
              {product.sku}
            </span>
            <span className="text-slate-600 hidden sm:inline">/</span>
            <span className="text-xs text-slate-300 tracking-wide font-medium hidden sm:inline">
              {isBn && product.collectionBn ? product.collectionBn : product.collection}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title={isBn ? 'বন্ধ করুন (Esc)' : 'Close Quick View (Esc)'}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto">
          {/* Visual Presentation Column */}
          <div className="space-y-4">
            <div className="space-y-3">
              {/* Main Hero Photo View */}
              <div className="relative aspect-square w-full rounded-2xl bg-black border border-slate-800 overflow-hidden group">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={`${product.name} view ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Prev/Next buttons */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveImageIndex((prev) =>
                          prev === 0 ? product.images.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-black text-white border border-slate-700 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        setActiveImageIndex((prev) =>
                          prev === product.images.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-black text-white border border-slate-700 transition-colors cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-2.5 left-2.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] text-slate-300 border border-slate-700">
                  {t.perspectiveOf} {activeImageIndex + 1} / {product.images.length}
                </div>
              </div>

              {/* Thumbnails row */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#d4af37] ring-2 ring-[#d4af37]/40 scale-105'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Angle ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Details & Action Column */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-1.5">
                  <span className="font-bold text-slate-300">{product.metal.replace(/-/g, ' ').toUpperCase()}</span>
                  <span aria-hidden="true">·</span>
                  <span>{product.weightGrams}g ({product.weightVhori || 1} {isBn ? 'ভরি' : 'Vhori'})</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-300 font-medium">{t.stockLabel} {product.stock}</span>
                  {product.stockStatus && (
                    <span
                      className={`ml-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        product.stockStatus === 'sold-out'
                          ? 'bg-red-950/70 text-red-300 border-red-500/50'
                          : product.stockStatus === 'low-stock'
                          ? 'bg-amber-950/70 text-amber-300 border-amber-500/50'
                          : product.stockStatus === 'made-to-order'
                          ? 'bg-sky-950/70 text-sky-300 border-sky-500/50'
                          : 'bg-emerald-950/70 text-emerald-300 border-emerald-500/50'
                      }`}
                    >
                      {product.stockStatus === 'sold-out'
                        ? (isBn ? 'স্টক শেষ (Sold Out)' : 'Sold Out')
                        : product.stockStatus === 'low-stock'
                        ? (isBn ? 'সীমিত স্টক (Low Stock)' : 'Low Stock')
                        : product.stockStatus === 'made-to-order'
                        ? (isBn ? 'অর্ডারে তৈরি (Made to Order)' : 'Made to Order')
                        : (isBn ? 'মজুত আছে (In Stock)' : 'In Stock')}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
                  {isBn && product.nameBn ? product.nameBn : product.name}
                </h2>
              </div>

              {/* Price Banner in BDT */}
              <div className="p-4 rounded-2xl bg-[#181a26] border border-slate-800 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">{t.acquisitionPrice}</span>
                  <span className="text-3xl font-bold text-[#f3e5ab] font-mono-numbers">
                    {formatBDT(product.price, isBn)}
                  </span>
                </div>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm line-through text-slate-500 font-mono-numbers">
                    {formatBDT(product.originalPrice, isBn)}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {isBn ? 'গহনার বিবরণ ও গঠন' : 'Design & Craftsmanship'}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isBn && product.descriptionBn ? product.descriptionBn : product.description}
                </p>
              </div>

              {/* Craftsmanship & Certification */}
              <div className="p-3.5 bg-[#141520] rounded-2xl border border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-[#d4af37] font-semibold">
                  <Sparkles className="h-4 w-4" />
                  <span>{isBn ? 'বাজুস অনুমোদিত হলমার্ক সনদ' : 'BAJUS 916 Hallmark Certified'}</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {isBn && product.craftsmanshipNotesBn ? product.craftsmanshipNotesBn : product.craftsmanshipNotes}
                </p>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{t.ethicalOrigin}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-sky-400" />
                  <span>{t.armoredCourier}</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5 pt-4 border-t border-slate-800">
              <button
                onClick={() => onOpenCheckout(product)}
                className="w-full py-3 px-4 bg-[#d4af37] hover:bg-[#e5c158] text-slate-950 font-bold rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-[#d4af37]/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>{t.orderNow} ({formatBDT(product.price, isBn)})</span>
              </button>

              <button
                onClick={() => onOpenInquiry(product)}
                className="w-full py-2.5 px-4 bg-[#181a26] hover:bg-[#202234] text-slate-200 border border-slate-700 hover:border-[#d4af37]/60 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <MessageSquare className="h-4 w-4 text-[#d4af37]" />
                <span>{t.messageOwner}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
