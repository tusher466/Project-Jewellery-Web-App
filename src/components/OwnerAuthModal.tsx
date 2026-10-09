import React, { useState } from 'react';
import { authenticateOwnerWithEmail } from '../services/storage';
import { BrandLogo } from './BrandLogo';
import { Language, translations } from '../i18n/translations';
import { Lock, ShieldCheck, AlertCircle, Key, ArrowRight, X } from 'lucide-react';

interface OwnerAuthModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const OwnerAuthModal: React.FC<OwnerAuthModalProps> = ({ lang, isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;
  const isBn = lang === 'bn';
  const t = translations[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const ok = authenticateOwnerWithEmail(email);
      if (ok) {
        setIsLoading(false);
        onSuccess();
        onClose();
      } else {
        setIsLoading(false);
        setError(
          isBn
            ? 'প্রবেশাধিকার সংরক্ষিত: শুধুমাত্র অনুমোদিত মালিকের ইমেইল দিয়ে প্রবেশ সম্ভব।'
            : 'Access Restricted: Unauthorized email. Only the verified shop proprietor possesses administrative clearance.'
        );
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#13141f] border border-[#d4af37]/35 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <BrandLogo size="sm" subtitle={isBn ? 'মালিকানা অ্যাডমিন পোর্টাল' : 'Proprietor Secure Portal'} />
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isBn ? 'মালিকের অনুমোদিত ইমেইল প্রবেশ করান' : 'Proprietor Authorized Email'}
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder={isBn ? 'আপনার অনুমোদিত ইমেইল লিখুন' : 'Enter authorized proprietor email'}
                className="w-full bg-[#1a1c2a] border border-slate-700 focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors"
              />
              <Key className="absolute right-3 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {isBn
                ? 'সুরক্ষার স্বার্থে মালিকের পরিচয়পত্র গোপন রাখা হয়েছে।'
                : 'Secured administrative gateway. Credentials remain confidential.'}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl flex items-start gap-2.5 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-[#d4af37] hover:bg-[#e5c158] text-slate-950 rounded-xl text-xs font-bold tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[#d4af37]/20"
            >
              {isLoading ? (
                <span>{isBn ? 'যাচাই করা হচ্ছে...' : 'Verifying Clearance...'}</span>
              ) : (
                <>
                  <span>{isBn ? 'মালিক পোর্টালে প্রবেশ করুন' : 'Unlock Proprietor Dashboard'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
