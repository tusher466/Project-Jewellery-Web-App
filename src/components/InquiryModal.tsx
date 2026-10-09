import React, { useState } from 'react';
import { CustomerInquiry, JewelryItem } from '../types';
import { createInquiry } from '../services/storage';
import { formatBDT } from '../services/marketRates';
import { Language, translations } from '../i18n/translations';
import { X, Send, MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface InquiryModalProps {
  lang: Language;
  isOpen: boolean;
  product?: JewelryItem | null;
  onClose: () => void;
  onInquirySubmitted?: (inquiry: CustomerInquiry) => void;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  lang,
  isOpen,
  product,
  onClose,
  onInquirySubmitted,
}) => {
  const isBn = lang === 'bn';
  const t = translations[lang];

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [message, setMessage] = useState(
    product ? `Inquiring regarding ${product.name} (SKU: ${product.sku}). Please share price quotes and custom details.` : ''
  );
  const [inquiryType, setInquiryType] = useState<CustomerInquiry['inquiryType']>('price-quote');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const created = createInquiry({
        productId: product?.id,
        productName: product?.name,
        customerName,
        customerEmail,
        customerPhone,
        message,
        inquiryType,
      });

      setIsSubmitting(false);
      setSubmitted(true);
      if (onInquirySubmitted) {
        onInquirySubmitted(created);
      }
    }, 400);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#12131c] border border-[#d4af37]/35 rounded-3xl shadow-2xl p-6 overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#d4af37]/15 text-[#d4af37]">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-lg text-white font-bold">{t.inquiryTitle}</h3>
              <p className="text-xs text-slate-400">{t.inquirySubtitle}</p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h4 className="text-xl font-bold text-white">{t.inquirySuccessTitle}</h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              {t.inquirySuccessMsg}
            </p>
            <button
              onClick={handleResetAndClose}
              className="mt-4 px-6 py-2 bg-[#d4af37] text-slate-950 rounded-xl text-xs font-bold hover:bg-[#e5c158] transition-colors cursor-pointer"
            >
              {isBn ? 'ঠিক আছে' : 'Close'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {product && (
              <div className="p-3 bg-[#181a26] rounded-xl border border-slate-800 flex items-center gap-3">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover border border-slate-700"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-[#d4af37] uppercase tracking-wider font-mono-numbers">
                    {product.sku}
                  </div>
                  <div className="text-sm font-semibold text-white truncate">
                    {isBn && product.nameBn ? product.nameBn : product.name}
                  </div>
                  <div className="text-xs text-[#f3e5ab] font-mono-numbers">
                    {formatBDT(product.price, isBn)}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{t.inquiryName}</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={isBn ? 'আপনার নাম লিখুন' : 'e.g. Farhan Chowdhury'}
                  className="w-full bg-[#181a26] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{t.inquiryEmail}</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. farhan@domain.com"
                  className="w-full bg-[#181a26] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{t.inquiryPhone}</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +880 1711 000000"
                  className="w-full bg-[#181a26] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{t.inquiryPurpose}</label>
                <select
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value as CustomerInquiry['inquiryType'])}
                  className="w-full bg-[#181a26] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="price-quote">{isBn ? 'মূল্য ও দরদাম জানতে' : 'Price Quote'}</option>
                  <option value="making-charge">{isBn ? 'কারিগর মজুরি জানতে' : 'Making Charge Details'}</option>
                  <option value="custom-sizing">{isBn ? 'কাস্টম সাইজ বা ওজন' : 'Custom Sizing & Weight'}</option>
                  <option value="hallmark-certificate">{isBn ? 'হলমার্ক ও সনদপত্র' : 'Hallmark Certification'}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t.inquiryMessage}</label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={isBn ? 'আপনার চাহিদা বা প্রশ্ন লিখুন...' : 'Write your requirements or questions...'}
                className="w-full bg-[#181a26] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>{isBn ? 'সরাসরি মালিকের কাছে পৌঁছাবে' : 'Direct confidential message to owner'}</span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-[#d4af37] hover:bg-[#e5c158] text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-[#d4af37]/20"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{t.transmitInquiry}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
