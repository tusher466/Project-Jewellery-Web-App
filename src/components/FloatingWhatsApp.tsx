import React, { useState, useEffect, useRef } from 'react';
import { getShopWhatsAppNumber } from '../services/storage';
import { Language } from '../i18n/translations';
import { MessageCircle, X, Send, Sparkles, Phone, ExternalLink } from 'lucide-react';

interface FloatingWhatsAppProps {
  lang: Language;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ lang }) => {
  const isBn = lang === 'bn';
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [isVisibleMobile, setIsVisibleMobile] = useState(true);
  const lastScrollYRef = useRef(0);
  const whatsappNumber = getShopWhatsAppNumber();

  // Handle mobile scroll hide behavior:
  // When user scrolls down on mobile, hide the WhatsApp Us button to prevent blocking content.
  // When user scrolls up or is at the top, make it visible again.
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY || document.documentElement.scrollTop;
          const isMobile = window.innerWidth < 768;

          if (isMobile) {
            // Don't hide if the popup chat card is currently open by user
            if (!isOpen) {
              // If user scrolled down past a minimum threshold (30px)
              if (currentScrollY > 60 && currentScrollY > lastScrollYRef.current + 8) {
                // Scrolling down -> hide
                setIsVisibleMobile(false);
              } else if (currentScrollY < lastScrollYRef.current - 12 || currentScrollY <= 40) {
                // Scrolling up or near top -> show
                setIsVisibleMobile(true);
              }
            }
          } else {
            // On desktop/tablet, always keep visible
            setIsVisibleMobile(true);
          }

          lastScrollYRef.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  const defaultGreeting = isBn
    ? 'আসসালামু আলাইকুম আরকে জুয়েলারি, আমি আপনাদের গহনা ও আজকের সোনার দর সম্পর্কে জানতে চাই।'
    : 'Hello RK Jewellery, I would like to inquire about your jewellery collection and live gold prices.';

  const handleOpenWhatsApp = (messageText: string) => {
    const textToSend = encodeURIComponent(messageText || defaultGreeting);
    const url = `https://wa.me/${whatsappNumber}?text=${textToSend}`;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const quickTemplates = isBn
    ? [
        'আজকের ২২ ক্যারেট সোনার ভরি কত?',
        'ব্রাইডাল বিয়ের সেটের ক্যাটালগ দেখতে চাই।',
        'কাস্টম আংটির সাইজ ও অর্ডার জানতে চাই।',
      ]
    : [
        'What is today’s 22K gold rate per Vhori?',
        'I want to see your bridal necklace sets.',
        'Inquiring about custom ring sizing & order.',
      ];

  return (
    <div
      className={`fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end select-none transition-all duration-300 ${
        isVisibleMobile
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'max-md:opacity-0 max-md:translate-y-8 max-md:pointer-events-none md:opacity-100 md:translate-y-0'
      }`}
    >
      {/* Quick Chat Popup Card */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-sm sm:w-96 bg-[#12131e] border-2 border-[#25D366]/40 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-250">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1f4a30] via-[#122e1d] to-[#0d1e13] p-4 text-white flex items-center justify-between border-b border-[#25D366]/30">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-slate-950 shadow-md">
                <MessageCircle className="h-6 w-6 text-white" />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#122e1d]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>RK Jewellery WhatsApp</span>
                </h4>
                <div className="flex items-center gap-1 text-[11px] text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{isBn ? 'সরাসরি দ্রুত সাপোর্ট (Active)' : 'Direct Fast Support (Active)'}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-black/40 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3.5 bg-[#0f1019] text-xs">
            <div className="p-3 bg-[#181a28] rounded-2xl border border-slate-800 text-slate-300 leading-relaxed">
              <p className="font-semibold text-white mb-1">
                {isBn ? 'স্বাগতম আরকে জুয়েলারিতে!' : 'Welcome to RK Jewellery!'}
              </p>
              <p>
                {isBn
                  ? 'সরাসরি হোয়াটসঅ্যাপে কথা বলুন মালিকের সাথে। যেকোনো প্রশ্নের উত্তর এবং কাস্টম অর্ডারের দ্রুত সেবা পান।'
                  : 'Chat directly with the shop owner on WhatsApp for instant pricing, custom bridal orders, and fast assistance.'}
              </p>
            </div>

            {/* Quick Prompts */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-semibold block">
                {isBn ? 'সহজ প্রশ্নসমূহ নির্বাচন করুন:' : 'Tap a quick inquiry question:'}
              </span>
              <div className="flex flex-col gap-1.5">
                {quickTemplates.map((tmpl, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOpenWhatsApp(tmpl)}
                    className="w-full text-left p-2 rounded-xl bg-[#151726] hover:bg-[#1f2238] border border-slate-800 hover:border-[#25D366]/50 text-slate-200 text-xs transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <span className="truncate pr-2">"{tmpl}"</span>
                    <ExternalLink className="h-3.5 w-3.5 text-[#25D366] opacity-70 group-hover:opacity-100 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom text & trigger */}
            <div className="pt-2 flex gap-2">
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleOpenWhatsApp(customMsg);
                }}
                placeholder={isBn ? 'আপনার মেসেজ লিখুন...' : 'Type your question...'}
                className="flex-1 bg-[#151726] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#25D366]"
              />
              <button
                onClick={() => handleOpenWhatsApp(customMsg)}
                className="px-3.5 py-2 bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 shadow-md transition-colors cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isBn ? 'পাঠান' : 'Chat'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-2xl shadow-[#25D366]/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        title="WhatsApp Direct Inquiry"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-300 animate-ping" />
        <MessageCircle className="h-6 w-6 text-white shrink-0 fill-white" />
        <span className="text-xs font-bold text-slate-950 tracking-wide pr-1">
          {isOpen
            ? (isBn ? 'বন্ধ করুন' : 'Close')
            : (isBn ? 'হোয়াটসঅ্যাপে যোগাযোগ' : 'WhatsApp Us')}
        </span>
      </button>
    </div>
  );
};
