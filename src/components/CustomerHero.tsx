import React from 'react';
import { JewelryItem } from '../types';
import { Language, translations } from '../i18n/translations';
import { formatBDT } from '../services/marketRates';
import { TrendingUp, MessageSquare, ArrowRight, ShieldCheck, Gem, Award, Truck } from 'lucide-react';

interface CustomerHeroProps {
  lang: Language;
  featuredItem?: JewelryItem;
  onExploreCollection: () => void;
  onViewLiveRates: () => void;
  onOpenInquiry: () => void;
  onSelectProduct: (item: JewelryItem) => void;
}

export const CustomerHero: React.FC<CustomerHeroProps> = ({
  lang,
  featuredItem,
  onExploreCollection,
  onViewLiveRates,
  onOpenInquiry,
  onSelectProduct,
}) => {
  const isBn = lang === 'bn';
  const t = translations[lang];

  return (
    <section className="relative w-full border-b border-slate-800/80 bg-gradient-to-b from-[#0e0f17] via-[#090a10] to-[#0d0e15] overflow-hidden">
      {/* Background glow & subtle luxury lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#d4af37]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-18 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Editorial Text */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b1d2a] border border-[#d4af37]/30 text-[11px] sm:text-xs text-[#f3e5ab]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold tracking-wider">{t.tagline}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl text-white font-normal leading-[1.25] sm:leading-[1.2] tracking-wide text-balance">
            {t.heroHeadline} <br className="hidden sm:inline" />
            <span className="gold-gradient-text font-bold italic">{t.heroHeadlineAccent}</span>
          </h1>

          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
            {t.heroDescription}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-2.5 sm:gap-3.5">
            <button
              onClick={onExploreCollection}
              className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-[#d4af37] hover:bg-[#e5c158] text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#d4af37]/25 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{t.exploreCollection}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={onViewLiveRates}
              className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 bg-[#181a26] hover:bg-[#222538] text-slate-200 border border-[#d4af37]/40 hover:border-[#d4af37] rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.98]"
            >
              <TrendingUp className="h-4 w-4 text-[#d4af37]" />
              <span>{t.viewLiveRatesBtn}</span>
            </button>

            <button
              onClick={onOpenInquiry}
              className="w-full sm:w-auto px-4 py-2 sm:py-3 text-slate-300 hover:text-[#f3e5ab] text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="h-4 w-4 text-[#d4af37]" />
              <span>{t.directConcierge}</span>
            </button>
          </div>
        </div>

        {/* Right Featured Masterpiece Spotlight */}
        {featuredItem ? (
          <div className="lg:col-span-5 relative">
            <div
              onClick={() => onSelectProduct(featuredItem)}
              className="relative rounded-3xl bg-gradient-to-b from-[#1b1d2c] to-[#12131e] p-3.5 border border-[#d4af37]/35 shadow-2xl overflow-hidden group cursor-pointer"
            >
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-black">
                <img
                  src={featuredItem.images[0]}
                  alt={featuredItem.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute top-3 left-3 bg-[#0d0e14]/90 backdrop-blur-md px-3 py-1 rounded-lg border border-[#d4af37]/40 text-xs text-[#f3e5ab] font-bold">
                  {isBn ? 'বিশেষ ব্রাইডাল গহনা' : 'Featured Bridal Piece'}
                </div>

                <div className="absolute bottom-3 right-3 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-medium">
                    {isBn ? 'মূল্য (টাকা)' : 'Price (BDT)'}
                  </div>
                  <div className="text-base font-bold text-[#f3e5ab] font-mono-numbers">
                    {formatBDT(featuredItem.price, isBn)}
                  </div>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#f3e5ab] transition-colors">
                    {isBn && featuredItem.nameBn ? featuredItem.nameBn : featuredItem.name}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {featuredItem.weightGrams}g ({featuredItem.weightVhori || 1} {isBn ? 'ভরি' : 'Vhori'}) · {featuredItem.metal.replace(/-/g, ' ')}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProduct(featuredItem);
                  }}
                  className="px-4 py-2 bg-[#d4af37] text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm hover:bg-[#e5c158] transition-colors cursor-pointer"
                >
                  <span>{isBn ? 'বিস্তারিত' : 'View'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl bg-gradient-to-b from-[#1b1d2c] to-[#12131e] p-6 sm:p-8 border border-[#d4af37]/35 shadow-2xl overflow-hidden text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                <Gem className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white">
                {isBn ? 'আরকে জুয়েলারি ফাইন গোল্ড অ্যাটেলিয়ার' : 'RK Jewellery Fine Gold Atelier'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isBn
                  ? 'ঢাকা জুয়েলার্স গিল্ড এবং বাজুস মানদণ্ডে ৯১৬ হলমার্ক ২২ ক্যারেট খাঁটি সোনার ঐতিহ্যবাহী ব্রাইডাল কালেকশন।'
                  : 'Hallmark 916 certified 22K pure bridal gold artistry crafted according to highest BAJUS benchmark standards.'}
              </p>
              <div className="p-3 bg-[#0e0f17] rounded-xl border border-slate-800 text-xs text-[#f3e5ab] font-bold">
                {isBn ? 'স্বর্ণমান: ২২ ক্যারেট হলমার্ক ক্যাডমিয়াম (Dhaka Guild 916)' : 'Gold Purity: 22K Hallmark Cadmium (Dhaka Guild 916)'}
              </div>
              <button
                onClick={onViewLiveRates}
                className="w-full py-2.5 bg-[#d4af37] hover:bg-[#e5c158] text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-md shadow-[#d4af37]/20"
              >
                {isBn ? 'আজকের লাইভ রেট দেখুন' : 'Check Today’s Live Rates'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4 Trust & Authenticity Badges */}
      <div className="border-t border-slate-800/80 bg-[#0b0c12]/95 py-4 sm:py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-6 text-left">
          <div className="flex items-center gap-2.5 sm:gap-3 p-2 sm:p-0 rounded-xl bg-slate-900/40 sm:bg-transparent border border-slate-800/60 sm:border-0">
            <div className="p-2 rounded-xl bg-[#d4af37]/15 text-[#d4af37] shrink-0">
              <Award className="h-4 sm:h-5 w-4 sm:w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] sm:text-xs font-bold text-white truncate">{t.trustMarker1}</div>
              <div className="text-[10px] sm:text-[11px] text-slate-400 truncate">{t.trustMarker1Sub}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 p-2 sm:p-0 rounded-xl bg-slate-900/40 sm:bg-transparent border border-slate-800/60 sm:border-0">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 shrink-0">
              <TrendingUp className="h-4 sm:h-5 w-4 sm:w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] sm:text-xs font-bold text-white truncate">{t.trustMarker2}</div>
              <div className="text-[10px] sm:text-[11px] text-slate-400 truncate">{t.trustMarker2Sub}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 p-2 sm:p-0 rounded-xl bg-slate-900/40 sm:bg-transparent border border-slate-800/60 sm:border-0">
            <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400 shrink-0">
              <ShieldCheck className="h-4 sm:h-5 w-4 sm:w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] sm:text-xs font-bold text-white truncate">{t.trustMarker3}</div>
              <div className="text-[10px] sm:text-[11px] text-slate-400 truncate">{t.trustMarker3Sub}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 p-2 sm:p-0 rounded-xl bg-slate-900/40 sm:bg-transparent border border-slate-800/60 sm:border-0">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 shrink-0">
              <Truck className="h-4 sm:h-5 w-4 sm:w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] sm:text-xs font-bold text-white truncate">{t.trustMarker4}</div>
              <div className="text-[10px] sm:text-[11px] text-slate-400 truncate">{t.trustMarker4Sub}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
