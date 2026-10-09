import React, { useState } from 'react';
import { JewelryCategory, JewelryItem, MetalType, GemstoneType } from '../types';
import { Language } from '../i18n/translations';
import { formatBDT } from '../services/marketRates';
import { X, Upload, Plus, Trash2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface AddJewelryModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  onItemAdded: (item: JewelryItem) => void;
}

const PRESET_JEWELRY_PHOTOS = [
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1611591475152-478311394f4b?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&auto=format&fit=crop&q=80',
];

export const AddJewelryModal: React.FC<AddJewelryModalProps> = ({ lang, isOpen, onClose, onItemAdded }) => {
  const isBn = lang === 'bn';
  const [step, setStep] = useState<1 | 2>(1);

  // Form Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<JewelryCategory>('rings');
  const [collection, setCollection] = useState('Rajkonna Bridal');
  const [metal, setMetal] = useState<MetalType>('22k-gold');
  const [gemstone, setGemstone] = useState<GemstoneType>('diamond');
  const [weightGrams, setWeightGrams] = useState<number>(11.66);
  const [price, setPrice] = useState<number>(145000);
  const [stock, setStock] = useState<number>(2);
  const [description, setDescription] = useState('');
  const [craftsmanshipNotes, setCraftsmanshipNotes] = useState('');

  // Images state (MUST have at least 3 images)
  const [images, setImages] = useState<string[]>([
    PRESET_JEWELRY_PHOTOS[0],
    PRESET_JEWELRY_PHOTOS[1],
    PRESET_JEWELRY_PHOTOS[2],
  ]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrl = () => {
    if (customImageUrl.trim()) {
      setImages((prev) => [...prev, customImageUrl.trim()]);
      setCustomImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length < 3) {
      setFormError(
        isBn
          ? 'বাধ্যতামূলক নিয়ম: প্রতিটি গহনা লিস্টিংয়ের জন্য অন্তত ৩টি ভিন্ন কোণের ছবি আপলোড করতে হবে।'
          : 'Strict Quality Standard: You must provide at least 3 high-resolution images for each listing.'
      );
      return;
    }

    const newItem: JewelryItem = {
      id: 'rk-jewel-' + Date.now(),
      sku: `RK-${category.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      name: name || (isBn ? 'নতুন খাঁটি স্বর্ণালংকার' : 'New Fine Jewelry Piece'),
      category,
      collection: collection || 'RK Exclusive Atelier',
      price: Number(price) || 50000,
      metal,
      gemstone,
      weightGrams: Number(weightGrams) || 11.66,
      weightVhori: Number((Number(weightGrams) / 11.664).toFixed(2)),
      description: description || (isBn ? 'খাঁটি হলমার্ক সোনা দিয়ে তৈরি কারুকার্যময় গহনা।' : 'Handcrafted Hallmark gold jewelry.'),
      craftsmanshipNotes: craftsmanshipNotes || 'BAJUS standard 916 Hallmark certified.',
      stock: Number(stock) || 1,
      stockStatus: 'in-stock',
      isFeatured: true,
      images,
      viewsCount: 1,
      inquiriesCount: 0,
      createdAt: new Date().toISOString(),
    };

    onItemAdded(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-[#12131c] border border-[#d4af37]/35 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#161824]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">
                {isBn ? 'নতুন গহনা যুক্ত করুন' : 'Add New Jewelry Masterpiece'}
              </span>
              <span className="text-xs text-[#d4af37] bg-[#d4af37]/15 px-2 py-0.5 rounded-md border border-[#d4af37]/30 font-semibold">
                RK Atelier
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isBn
                ? 'আইটেমের বিবরণ দিন এবং নিখুঁত উপস্থাপনার জন্য অন্তত ৩টি ছবি আপলোড করুন।'
                : 'Enter specifications and provide at least 3 high-resolution images for each listing.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center border-b border-slate-800 bg-[#0d0e15] px-6 py-3 text-xs font-semibold">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setStep(1)}
              className={`flex items-center gap-1.5 cursor-pointer ${
                step === 1 ? 'text-[#d4af37]' : 'text-slate-400'
              }`}
            >
              <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px] border-current">
                1
              </span>
              <span>{isBn ? '১. বিবরণ ও মূল্য' : '1. Details & BDT Pricing'}</span>
            </button>
            <span className="text-slate-600">/</span>
            <button
              onClick={() => setStep(2)}
              className={`flex items-center gap-1.5 cursor-pointer ${
                step === 2 ? 'text-[#d4af37]' : 'text-slate-400'
              }`}
            >
              <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px] border-current">
                2
              </span>
              <span>{isBn ? '২. অন্তত ৩টি কোণের ছবি (Min. 3)' : '2. Multi-Angle Imagery (Min. 3)'}</span>
              {images.length >= 3 && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 ml-1" />}
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isBn ? 'গহনার নাম *' : 'Jewelry Title *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isBn ? 'যেমন: ময়ূর মোটিফ ২২ ক্যারেট আংটি' : 'e.g. Royal Mayur 22K Gold Bridal Ring'}
                    className="w-full bg-[#181a26] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isBn ? 'কালেকশন' : 'Collection'}
                  </label>
                  <input
                    type="text"
                    value={collection}
                    onChange={(e) => setCollection(e.target.value)}
                    placeholder="e.g. Rajkonna Bridal"
                    className="w-full bg-[#181a26] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isBn ? 'ক্যাটাগরি *' : 'Category *'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as JewelryCategory)}
                    className="w-full bg-[#181a26] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="rings">{isBn ? 'আংটি (Rings)' : 'Rings'}</option>
                    <option value="necklaces">{isBn ? 'নেকলেস ও হার' : 'Necklaces & Colliers'}</option>
                    <option value="bracelets">{isBn ? 'বালা ও চুড়ি' : 'Bracelets & Cuffs'}</option>
                    <option value="earrings">{isBn ? 'কানের দুল ও ঝুমকা' : 'Earrings & Jhumka'}</option>
                    <option value="bridal-sets">{isBn ? 'সম্পূর্ণ বিয়ের সেট' : 'Complete Bridal Sets'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isBn ? 'ধাতু ও ক্যারেট *' : 'Precious Metal *'}
                  </label>
                  <select
                    value={metal}
                    onChange={(e) => setMetal(e.target.value as MetalType)}
                    className="w-full bg-[#181a26] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="22k-gold">{isBn ? '২২ ক্যারেট হলমার্ক সোনা' : '22K Hallmark Gold (916)'}</option>
                    <option value="21k-gold">{isBn ? '২১ ক্যারেট হলমার্ক সোনা' : '21K Hallmark Gold (875)'}</option>
                    <option value="18k-gold">{isBn ? '১৮ ক্যারেট হলমার্ক সোনা' : '18K Hallmark Gold (750)'}</option>
                    <option value="platinum-950">{isBn ? 'প্লাটিনাম ৯৫০' : 'Platinum 950'}</option>
                    <option value="925-silver">{isBn ? 'খাঁটি রূপা (Silver)' : '925 Sterling Silver'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isBn ? 'রত্ন পাথর' : 'Gemstone'}
                  </label>
                  <select
                    value={gemstone}
                    onChange={(e) => setGemstone(e.target.value as GemstoneType)}
                    className="w-full bg-[#181a26] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="diamond">{isBn ? 'হীরা (Diamond)' : 'Certified Diamond'}</option>
                    <option value="ruby">{isBn ? 'রুবি (চুনি)' : 'Natural Ruby'}</option>
                    <option value="emerald">{isBn ? 'পান্না (Emerald)' : 'Colombian Emerald'}</option>
                    <option value="sapphire">{isBn ? 'নীলা (Sapphire)' : 'Ceylon Sapphire'}</option>
                    <option value="pearl">{isBn ? 'খাঁটি মুক্তা (Pearl)' : 'South Sea Pearl'}</option>
                    <option value="none">{isBn ? 'শুধু খাঁটি সোনা' : 'Pure Gold / Plain'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isBn ? 'মূল্য (টাকা ৳) *' : 'Price (BDT ৳) *'}
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-[#181a26] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37] font-mono-numbers"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isBn ? 'ওজন (গ্রাম) [১ ভরি = ১১.৬৬৪ গ্রাম]' : 'Weight (Grams) [1 Vhori = 11.664g]'}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={weightGrams}
                    onChange={(e) => setWeightGrams(Number(e.target.value))}
                    className="w-full bg-[#181a26] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37] font-mono-numbers"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isBn ? 'মজুত সংখ্যা' : 'Stock Quantity'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full bg-[#181a26] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37] font-mono-numbers"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isBn ? 'বিবরণ' : 'Description'}
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={isBn ? 'গহনার মোটিফ ও নকশার বিবরণ লিখুন...' : 'Describe artistic motif and stone clarity...'}
                  className="w-full bg-[#181a26] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isBn ? 'কারিগরি ও হলমার্ক সনদ নোট' : 'Craftsmanship & Hallmark Notes'}
                </label>
                <textarea
                  rows={2}
                  value={craftsmanshipNotes}
                  onChange={(e) => setCraftsmanshipNotes(e.target.value)}
                  placeholder="BAJUS standard 916 Hallmark certified..."
                  className="w-full bg-[#181a26] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {/* Mandatory images alert */}
              <div
                className={`p-4 rounded-2xl border flex items-start gap-3 ${
                  images.length >= 3
                    ? 'bg-emerald-950/20 border-emerald-500/35 text-emerald-200'
                    : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                }`}
              >
                {images.length >= 3 ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div className="text-xs space-y-1">
                  <p className="font-bold text-sm">
                    {isBn
                      ? `বাধ্যতামূলক নিয়ম: প্রতিটি গহনায় অন্তত ৩টি ছবি থাকতে হবে (${images.length}/৩)`
                      : `Listing Requirement: Minimum 3 images required (${images.length}/3 attached)`}
                  </p>
                  <p className="text-slate-300">
                    {isBn
                      ? 'উচ্চমানের ভিজ্যুয়ালাইজেশনের জন্য গহনাটির বিভিন্ন কোণ থেকে (সামনে, পাশ এবং ক্লোজ-আপ) ছবি প্রদান করুন।'
                      : 'Provide multi-angle perspectives to ensure high-quality product visualization for clients.'}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-300">
                    {isBn ? 'সংযুক্ত ছবিসমূহ' : 'Uploaded Images'}
                  </span>
                  <span className="text-xs text-slate-400">{images.length} {isBn ? 'টি ছবি' : 'images'}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-square rounded-xl border border-slate-700 bg-black overflow-hidden"
                    >
                      <img
                        src={img}
                        alt={`Angle ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-1 left-1 bg-black/70 px-1.5 py-0.5 rounded text-[10px] text-white">
                        Angle #{idx + 1}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-600/80 hover:bg-red-600 rounded-md text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}

                  <label className="border-2 border-dashed border-slate-700 hover:border-[#d4af37] rounded-xl aspect-square flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-colors bg-[#181a26]/50">
                    <Upload className="h-5 w-5 text-[#d4af37] mb-1" />
                    <span className="text-[11px] text-slate-300 font-semibold">{isBn ? 'ফাইল আপলোড' : 'Upload File'}</span>
                    <span className="text-[9px] text-slate-500">JPG, PNG, WebP</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* URL input */}
              <div className="p-3 bg-[#181a26] rounded-xl border border-slate-800 space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  {isBn ? 'অথবা ইমেজ লিঙ্ক (URL) দিন' : 'Or add via Image URL'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-[#12131c] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3 py-1.5 bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f3e5ab] hover:bg-[#d4af37]/30 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> {isBn ? 'যোগ করুন' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {formError && (
            <div className="mt-4 p-3 bg-red-950/60 border border-red-500/40 rounded-xl flex items-center justify-between text-xs text-red-300 animate-in fade-in">
              <span>{formError}</span>
              <button
                type="button"
                onClick={() => setFormError(null)}
                className="text-red-400 hover:text-white ml-2 text-sm"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-[#161824]">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                {isBn ? 'পেছনে' : 'Back'}
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>

            {step === 1 ? (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2 text-xs font-bold text-slate-950 bg-[#d4af37] hover:bg-[#e5c158] rounded-xl transition-colors cursor-pointer shadow-md shadow-[#d4af37]/20"
              >
                {isBn ? 'পরবর্তী ধাপ: ছবি আপলোড (মিনিমাম ৩)' : 'Proceed to Images (Min. 3)'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2 text-xs font-bold text-slate-950 bg-[#d4af37] hover:bg-[#e5c158] rounded-xl transition-colors cursor-pointer shadow-lg shadow-[#d4af37]/25 flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" />
                {isBn ? 'গহনাটি পাবলিশ করুন' : 'Publish Jewelry Item'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
