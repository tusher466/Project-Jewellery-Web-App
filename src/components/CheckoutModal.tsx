import React, { useState } from 'react';
import { CustomerOrder, JewelryItem, OrderItem } from '../types';
import { createOrder } from '../services/storage';
import { formatBDT } from '../services/marketRates';
import { Language, translations } from '../i18n/translations';
import confetti from 'canvas-confetti';
import { X, CheckCircle2, Lock, Sparkles, Banknote, ShieldCheck } from 'lucide-react';

interface CheckoutModalProps {
  lang: Language;
  isOpen: boolean;
  product: JewelryItem;
  onClose: () => void;
  onOrderPlaced: (order: CustomerOrder) => void;
}

const BD_DISTRICTS = [
  'Dhaka (ঢাকা)',
  'Chittagong (চট্টগ্রাম)',
  'Sylhet (সিলেট)',
  'Rajshahi (রাজশাহী)',
  'Khulna (খুলনা)',
  'Barisal (বরিশাল)',
  'Rangpur (রংপুর)',
  'Mymensingh (ময়মনসিংহ)',
  'Comilla (কুমিল্লা)',
  'Bogura (বগুড়া)',
  'Narayanganj (নারায়ণগঞ্জ)',
  'Gazipur (গাজীপুর)',
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  lang,
  isOpen,
  product,
  onClose,
  onOrderPlaced,
}) => {
  const isBn = lang === 'bn';
  const t = translations[lang];

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState(isBn ? 'ঢাকা' : 'Dhaka');
  const [district, setDistrict] = useState(BD_DISTRICTS[0]);
  const [postalCode, setPostalCode] = useState('');
  const [sizeOrLength, setSizeOrLength] = useState(
    product.category === 'rings' ? 'Size 16' : product.category === 'bracelets' ? '2.4 (Medium)' : '18 Inch'
  );
  const [engraving, setEngraving] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<CustomerOrder['paymentMethod']>('cash-on-delivery');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<CustomerOrder | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone || !shippingAddress) return;

    setIsSubmitting(true);

    const orderItem: OrderItem = {
      productId: product.id,
      productName: isBn && product.nameBn ? product.nameBn : product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
      metal: product.metal,
      sizeOrLength,
      engraving: engraving.trim() || undefined,
    };

    setTimeout(() => {
      const newOrder = createOrder({
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        city,
        district,
        country: 'Bangladesh',
        postalCode,
        specialRequirements: specialRequirements.trim() || undefined,
        items: [orderItem],
        totalAmount: product.price,
        paymentMethod,
      });

      // Confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#d4af37', '#f3e5ab', '#ffffff', '#22c55e'],
        });
      } catch {
        // ignore
      }

      setIsSubmitting(false);
      setConfirmedOrder(newOrder);
      onOrderPlaced(newOrder);
    }, 500);
  };

  const handleFinish = () => {
    setConfirmedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 bg-[#12131c] border border-[#d4af37]/35 rounded-3xl shadow-2xl p-6 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#d4af37]/15 text-[#d4af37]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xl text-white font-bold">{t.checkoutTitle}</h3>
              <p className="text-xs text-slate-400">{t.checkoutSubtitle}</p>
            </div>
          </div>
          <button
            onClick={confirmedOrder ? handleFinish : onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {confirmedOrder ? (
          <div className="py-6 space-y-5 text-center">
            <div className="w-14 h-14 rounded-full bg-[#d4af37]/15 text-[#f3e5ab] border border-[#d4af37]/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8 text-[#d4af37]" />
            </div>
            <div>
              <span className="text-xs text-[#d4af37] font-mono-numbers uppercase tracking-widest font-bold">
                Order ID: {confirmedOrder.orderNumber}
              </span>
              <h4 className="text-2xl text-white font-bold mt-1">
                {t.orderSuccessTitle}
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                {t.orderSuccessSub}
              </p>
            </div>

            <div className="max-w-md mx-auto p-4 bg-[#181a26] rounded-2xl border border-slate-800 text-left text-xs space-y-2 text-slate-300">
              <div className="flex justify-between border-b border-slate-700/60 pb-2">
                <span className="text-slate-400">{isBn ? 'গহনার নাম:' : 'Item:'}</span>
                <span className="font-bold text-white">{confirmedOrder.items[0].productName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-700/60 pb-2">
                <span className="text-slate-400">{isBn ? 'মাপ / সাইজ:' : 'Size:'}</span>
                <span className="font-bold text-[#f3e5ab]">{sizeOrLength}</span>
              </div>
              {confirmedOrder.items[0].engraving && (
                <div className="flex justify-between border-b border-slate-700/60 pb-2">
                  <span className="text-slate-400">{isBn ? 'খোদাই নাম:' : 'Engraving:'}</span>
                  <span className="italic text-[#f3e5ab]">"{confirmedOrder.items[0].engraving}"</span>
                </div>
              )}
              <div className="flex justify-between border-b border-slate-700/60 pb-2">
                <span className="text-slate-400">{isBn ? 'ডেলিভারি ঠিকানা:' : 'Delivery Address:'}</span>
                <span className="font-semibold text-white">
                  {confirmedOrder.customerName}, {confirmedOrder.shippingAddress}, {confirmedOrder.city} ({confirmedOrder.customerPhone})
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-700/60 pb-2">
                <span className="text-slate-400">{isBn ? 'মূল্য পরিশোধ পদ্ধতি:' : 'Payment Method:'}</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <Banknote className="h-3.5 w-3.5 inline" />
                  {isBn ? 'ক্যাশ অন ডেলিভারি (COD)' : 'Cash on Delivery (COD)'}
                </span>
              </div>
              <div className="flex justify-between pt-1 font-bold text-sm text-[#f3e5ab]">
                <span>{isBn ? 'সর্বমোট মূল্য:' : 'Total Amount:'}</span>
                <span className="font-mono-numbers">{formatBDT(confirmedOrder.totalAmount, isBn)}</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-950/20 border border-emerald-500/35 rounded-xl max-w-md mx-auto text-xs text-emerald-300 font-semibold">
              {isBn
                ? 'মালিককে সরাসরি বার্তা দেওয়া হয়েছে। আপনার ফোন নম্বরে কনফার্মেশন কল করা হবে।'
                : 'The proprietor has received an instant push notification with your needs!'}
            </div>

            <button
              onClick={handleFinish}
              className="px-6 py-2.5 bg-[#d4af37] hover:bg-[#e5c158] text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-lg shadow-[#d4af37]/20"
            >
              {isBn ? 'কালেকশন দেখতে ফিরে যান' : 'Continue Shopping'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[72vh] overflow-y-auto pr-1">
            {/* Item Summary Banner */}
            <div className="p-3.5 bg-[#181a26] rounded-2xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-700"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-[10px] text-[#d4af37] uppercase tracking-wider font-mono-numbers font-bold">
                    {product.sku}
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    {isBn && product.nameBn ? product.nameBn : product.name}
                  </h4>
                  <div className="text-xs text-slate-400">
                    {product.weightGrams}g ({product.weightVhori || 1} {isBn ? 'ভরি' : 'Vhori'}) · {product.metal.replace(/-/g, ' ')}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-[#f3e5ab] font-mono-numbers">
                  {formatBDT(product.price, isBn)}
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold">
                  {isBn ? 'বিমাকৃত হোম ডেলিভারি' : 'Insured Delivery Included'}
                </div>
              </div>
            </div>

            {/* Sizing & Customization */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.ringSizeLabel}
                </label>
                <select
                  value={sizeOrLength}
                  onChange={(e) => setSizeOrLength(e.target.value)}
                  className="w-full bg-[#181a26] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37] font-semibold"
                >
                  {product.category === 'rings' ? (
                    <>
                      <option value="Size 12">Size 12 (ছোট)</option>
                      <option value="Size 14">Size 14 (মিডিয়াম)</option>
                      <option value="Size 16">Size 16 (স্ট্যান্ডার্ড)</option>
                      <option value="Size 18">Size 18</option>
                      <option value="Size 20">Size 20 (বড়)</option>
                    </>
                  ) : product.category === 'bracelets' ? (
                    <>
                      <option value="2.2">2.2 (ছোট সাইজ)</option>
                      <option value="2.4">2.4 (মিডিয়াম সাইজ)</option>
                      <option value="2.6">2.6 (স্ট্যান্ডার্ড সাইজ)</option>
                      <option value="2.8">2.8 (বড় সাইজ)</option>
                    </>
                  ) : (
                    <>
                      <option value="16 Inch">16 Inch (১৬ ইঞ্চি চোকার)</option>
                      <option value="18 Inch">18 Inch (১৮ ইঞ্চি স্ট্যান্ডার্ড)</option>
                      <option value="20 Inch">20 Inch (২০ ইঞ্চি সীতা হার)</option>
                      <option value="22 Inch">22 Inch (২২ ইঞ্চি লম্বা হার)</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.engravingLabel}
                </label>
                <input
                  type="text"
                  maxLength={25}
                  value={engraving}
                  onChange={(e) => setEngraving(e.target.value)}
                  placeholder={t.engravingPlaceholder}
                  className="w-full bg-[#181a26] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            {/* Customer Contact Info */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-300 block">
                {isBn ? 'গ্রাহকের যোগাযোগের তথ্য' : 'Customer Contact Information'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">{t.customerNameLabel}</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={isBn ? 'যেমন: ফারহান চৌধুরী' : 'e.g. Farhan Chowdhury'}
                    className="w-full bg-[#181a26] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">{t.customerEmailLabel}</label>
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

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">{t.customerPhoneLabel}</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +880 1711 234567"
                  className="w-full bg-[#181a26] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            {/* Delivery Destination */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-300 block">
                {isBn ? 'ডেলিভারির ঠিকানা (বাংলাদেশ)' : 'Delivery Address (Bangladesh)'}
              </span>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">{t.shippingAddressLabel}</label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder={isBn ? 'যেমন: বাসা ১৪, রোড ৭, ধানমন্ডি' : 'e.g. House 14, Road 7, Dhanmondi'}
                  className="w-full bg-[#181a26] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">{t.cityLabel}</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder={isBn ? 'ঢাকা / চট্টগ্রাম' : 'Dhaka / Chittagong'}
                    className="w-full bg-[#181a26] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">{t.districtLabel}</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-[#181a26] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    {BD_DISTRICTS.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="1205"
                    className="w-full bg-[#181a26] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  {t.specialReqLabel}
                </label>
                <textarea
                  rows={2}
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  placeholder={t.specialReqPlaceholder}
                  className="w-full bg-[#181a26] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            {/* Payment Method Option - Only COD Cash on Delivery */}
            <div className="pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 block">{t.paymentMethodLabel}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[#f3e5ab]">
                  {isBn ? 'একমাত্র অনুমোদিত মাধ্যম' : 'Only Available Option'}
                </span>
              </div>
              
              <div className="p-3.5 rounded-2xl border-2 border-[#d4af37]/70 bg-gradient-to-r from-[#d4af37]/15 via-[#181a26] to-[#141622] flex items-start gap-3 shadow-lg shadow-[#d4af37]/5">
                <div className="p-2.5 rounded-xl bg-[#d4af37]/20 text-[#f3e5ab] mt-0.5 shrink-0 border border-[#d4af37]/30">
                  <Banknote className="h-5 w-5 text-[#d4af37]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-bold text-sm text-white flex items-center gap-1.5">
                      {isBn ? 'ক্যাশ অন ডেলিভারি (COD)' : 'Cash on Delivery (COD)'}
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 inline shrink-0" />
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                      {isBn ? '০% অগ্রিম পেমেন্ট' : '0% Advance Required'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {isBn
                      ? 'ডেলিভারির সময় গহনা ও আসল হলমার্ক মেমো স্বচক্ষে দেখে যাচাই করে ডেলিভারি প্রতিনিধির হাতে নগদ টাকা পরিশোধ করুন।'
                      : 'Inspect your authentic jewelry piece and verify the hallmark memo at your doorstep before paying cash.'}
                  </p>
                  <div className="mt-2.5 flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1 text-emerald-300">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {isBn ? 'নিরাপদ সিলগালা পার্সেল' : 'Tamper-evident sealed parcel'}
                    </span>
                    <span>•</span>
                    <span>{isBn ? 'সম্পূর্ণ ঝুঁকিমুক্ত অর্ডার' : '100% Risk-Free Delivery'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Lock className="h-3.5 w-3.5 text-emerald-400" />
                <span>{isBn ? 'নিরাপদ ক্যাশ অন ডেলিভারি' : 'Encrypted Cash on Delivery dispatch'}</span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#d4af37] hover:bg-[#e5c158] text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-2 shadow-lg shadow-[#d4af37]/20"
              >
                {isSubmitting ? (
                  <span>{isBn ? 'অর্ডার নিবন্ধিত হচ্ছে...' : 'Registering Order with Atelier...'}</span>
                ) : (
                  <>
                    <Banknote className="h-4 w-4" />
                    <span>{isBn ? 'ক্যাশ অন ডেলিভারিতে অর্ডার নিশ্চিত করুন' : 'Confirm Cash on Delivery'} ({formatBDT(product.price, isBn)})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
