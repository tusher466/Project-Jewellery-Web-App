import React, { useState, useEffect } from 'react';
import { LiveMetalRate } from '../types';
import { getLiveRates, refreshMarketRates, formatBDT, toBnDigits } from '../services/marketRates';
import { Language } from '../i18n/translations';
import { EditMarketRatesModal } from './EditMarketRatesModal';
import { TrendingUp, RefreshCw, Calculator, Sparkles, ShieldCheck, Clock, ArrowRight, Edit3 } from 'lucide-react';

interface LiveRatesDashboardProps {
  lang: Language;
}

export const LiveRatesDashboard: React.FC<LiveRatesDashboardProps> = ({ lang }) => {
  const isBn = lang === 'bn';
  const [rates, setRates] = useState<LiveMetalRate[]>(getLiveRates());
  const [viewUnit, setViewUnit] = useState<'vhori' | 'gram'>('vhori');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Synchronize live rates across entire app whenever rates are updated
  useEffect(() => {
    const handleRatesUpdate = (event: Event) => {
      const customEvt = event as CustomEvent<LiveMetalRate[]>;
      if (customEvt.detail) {
        setRates(customEvt.detail);
      } else {
        setRates(getLiveRates());
      }
    };

    window.addEventListener('rk_market_rates_updated', handleRatesUpdate);
    return () => {
      window.removeEventListener('rk_market_rates_updated', handleRatesUpdate);
    };
  }, []);

  // Calculator State
  const [calcPurity, setCalcPurity] = useState<'22K' | '21K' | '18K' | 'Traditional' | 'Silver-22K'>('22K');
  const [calcUnit, setCalcUnit] = useState<'vhori' | 'gram'>('vhori');
  const [calcWeight, setCalcWeight] = useState<number>(1);
  const [includeMakingCharge, setIncludeMakingCharge] = useState(true);

  const handleRefreshRates = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const updated = refreshMarketRates();
      setRates(updated);
      setIsRefreshing(false);
    }, 450);
  };

  // Calculate estimated price
  const selectedRate = rates.find((r) => r.purity === calcPurity) || rates[0];
  const unitPrice = calcUnit === 'vhori' ? selectedRate.pricePerVhori : selectedRate.pricePerGram;
  const baseGoldCost = Math.round(unitPrice * Math.max(0, calcWeight));
  
  // Standard Bangladesh making charge: ~৳3,500/vhori or ~৳300/gram
  const makingChargePerUnit = calcUnit === 'vhori' ? 3500 : 300;
  const totalMakingCharge = includeMakingCharge ? Math.round(makingChargePerUnit * Math.max(0, calcWeight)) : 0;
  const grandTotal = baseGoldCost + totalMakingCharge;

  return (
    <section className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#151726] via-[#10121d] to-[#0d0e16] border border-[#d4af37]/35 shadow-2xl space-y-6">
      {/* Header with Title and Unit Toggles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs text-[#d4af37] uppercase tracking-wider font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{isBn ? 'লাইভ বাজার দর · বাজুস (BAJUS) মানদণ্ড' : 'Live Bangladesh Market Rates · BAJUS Standard'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mt-1">
            {isBn ? 'বাংলাদেশে আজকের সোনা ও রূপার মূল্য' : 'Today’s Gold & Silver Rates in Bangladesh'}
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            {isBn
              ? 'বাংলাদেশ জুয়েলার্স অ্যাসোসিয়েশন (BAJUS) অনুমোদিত হলমার্ক সোনা ও রূপার নির্ভরযোগ্য লাইভ দর।'
              : 'Official Bangladesh Jeweller’s Association (BAJUS) benchmark rates for 22K, 21K, 18K Hallmark gold & silver.'}
          </p>
        </div>

        {/* Unit Toggle and Refresh button */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Unit Toggle: Vhori vs Gram */}
          <div className="flex items-center bg-[#181a28] p-1 rounded-xl border border-slate-700 text-[11px] sm:text-xs font-semibold">
            <button
              onClick={() => setViewUnit('vhori')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewUnit === 'vhori'
                  ? 'bg-[#d4af37] text-slate-950 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isBn ? 'প্রতি ভরি' : 'Per Vhori'}
            </button>
            <button
              onClick={() => setViewUnit('gram')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewUnit === 'gram'
                  ? 'bg-[#d4af37] text-slate-950 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isBn ? 'প্রতি গ্রাম' : 'Per Gram'}
            </button>
          </div>

          <button
            onClick={handleRefreshRates}
            disabled={isRefreshing}
            className="p-2 sm:p-2.5 rounded-xl bg-[#181a28] hover:bg-[#202234] border border-slate-700 text-slate-300 hover:text-[#d4af37] transition-colors cursor-pointer"
            title={isBn ? 'লাইভ দর রিফ্রেশ করুন' : 'Refresh Live Rates'}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-[#d4af37]' : ''}`} />
          </button>

          {/* Update Rates button */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#d4af37]/15 hover:bg-[#d4af37]/25 border border-[#d4af37]/50 text-[#f3e5ab] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-[#d4af37]/10"
            title={isBn ? 'স্বর্ণ ও রূপার বাজার দর পরিবর্তন করুন' : 'Update Live Market Rates'}
          >
            <Edit3 className="h-3.5 w-3.5 text-[#d4af37]" />
            <span>{isBn ? 'দর পরিবর্তন' : 'Update Rates'}</span>
          </button>
        </div>
      </div>

      {/* Live Rates Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {rates.map((rate) => {
          const displayPrice = viewUnit === 'vhori' ? rate.pricePerVhori : rate.pricePerGram;
          const isGold = rate.metal === 'gold';

          return (
            <div
              key={rate.id}
              className={`p-4 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                rate.purity === '22K'
                  ? 'bg-gradient-to-b from-[#222014] to-[#161724] border-[#d4af37] shadow-lg shadow-[#d4af37]/10'
                  : 'bg-[#151724] border-slate-800 hover:border-[#d4af37]/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  isGold ? 'bg-[#d4af37]/20 text-[#f3e5ab]' : 'bg-slate-700/50 text-slate-300'
                }`}>
                  {rate.purity}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center">
                  <TrendingUp className="h-3 w-3 mr-0.5" />
                  +{rate.changePercent}%
                </span>
              </div>

              <div className="mt-2.5">
                <h4 className="text-xs font-semibold text-slate-300 truncate">
                  {isBn ? rate.nameBn : rate.name}
                </h4>
                <div className="text-xl font-bold text-white mt-1 font-mono-numbers">
                  {formatBDT(displayPrice, isBn)}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {viewUnit === 'vhori'
                    ? isBn ? 'প্রতি ভরি' : 'per vhori'
                    : isBn ? 'প্রতি গ্রাম' : 'per gram'}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span>{isBn ? 'দৈনিক পরিবর্তন' : '24h Change'}</span>
                <span className="text-emerald-400 font-bold font-mono-numbers">
                  +{formatBDT(rate.change24h, isBn)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Live Gold & Silver Price Calculator */}
      <div className="p-5 md:p-6 bg-[#161826] rounded-2xl border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#d4af37]/15 text-[#d4af37]">
              <Calculator className="h-4 w-4" />
            </div>
            <h4 className="text-base font-bold text-white">
              {isBn ? 'লাইভ সোনা ও রূপার মূল্য ক্যালকুলেটর' : 'Live Gold & Silver Cost Calculator'}
            </h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isBn
              ? 'আপনার পছন্দের ক্যারেট এবং ওজন বসিয়ে আজকের লাইভ বাজুস দর অনুযায়ী সঠিক দাম ও আনুমানিক মজুরি হিসাব করুন।'
              : 'Select karat and enter desired weight to instantly calculate real-time BDT value with making charges.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Karat select */}
            <div>
              <label className="block text-slate-400 mb-1 font-medium">{isBn ? 'ক্যারেট / গ্রেড' : 'Karat Purity'}</label>
              <select
                value={calcPurity}
                onChange={(e) => setCalcPurity(e.target.value as typeof calcPurity)}
                className="w-full bg-[#11121c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37] font-semibold"
              >
                <option value="22K">{isBn ? '২২ ক্যারেট (হলমার্ক)' : '22K Hallmark Gold'}</option>
                <option value="21K">{isBn ? '২১ ক্যারেট (হলমার্ক)' : '21K Hallmark Gold'}</option>
                <option value="18K">{isBn ? '১৮ ক্যারেট (হলমার্ক)' : '18K Hallmark Gold'}</option>
                <option value="Traditional">{isBn ? 'সনাতন পদ্ধতির সোনা' : 'Traditional Method'}</option>
                <option value="Silver-22K">{isBn ? '২২ ক্যারেট রূপা' : '22K Silver (Rupa)'}</option>
              </select>
            </div>

            {/* Weight Input */}
            <div>
              <label className="block text-slate-400 mb-1 font-medium">{isBn ? 'ওজন' : 'Weight'}</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={calcWeight}
                onChange={(e) => setCalcWeight(Number(e.target.value))}
                className="w-full bg-[#11121c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37] font-mono-numbers font-semibold"
              />
            </div>

            {/* Weight Unit */}
            <div>
              <label className="block text-slate-400 mb-1 font-medium">{isBn ? 'একক' : 'Unit'}</label>
              <select
                value={calcUnit}
                onChange={(e) => setCalcUnit(e.target.value as 'vhori' | 'gram')}
                className="w-full bg-[#11121c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37] font-semibold"
              >
                <option value="vhori">{isBn ? 'ভরি (Vhori)' : 'Vhori (11.664g)'}</option>
                <option value="gram">{isBn ? 'গ্রাম (Gram)' : 'Grams'}</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="makingChargeToggle"
              checked={includeMakingCharge}
              onChange={(e) => setIncludeMakingCharge(e.target.checked)}
              className="rounded accent-[#d4af37] cursor-pointer"
            />
            <label htmlFor="makingChargeToggle" className="text-xs text-slate-300 cursor-pointer">
              {isBn
                ? 'আনুমানিক কারিগরি মজুরি অন্তর্ভুক্ত করুন (মজুরি প্রতি ভরি ৩,৫০০ টাকা)'
                : 'Include estimated craftsmanship making charge (৳3,500/vhori)'}
            </label>
          </div>
        </div>

        {/* Calculation Result Box */}
        <div className="lg:col-span-5 p-5 bg-[#11121c] rounded-2xl border border-[#d4af37]/40 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{isBn ? 'মূল সোনার দাম:' : 'Base Metal Value:'}</span>
            <span className="font-semibold text-slate-200 font-mono-numbers">{formatBDT(baseGoldCost, isBn)}</span>
          </div>
          {includeMakingCharge && (
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{isBn ? 'কারিগর মজুরি:' : 'Making Charges:'}</span>
              <span className="font-semibold text-slate-200 font-mono-numbers">{formatBDT(totalMakingCharge, isBn)}</span>
            </div>
          )}
          <div className="pt-2 border-t border-slate-800 flex items-baseline justify-between">
            <span className="text-xs font-bold text-slate-200">{isBn ? 'সর্বমোট আনুমানিক মূল্য:' : 'Total Estimated Price:'}</span>
            <div className="text-2xl font-bold text-[#f3e5ab] font-mono-numbers">
              {formatBDT(grandTotal, isBn)}
            </div>
          </div>
          <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between">
            <span>* {isBn ? 'বাজুস নির্ধারিত বর্তমান বাজার দর অনুযায়ী' : 'Based on current official BAJUS rate'}</span>
            <span className="text-emerald-400 font-semibold">{isBn ? '১০০% খাঁটি হলমার্ক' : '100% Hallmark'}</span>
          </div>
        </div>
      </div>

      {/* Modal to edit and customize live market rates with real Bangladesh prices */}
      <EditMarketRatesModal
        lang={lang}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onRatesUpdated={(updatedRates) => setRates(updatedRates)}
      />
    </section>
  );
};
