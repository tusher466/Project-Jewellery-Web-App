import React, { useState, useEffect } from 'react';
import { LiveMetalRate } from '../types';
import {
  getLiveRates,
  saveLiveRates,
  resetToOfficialBajusRates,
  INITIAL_BAJUS_RATES,
  formatBDT,
  toBnDigits,
} from '../services/marketRates';
import { Language } from '../i18n/translations';
import { X, Check, RotateCcw, TrendingUp, Sparkles, ShieldCheck, AlertCircle } from 'lucide-react';

interface EditMarketRatesModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  onRatesUpdated?: (rates: LiveMetalRate[]) => void;
}

export const EditMarketRatesModal: React.FC<EditMarketRatesModalProps> = ({
  lang,
  isOpen,
  onClose,
  onRatesUpdated,
}) => {
  const isBn = lang === 'bn';
  const [editableRates, setEditableRates] = useState<LiveMetalRate[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setEditableRates(getLiveRates());
      setSuccessMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePriceChange = (id: string, newVhoriStr: string) => {
    const newVhori = parseFloat(newVhoriStr) || 0;
    setEditableRates((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const gram = Math.round(newVhori / 11.664);
          const diff = Math.round(newVhori - r.pricePerVhori);
          return {
            ...r,
            pricePerVhori: newVhori,
            pricePerGram: gram,
            change24h: diff !== 0 ? diff : r.change24h,
            changePercent: r.pricePerVhori > 0 ? Number(((diff / r.pricePerVhori) * 100).toFixed(2)) : 0,
          };
        }
        return r;
      })
    );
  };

  const handle24hChange = (id: string, changeStr: string) => {
    const change = parseFloat(changeStr) || 0;
    setEditableRates((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            change24h: change,
            changePercent: r.pricePerVhori > 0 ? Number(((change / r.pricePerVhori) * 100).toFixed(2)) : 0,
          };
        }
        return r;
      })
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const timestampedRates = editableRates.map((r) => ({
      ...r,
      lastUpdated: `Updated ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })} (BAJUS Standard)`,
    }));

    const saved = saveLiveRates(timestampedRates);
    if (onRatesUpdated) {
      onRatesUpdated(saved);
    }
    setSuccessMessage(
      isBn
        ? '✓ বাজুস লাইভ বাজার দর সফলভাবে আপডেট করা হয়েছে!'
        : '✓ BAJUS Live Market Rates updated successfully!'
    );
    setTimeout(() => {
      onClose();
    }, 900);
  };

  const handleResetToOfficial = () => {
    const official = resetToOfficialBajusRates();
    setEditableRates(official);
    if (onRatesUpdated) {
      onRatesUpdated(official);
    }
    setSuccessMessage(
      isBn
        ? '✓ অফিশিয়াল বাজুস নির্ধারিত বাজার দর পুনরুদ্ধার করা হয়েছে।'
        : '✓ Restored official legal BAJUS benchmark rates.'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#11131f] border border-[#d4af37]/40 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#d4af37] uppercase tracking-wider font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isBn ? 'বাজার দর ব্যবস্থাপনা' : 'Live Rate Management'}</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mt-1">
              {isBn ? 'বাংলাদেশে আজকের লাইভ স্বর্ণ ও রৌপ্য দর আপডেট করুন' : 'Update Live Bangladesh Gold & Silver Rates'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isBn
                ? 'বাজুস (BAJUS) এর নতুন সার্কুলার অনুযায়ী যেকোনো সময় প্রতি ভরি ও গ্রামের সঠিক মূল্য পরিবর্তন করুন।'
                : 'Modify prices per Vhori & Gram to reflect the latest official BAJUS circular rates.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Success Banner */}
        {successMessage && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <Check className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-3">
            {editableRates.map((rate) => {
              const is22K = rate.purity === '22K';
              return (
                <div
                  key={rate.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    is22K
                      ? 'bg-gradient-to-r from-[#201d12] to-[#161827] border-[#d4af37]/50'
                      : 'bg-[#161826] border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#f3e5ab]">
                        {rate.purity}
                      </span>
                      <h4 className="text-xs font-bold text-white">
                        {isBn ? rate.nameBn : rate.name}
                      </h4>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono-numbers">
                      <span>{isBn ? 'প্রতি গ্রাম:' : 'Per Gram:'}</span>
                      <span className="text-[#f3e5ab] font-bold">
                        {formatBDT(rate.pricePerGram, isBn)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">
                        {isBn ? 'প্রতি ভরি দর (টাকা)' : 'Price Per Vhori (BDT)'}{' '}
                        <span className="text-[10px] text-slate-500">(১১.৬৬৪ গ্রাম)</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-slate-500 font-bold">৳</span>
                        <input
                          type="number"
                          min="100"
                          step="1"
                          value={rate.pricePerVhori || ''}
                          onChange={(e) => handlePriceChange(rate.id, e.target.value)}
                          className="w-full bg-[#0e1019] border border-slate-700 focus:border-[#d4af37] rounded-xl pl-8 pr-3 py-2 text-xs text-white font-mono-numbers font-semibold focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">
                        {isBn ? '২৪ ঘণ্টার পরিবর্তন (+ / - টাকা)' : '24h Change (BDT)'}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-slate-500 font-bold">৳</span>
                        <input
                          type="number"
                          step="1"
                          value={rate.change24h || ''}
                          onChange={(e) => handle24hChange(rate.id, e.target.value)}
                          className="w-full bg-[#0e1019] border border-slate-700 focus:border-[#d4af37] rounded-xl pl-8 pr-3 py-2 text-xs text-emerald-400 font-mono-numbers font-semibold focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick info note */}
          <div className="p-3 bg-[#181a28] rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-[#d4af37] shrink-0 mt-0.5" />
            <span>
              {isBn
                ? 'ভরি থেকে গ্রামের অনুপাত আন্তর্জাতিক বাজুস ফর্মুলা অনুযায়ী ১ ভরি = ১১.৬৬৪ গ্রাম হিসেবে স্বয়ংক্রিয়ভাবে হিসাব করা হয়।'
                : 'Gram prices are calculated automatically based on the BAJUS standard: 1 Vhori = 11.664 Grams.'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetToOfficial}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-700 hover:border-[#d4af37] text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 text-[#d4af37]" />
              <span>{isBn ? 'অফিশিয়াল বাজুস বেঞ্চমার্কে রিসেট' : 'Reset to Official BAJUS'}</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-[#d4af37]/20 transition-all cursor-pointer"
              >
                <Check className="h-4 w-4" />
                <span>{isBn ? 'দর সেভ ও কার্যকর করুন' : 'Save & Publish Rates'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
