import React, { useState, useEffect } from 'react';
import { JewelryCategory, JewelryItem, MetalType, GemstoneType } from '../types';
import { Language } from '../i18n/translations';
import { X, Upload, Plus, Trash2, CheckCircle2, AlertCircle, Save } from 'lucide-react';

interface EditJewelryModalProps {
  lang: Language;
  isOpen: boolean;
  item: JewelryItem | null;
  onClose: () => void;
  onItemUpdated: (updatedItem: JewelryItem) => void;
  onItemDeleted: (id: string) => void;
}

export const EditJewelryModal: React.FC<EditJewelryModalProps> = ({
  lang,
  isOpen,
  item,
  onClose,
  onItemUpdated,
  onItemDeleted,
}) => {
  const isBn = lang === 'bn';

  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [category, setCategory] = useState<JewelryCategory>('rings');
  const [collection, setCollection] = useState('');
  const [metal, setMetal] = useState<MetalType>('22k-gold');
  const [gemstone, setGemstone] = useState<GemstoneType>('diamond');
  const [weightGrams, setWeightGrams] = useState<number>(11.66);
  const [price, setPrice] = useState<number>(100000);
  const [stock, setStock] = useState<number>(1);
  const [stockStatus, setStockStatus] = useState<JewelryItem['stockStatus']>('in-stock');
  const [description, setDescription] = useState('');
  const [descriptionBn, setDescriptionBn] = useState('');
  const [craftsmanshipNotes, setCraftsmanshipNotes] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Populate form when item changes
  useEffect(() => {
    if (item) {
      setName(item.name);
      setNameBn(item.nameBn || '');
      setCategory(item.category);
      setCollection(item.collection);
      setMetal(item.metal);
      setGemstone(item.gemstone);
      setWeightGrams(item.weightGrams);
      setPrice(item.price);
      setStock(item.stock);
      setStockStatus(item.stockStatus || 'in-stock');
      setDescription(item.description);
      setDescriptionBn(item.descriptionBn || '');
      setCraftsmanshipNotes(item.craftsmanshipNotes);
      setImages(item.images || []);
    }
  }, [item]);

  if (!isOpen || !item) return null;

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
          ? 'বাধ্যতামূলক মানদণ্ড: প্রতিটি গহনায় অন্তত ৩টি ভিন্ন কোণের ছবি থাকতে হবে।'
          : 'Strict Quality Standard: A minimum of 3 multi-angle images is required for each listing.'
      );
      return;
    }

    const updated: JewelryItem = {
      ...item,
      name,
      nameBn: nameBn.trim() || undefined,
      category,
      collection,
      metal,
      gemstone,
      weightGrams: Number(weightGrams) || 11.66,
      weightVhori: Number((Number(weightGrams) / 11.664).toFixed(2)),
      price: Number(price) || 10000,
      stock: Number(stock) || 0,
      stockStatus: stockStatus || 'in-stock',
      description,
      descriptionBn: descriptionBn.trim() || undefined,
      craftsmanshipNotes,
      images,
    };

    onItemUpdated(updated);
    onClose();
  };

  const handleConfirmDelete = () => {
    onItemDeleted(item.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-[#12131c] border border-[#d4af37]/35 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#161824]">
          <div className="flex items-center gap-2.5">
            <h3 className="text-xl font-bold text-white">
              {isBn ? 'গহনার বিবরণ ও স্টক আপডেট করুন' : 'Update Jewelry Item & Stock Status'}
            </h3>
            <span className="text-xs text-[#d4af37] font-mono-numbers px-2 py-0.5 rounded bg-[#d4af37]/15">
              {item.sku}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[72vh] overflow-y-auto space-y-5">
          {/* Titles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isBn ? 'নাম (English) *' : 'Jewelry Title (English) *'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#181a26] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isBn ? 'বাংলা নাম' : 'Bengali Title (বাংলা)'}
              </label>
              <input
                type="text"
                value={nameBn}
                onChange={(e) => setNameBn(e.target.value)}
                placeholder="বাংলা নাম লিখুন..."
                className="w-full bg-[#181a26] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          {/* Specs & Categories */}
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
                <option value="bracelets">{isBn ? 'বালা ও চুড়ি' : 'Bracelets & Bala'}</option>
                <option value="earrings">{isBn ? 'কানের দুল ও ঝুমকা' : 'Earrings & Jhumka'}</option>
                <option value="bridal-sets">{isBn ? 'সম্পূর্ণ বিয়ের সেট' : 'Complete Bridal Sets'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isBn ? 'ধাতু ও ক্যারেট *' : 'Metal & Purity *'}
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

          {/* Pricing, Weight, and SHOP STOCK STATUS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#151724] border border-[#d4af37]/25">
            <div>
              <label className="block text-xs font-bold text-[#f3e5ab] mb-1">
                {isBn ? 'মূল্য (টাকা ৳) *' : 'Price (BDT ৳) *'}
              </label>
              <input
                type="number"
                min="1000"
                step="500"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-[#0d0e15] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono-numbers font-bold focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isBn ? 'ওজন (গ্রাম)' : 'Weight (Grams)'}
              </label>
              <input
                type="number"
                step="0.1"
                value={weightGrams}
                onChange={(e) => setWeightGrams(Number(e.target.value))}
                className="w-full bg-[#0d0e15] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono-numbers focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isBn ? 'মজুত সংখ্যা' : 'Stock Quantity'}
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full bg-[#0d0e15] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono-numbers font-bold focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            {/* SHOP STOCK STATUS (KEY USER REQUIREMENT) */}
            <div>
              <label className="block text-xs font-bold text-emerald-400 mb-1">
                {isBn ? 'শপ স্টক স্ট্যাটাস *' : 'Shop Stock Status *'}
              </label>
              <select
                value={stockStatus}
                onChange={(e) => setStockStatus(e.target.value as JewelryItem['stockStatus'])}
                className={`w-full border rounded-xl px-3 py-2 text-xs font-bold focus:outline-none ${
                  stockStatus === 'in-stock'
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/50'
                    : stockStatus === 'low-stock'
                    ? 'bg-amber-950/40 text-amber-300 border-amber-500/50'
                    : stockStatus === 'made-to-order'
                    ? 'bg-sky-950/40 text-sky-300 border-sky-500/50'
                    : 'bg-red-950/40 text-red-300 border-red-500/50'
                }`}
              >
                <option value="in-stock">{isBn ? 'মজুত আছে (In Stock)' : 'In Stock (Ready)'}</option>
                <option value="low-stock">{isBn ? 'সীমিত স্টক (Low Stock)' : 'Low Stock (Hurry)'}</option>
                <option value="made-to-order">{isBn ? 'অর্ডারে তৈরি (Made to Order)' : 'Made to Order / Custom'}</option>
                <option value="sold-out">{isBn ? 'স্টক শেষ (Sold Out)' : 'Sold Out'}</option>
              </select>
            </div>
          </div>

          {/* Description & Craftsmanship */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isBn ? 'বিবরণ (English)' : 'Description (English)'}
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#181a26] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isBn ? 'বাংলা বিবরণ' : 'Description (বাংলা)'}
              </label>
              <textarea
                rows={2}
                value={descriptionBn}
                onChange={(e) => setDescriptionBn(e.target.value)}
                className="w-full bg-[#181a26] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          {/* Multi-angle Images Management */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                {isBn ? 'গহনার ছবি (ন্যূনতম ৩টি থাকা আবশ্যক)' : 'Listing Photos (Minimum 3 Required)'}
              </span>
              <span className={`text-xs font-bold ${images.length >= 3 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {images.length} / 3 {images.length >= 3 ? '✓' : ''}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="group relative aspect-square rounded-xl border border-slate-700 overflow-hidden bg-black">
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-600/90 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Remove"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] text-white">
                    #{idx + 1}
                  </span>
                </div>
              ))}

              <label className="border-2 border-dashed border-slate-700 hover:border-[#d4af37] rounded-xl aspect-square flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-colors bg-[#181a26]/40">
                <Upload className="h-5 w-5 text-[#d4af37] mb-1" />
                <span className="text-[11px] text-slate-300 font-semibold">{isBn ? 'ছবি যোগ করুন' : 'Add Photo'}</span>
                <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {/* Direct Image URL */}
            <div className="flex gap-2">
              <input
                type="url"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 bg-[#181a26] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-3 py-1.5 bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f3e5ab] rounded-xl text-xs font-semibold cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 inline mr-1" /> {isBn ? 'যোগ' : 'Add'}
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {formError && (
            <div className="p-3 bg-red-950/50 border border-red-500/40 rounded-xl flex items-center justify-between text-xs text-red-300 animate-in fade-in">
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

          {/* Modal Footer / Actions */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            {/* Delete Post Button with Inline Confirmation */}
            {isConfirmingDelete ? (
              <div className="flex items-center gap-2 animate-in fade-in">
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-red-600/30"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>{isBn ? 'হ্যাঁ, নিশ্চিতভাবে মুছুন' : 'Confirm Permanent Delete'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(false)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium cursor-pointer"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
                className="px-4 py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                <span>{isBn ? 'পোস্ট মুছে ফেলুন (Delete Post)' : 'Delete Listing'}</span>
              </button>
            )}

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#d4af37] hover:bg-[#e5c158] text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-[#d4af37]/20"
              >
                <Save className="h-4 w-4" />
                <span>{isBn ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
