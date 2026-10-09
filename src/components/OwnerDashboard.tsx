import React, { useState, useEffect } from 'react';
import { CustomerInquiry, CustomerOrder, JewelryItem, PushNotificationAlert, LiveMetalRate } from '../types';
import {
  logoutOwner,
  updateJewelryItemPrice,
  updateJewelryItemStock,
  updateJewelryItemStockStatus,
  updateJewelryItem,
  deleteJewelryItem,
  updateOrderStatus,
  deleteOrder,
  addInquiryReply,
  deleteInquiry,
  clearAllStoreData,
  loadSampleShowcaseItems,
  getShopWhatsAppNumber,
  saveShopWhatsAppNumber,
} from '../services/storage';
import {
  requestBrowserPushPermission,
  triggerPushNotification,
  getStoredNotifications,
  subscribeNotifications,
} from '../services/pushNotification';
import {
  formatBDT,
  toBnDigits,
  getLiveRates,
  saveLiveRates,
  resetToOfficialBajusRates,
} from '../services/marketRates';
import { BrandLogo } from './BrandLogo';
import { Language, translations } from '../i18n/translations';
import { SalesTelemetryCharts } from './SalesTelemetryCharts';
import { AddJewelryModal } from './AddJewelryModal';
import { EditJewelryModal } from './EditJewelryModal';
import {
  Bell,
  BellRing,
  Package,
  Layers,
  TrendingUp,
  MessageSquare,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  Send,
  CheckCircle2,
  Search,
  Globe,
  Coins,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface OwnerDashboardProps {
  lang: Language;
  onToggleLanguage: () => void;
  items: JewelryItem[];
  orders: CustomerOrder[];
  inquiries: CustomerInquiry[];
  onItemsChange: (items: JewelryItem[]) => void;
  onOrdersChange: (orders: CustomerOrder[]) => void;
  onInquiriesChange: (inquiries: CustomerInquiry[]) => void;
  onExitToStore: () => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  lang,
  onToggleLanguage,
  items,
  orders,
  inquiries,
  onItemsChange,
  onOrdersChange,
  onInquiriesChange,
  onExitToStore,
}) => {
  const isBn = lang === 'bn';
  const t = translations[lang];

  const [activeTab, setActiveTab] = useState<'telemetry' | 'inventory' | 'rates' | 'orders' | 'inquiries' | 'alerts'>('telemetry');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // BAJUS Market rates state
  const [ownerRates, setOwnerRates] = useState<LiveMetalRate[]>(getLiveRates());
  const [isRatesSaved, setIsRatesSaved] = useState(false);

  // Synchronize live rates if updated elsewhere
  useEffect(() => {
    const handleRatesSync = (event: Event) => {
      const customEvt = event as CustomEvent<LiveMetalRate[]>;
      if (customEvt.detail) {
        setOwnerRates(customEvt.detail);
      }
    };
    window.addEventListener('rk_market_rates_updated', handleRatesSync);
    return () => {
      window.removeEventListener('rk_market_rates_updated', handleRatesSync);
    };
  }, []);

  const handleOwnerPriceChange = (id: string, newVhoriStr: string) => {
    const newVhori = parseFloat(newVhoriStr) || 0;
    setOwnerRates((prev) =>
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

  const handleOwner24hChange = (id: string, changeStr: string) => {
    const change = parseFloat(changeStr) || 0;
    setOwnerRates((prev) =>
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

  const handleOwnerSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    const timestamped = ownerRates.map((r) => ({
      ...r,
      lastUpdated: `Updated ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} (BAJUS Standard)`,
    }));
    const saved = saveLiveRates(timestamped);
    setOwnerRates(saved);
    setIsRatesSaved(true);
    setTimeout(() => setIsRatesSaved(false), 3000);
    triggerPushNotification({
      type: 'system',
      title: isBn ? '✨ বাজুস বাজার দর লাইভ আপডেট' : '✨ Live Market Rates Published',
      message: isBn
        ? '২২ ক্যারেট সহ সকল স্বর্ণ ও রূপার দর সফলভাবে ওয়েবসাইটে লাইভ প্রকাশ করা হয়েছে।'
        : 'All 22K, 21K, 18K and Silver rates have been published live across the store.',
    });
  };

  const handleOwnerResetRates = () => {
    const official = resetToOfficialBajusRates();
    setOwnerRates(official);
    setIsRatesSaved(true);
    setTimeout(() => setIsRatesSaved(false), 3000);
    triggerPushNotification({
      type: 'system',
      title: isBn ? '🔄 বাজুস অফিসিয়াল দর রিস্টোর' : '🔄 Official BAJUS Rates Restored',
      message: isBn
        ? 'বাংলাদেশ জুয়েলার্স অ্যাসোসিয়েশন (BAJUS) এর অফিসিয়াল বেঞ্চমার্ক দর পুনরায় সেট করা হয়েছে।'
        : 'Official BAJUS benchmark rates have been restored across the application.',
    });
  };

  // Push notifications state
  const [pushPermission, setPushPermission] = useState<NotificationPermission>(
    'Notification' in window ? Notification.permission : 'denied'
  );
  const [notifications, setNotifications] = useState<PushNotificationAlert[]>(getStoredNotifications());
  const [showNotificationToast, setShowNotificationToast] = useState<PushNotificationAlert | null>(null);

  // Inventory editing & updates
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [editingPriceValue, setEditingPriceValue] = useState<number>(0);
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState<string>('all');
  const [editingItemForModal, setEditingItemForModal] = useState<JewelryItem | null>(null);

  // In-app Deletion & Reset Confirmation States (Strictly NO window.confirm!)
  const [itemToDelete, setItemToDelete] = useState<JewelryItem | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<CustomerOrder | null>(null);
  const [inquiryToDelete, setInquiryToDelete] = useState<CustomerInquiry | null>(null);
  const [isClearingAllData, setIsClearingAllData] = useState(false);

  // Shop WhatsApp number
  const [shopWhatsApp, setShopWhatsApp] = useState<string>(getShopWhatsAppNumber());
  const [isSavedWhatsApp, setIsSavedWhatsApp] = useState(false);

  // Selected Inquiry for replying
  const [selectedInquiryId, setSelectedInquiryId] = useState<string>(inquiries[0]?.id || '');
  const [replyInput, setReplyInput] = useState('');

  // Subscribe to real-time notifications
  useEffect(() => {
    const unsubscribe = subscribeNotifications((alert) => {
      setNotifications((prev) => [alert, ...prev]);
      setShowNotificationToast(alert);
      setTimeout(() => setShowNotificationToast(null), 6000);
    });
    return unsubscribe;
  }, []);

  const handleRequestPush = async () => {
    const perm = await requestBrowserPushPermission();
    setPushPermission(perm);
  };

  const handleSendTestPushAlert = () => {
    triggerPushNotification({
      type: 'new_order',
      title: isBn ? '💎 টেস্ট পুশ অ্যালার্ট: আরকে জুয়েলারি' : '💎 Test Push Alert: RK Jewellery',
      message: isBn
        ? 'নতুন অর্ডার #RK-2026-TEST এসেছে: "রয়্যাল ময়ূর ২২ ক্যারেট আংটি" (৳৯৮,৫০০)। গ্রাহক: নাসরিন সুলতানা (সাইজ ১৬)।'
        : 'New order #RK-2026-TEST received for "Royal Mayur 22K Gold Bridal Ring" (৳98,500). Customer: Nasrin Sultana (Size 16).',
    });
  };

  // Price Update
  const handleStartEditPrice = (item: JewelryItem) => {
    setEditingPriceId(item.id);
    setEditingPriceValue(item.price);
  };

  const handleSavePrice = (itemId: string) => {
    const updated = updateJewelryItemPrice(itemId, editingPriceValue);
    onItemsChange(updated);
    setEditingPriceId(null);
  };

  const handleStockChange = (itemId: string, newStock: number) => {
    const updated = updateJewelryItemStock(itemId, newStock);
    onItemsChange(updated);
  };

  const handleStockStatusChange = (
    itemId: string,
    status: 'in-stock' | 'low-stock' | 'made-to-order' | 'sold-out'
  ) => {
    const updated = updateJewelryItemStockStatus(itemId, status);
    onItemsChange(updated);
  };

  // Confirmed Deletions & Clean Store Operations
  const handleConfirmDeleteItem = () => {
    if (!itemToDelete) return;
    const target = itemToDelete;
    const updated = deleteJewelryItem(target.id);
    onItemsChange(updated);
    setItemToDelete(null);
    triggerPushNotification({
      type: 'system',
      title: isBn ? '🗑️ গহনা তালিকা থেকে অপসারিত' : '🗑️ Jewelry Listing Deleted',
      message: isBn
        ? `"${target.nameBn || target.name}" ইনভেন্টরি থেকে স্থায়ীভাবে মুছে ফেলা হয়েছে।`
        : `"${target.name}" was permanently removed from inventory.`,
    });
  };

  const handleConfirmDeleteOrder = () => {
    if (!orderToDelete) return;
    const target = orderToDelete;
    const updated = deleteOrder(target.id);
    onOrdersChange(updated);
    setOrderToDelete(null);
  };

  const handleConfirmDeleteInquiry = () => {
    if (!inquiryToDelete) return;
    const target = inquiryToDelete;
    const updated = deleteInquiry(target.id);
    onInquiriesChange(updated);
    setInquiryToDelete(null);
    if (selectedInquiryId === target.id) {
      setSelectedInquiryId(updated[0]?.id || '');
    }
  };

  const handleClearAllStoreData = () => {
    const cleared = clearAllStoreData();
    onItemsChange(cleared.items);
    onOrdersChange(cleared.orders);
    onInquiriesChange(cleared.inquiries);
    setIsClearingAllData(false);
    triggerPushNotification({
      type: 'system',
      title: isBn ? '✨ সম্পূর্ণ স্টোর ডাটা ক্লিয়ার' : '✨ Store Data Cleared',
      message: isBn
        ? 'সকল ডামি ডাটা, অর্ডার ও বার্তা মুছে ফেলা হয়েছে। স্টোর সম্পূর্ণ প্রস্তুত।'
        : 'All dummy items, orders, and inquiries have been cleared. Store is completely clean.',
    });
  };

  const handleLoadSampleShowcase = () => {
    const sampleItems = loadSampleShowcaseItems();
    onItemsChange(sampleItems);
    triggerPushNotification({
      type: 'system',
      title: isBn ? '💎 নমুনা গহনা লোড করা হয়েছে' : '💎 Sample Showcase Loaded',
      message: isBn
        ? '৫টি বিশেষ গহনা ক্যাটালগে যুক্ত হয়েছে।'
        : '5 sample showcase jewelry items have been loaded into the catalogue.',
    });
  };

  const handleSaveWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    saveShopWhatsAppNumber(shopWhatsApp);
    setIsSavedWhatsApp(true);
    setTimeout(() => setIsSavedWhatsApp(false), 2500);
  };

  // Order status
  const handleOrderStatusChange = (orderId: string, status: CustomerOrder['status']) => {
    const updated = updateOrderStatus(orderId, status);
    onOrdersChange(updated);
  };

  // Inquiry reply
  const handleSendReply = (inquiryId: string) => {
    if (!replyInput.trim()) return;
    const updated = addInquiryReply(inquiryId, replyInput.trim(), 'owner', 'Proprietor (RK Jewellery)');
    onInquiriesChange(updated);
    setReplyInput('');
  };

  const filteredItems = items.filter((it) => {
    const matchesSearch =
      it.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      it.sku.toLowerCase().includes(inventorySearch.toLowerCase());
    const matchesCat = inventoryCategoryFilter === 'all' || it.category === inventoryCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const activeInquiry = inquiries.find((i) => i.id === selectedInquiryId) || inquiries[0];
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const newInquiriesCount = inquiries.filter((i) => i.status === 'new').length;

  return (
    <div className="min-h-screen bg-[#0a0b10] text-[#e5e7eb] flex flex-col font-sans-modern selection:bg-[#d4af37]/30 selection:text-white">
      {/* Floating Push Notification Toast Banner */}
      {showNotificationToast && (
        <div className="fixed top-4 right-4 z-50 max-w-md w-full bg-[#181a28] border-2 border-[#d4af37] rounded-2xl p-4 shadow-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-2 bg-[#d4af37]/20 rounded-xl text-[#d4af37] shrink-0 mt-0.5">
            <BellRing className="h-5 w-5 animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#f3e5ab] uppercase tracking-wide">
                {isBn ? 'তাৎক্ষণিক অর্ডার ও বার্তা অ্যালার্ট' : 'Instant Order & Inquiry Alert'}
              </span>
              <button
                onClick={() => setShowNotificationToast(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <h5 className="text-sm font-bold text-white mt-0.5">{showNotificationToast.title}</h5>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{showNotificationToast.message}</p>
          </div>
        </div>
      )}

      {/* Top Corporate Executive Header */}
      <header className="border-b border-slate-800 bg-[#0f1018] px-6 py-3.5 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Atelier Brand Zone (CONFIDENTIAL SECURITY: Email address hidden!) */}
          <div className="flex items-center gap-3">
            <BrandLogo size="md" subtitle={isBn ? 'মালিকানা অ্যাডমিন পোর্টাল' : 'Proprietor Executive Terminal'} />
            <div className="hidden sm:flex flex-col border-l border-slate-800 pl-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">
                  {isBn ? 'মালিকানা যাচাইকৃত অ্যাডমিন সেশন' : 'Verified Proprietor Clearance'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Header Action Strip */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Language Switcher */}
            <button
              onClick={onToggleLanguage}
              className="px-2.5 py-1.5 rounded-xl bg-[#181a28] hover:bg-[#202234] border border-[#d4af37]/30 text-xs text-[#f3e5ab] transition-all flex items-center gap-1.5 cursor-pointer font-bold"
            >
              <Globe className="h-3.5 w-3.5 text-[#d4af37]" />
              <span>{t.languageToggle}</span>
            </button>

            {/* Push Notifications Toggle */}
            <div className="flex items-center gap-2 bg-[#161824] px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <Bell className="h-3.5 w-3.5 text-[#d4af37]" />
              {pushPermission === 'granted' ? (
                <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> {isBn ? 'পুশ অ্যালার্ট চালু' : 'Push Alerts Live'}
                </span>
              ) : (
                <button
                  onClick={handleRequestPush}
                  className="text-[#f3e5ab] hover:underline text-[11px] font-bold cursor-pointer"
                >
                  {isBn ? 'পুশ অ্যালার্ট সক্রিয় করুন' : 'Enable Push Alerts'}
                </button>
              )}
              <button
                onClick={handleSendTestPushAlert}
                title="Send a sample push alert & audio chime"
                className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              >
                {isBn ? 'টেস্ট' : 'Test'}
              </button>
            </div>

            {/* Add Item Quick Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-1.5 bg-[#d4af37] hover:bg-[#e5c158] text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-[#d4af37]/20 transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{t.addItemBtn}</span>
            </button>

            {/* Public Storefront Link */}
            <button
              onClick={onExitToStore}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs transition-colors flex items-center gap-1 cursor-pointer font-medium"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>{t.customerView}</span>
            </button>

            {/* Logout */}
            <button
              onClick={() => {
                logoutOwner();
                onExitToStore();
              }}
              className="px-2.5 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer font-medium"
            >
              {t.logoutBtn}
            </button>
          </div>
        </div>
      </header>

      {/* Main Corporate Workspace */}
      <div className="max-w-7xl mx-auto w-full px-6 py-6 flex-1 flex flex-col space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-4 py-2 font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'telemetry'
                ? 'bg-[#d4af37]/20 text-[#f3e5ab] border border-[#d4af37]/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5 text-[#d4af37]" />
            <span>{t.salesTelemetry}</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-[#d4af37]/20 text-[#f3e5ab] border border-[#d4af37]/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-[#d4af37]" />
            <span>{t.inventoryManager} ({isBn ? toBnDigits(items.length) : items.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rates')}
            className={`px-4 py-2 font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'rates'
                ? 'bg-[#d4af37]/20 text-[#f3e5ab] border border-[#d4af37]/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Coins className="h-3.5 w-3.5 text-[#d4af37]" />
            <span>{isBn ? 'বাজুস বাজার দর' : 'BAJUS Rates'}</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer relative ${
              activeTab === 'orders'
                ? 'bg-[#d4af37]/20 text-[#f3e5ab] border border-[#d4af37]/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Package className="h-3.5 w-3.5 text-[#d4af37]" />
            <span>{t.ordersRequests} ({isBn ? toBnDigits(orders.length) : orders.length})</span>
            {pendingOrdersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                {isBn ? toBnDigits(pendingOrdersCount) : pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2 font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer relative ${
              activeTab === 'inquiries'
                ? 'bg-[#d4af37]/20 text-[#f3e5ab] border border-[#d4af37]/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5 text-[#d4af37]" />
            <span>{t.conciergeInquiries} ({isBn ? toBnDigits(inquiries.length) : inquiries.length})</span>
            {newInquiriesCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-sky-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                {isBn ? toBnDigits(newInquiriesCount) : newInquiriesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-4 py-2 font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'alerts'
                ? 'bg-[#d4af37]/20 text-[#f3e5ab] border border-[#d4af37]/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Bell className="h-3.5 w-3.5 text-[#d4af37]" />
            <span>{t.alertsLog} ({isBn ? toBnDigits(notifications.length) : notifications.length})</span>
          </button>
        </div>

        {/* TAB 1: Sales Telemetry */}
        {activeTab === 'telemetry' && (
          <div className="space-y-6">
            <SalesTelemetryCharts lang={lang} orders={orders} items={items} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders Stream */}
              <div className="p-5 bg-[#141620] border border-slate-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base text-white font-bold">
                    {isBn ? 'সাম্প্রতিক অর্ডারের তালিকা' : 'Recent Customer Orders'}
                  </h4>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#d4af37] hover:underline cursor-pointer font-semibold"
                  >
                    {isBn ? 'সব অর্ডার দেখুন →' : 'View All Orders →'}
                  </button>
                </div>

                <div className="space-y-3">
                  {orders.slice(0, 3).map((order) => (
                    <div
                      key={order.id}
                      className="p-3.5 bg-[#181a26] rounded-xl border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{order.customerName}</span>
                          <span className="text-[10px] text-slate-400 font-mono-numbers">
                            {order.orderNumber}
                          </span>
                        </div>
                        <div className="text-xs text-slate-300 mt-0.5">
                          {order.items[0]?.productName} · {order.items[0]?.sizeOrLength}
                        </div>
                        {order.specialRequirements && (
                          <div className="text-[11px] text-amber-300/80 italic mt-0.5">
                            "{order.specialRequirements}"
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-[#f3e5ab] font-mono-numbers">
                          {formatBDT(order.totalAmount, isBn)}
                        </div>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          order.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-300'
                            : order.status === 'in-crafting'
                            ? 'bg-sky-500/20 text-sky-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Inquiries Stream */}
              <div className="p-5 bg-[#141620] border border-slate-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base text-white font-bold">
                    {isBn ? 'গ্রাহকদের বার্তার ইনবক্স' : 'Customer Messages Awaiting Reply'}
                  </h4>
                  <button
                    onClick={() => setActiveTab('inquiries')}
                    className="text-xs text-[#d4af37] hover:underline cursor-pointer font-semibold"
                  >
                    {isBn ? 'মেসেজ খুলুন →' : 'Open Messages Dispatch →'}
                  </button>
                </div>

                <div className="space-y-3">
                  {inquiries.slice(0, 3).map((inq) => (
                    <div
                      key={inq.id}
                      className="p-3.5 bg-[#181a26] rounded-xl border border-slate-800 space-y-1.5 cursor-pointer hover:border-slate-700"
                      onClick={() => {
                        setSelectedInquiryId(inq.id);
                        setActiveTab('inquiries');
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{inq.customerName}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-1">"{inq.message}"</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{inq.productName || (isBn ? 'কাস্টম অনুরোধ' : 'Bespoke Request')}</span>
                        <span className={`font-semibold ${inq.status === 'new' ? 'text-amber-400' : 'text-slate-400'}`}>
                          {inq.status === 'new' ? (isBn ? '● উত্তর বাকি' : '● Unanswered') : (isBn ? '✓ উত্তর দেওয়া হয়েছে' : '✓ Replied')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Inventory & Price Management */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            {/* Quick WhatsApp Configuration Banner for Shop Owner */}
            <div className="p-4 bg-gradient-to-r from-[#112419] to-[#121624] border border-[#25D366]/30 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366]">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <span>{isBn ? 'দোকানের অফিসিয়াল হোয়াটসঅ্যাপ নম্বর' : 'Shop WhatsApp Quick Inquiry Number'}</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      {isBn ? 'সরাসরি যুক্ত' : 'Live Connected'}
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {isBn
                      ? 'গ্রাহকরা ফ্লোটিং হোয়াটসঅ্যাপ বাটনে চাপ দিলে সরাসরি এই নম্বরে মেসেজ পাঠাবে।'
                      : 'Customers tapping the floating WhatsApp button will connect directly to this number.'}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveWhatsApp} className="flex items-center gap-2">
                <input
                  type="text"
                  value={shopWhatsApp}
                  onChange={(e) => setShopWhatsApp(e.target.value)}
                  placeholder="8801XXXXXXXXX"
                  className="bg-[#0f111a] border border-slate-700 focus:border-[#25D366] rounded-xl px-3 py-1.5 text-xs text-white font-mono-numbers focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  {isSavedWhatsApp ? (isBn ? 'সংরক্ষিত ✓' : 'Saved ✓') : (isBn ? 'সেভ করুন' : 'Save')}
                </button>
              </form>
            </div>

            {/* Inventory Controls Bar */}
            <div className="p-4 bg-[#141620] border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-[280px]">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    placeholder={isBn ? 'গহনার নাম বা কোড দিয়ে খুঁজুন...' : 'Search by piece name or SKU...'}
                    className="w-full bg-[#181a26] border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <select
                  value={inventoryCategoryFilter}
                  onChange={(e) => setInventoryCategoryFilter(e.target.value)}
                  className="bg-[#181a26] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="all">{isBn ? 'সব ক্যাটাগরি' : 'All Categories'}</option>
                  <option value="rings">{isBn ? 'আংটি' : 'Rings'}</option>
                  <option value="necklaces">{isBn ? 'হার ও নেকলেস' : 'Necklaces'}</option>
                  <option value="bracelets">{isBn ? 'বালা ও চুড়ি' : 'Bracelets & Bala'}</option>
                  <option value="earrings">{isBn ? 'ঝুমকা ও দুল' : 'Earrings'}</option>
                  <option value="bridal-sets">{isBn ? 'ব্রাইডাল বিয়ের সেট' : 'Bridal Sets'}</option>
                </select>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 bg-[#d4af37] hover:bg-[#e5c158] text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>{t.addItemBtn}</span>
                </button>

                <button
                  onClick={handleLoadSampleShowcase}
                  className="px-3 py-2 bg-[#181a26] hover:bg-[#202234] border border-[#d4af37]/40 text-[#f3e5ab] font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  title={isBn ? 'ক্লায়েন্ট ডেমোর জন্য ৫টি নমুনা গহনা লোড করুন' : 'Load 5 sample showcase items for client review'}
                >
                  <span>{isBn ? '+ নমুনা গহনা' : '+ Sample Pieces'}</span>
                </button>

                <button
                  onClick={() => setIsClearingAllData(true)}
                  className="px-3 py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  title={isBn ? 'সমস্ত ডামি ডাটা মুছে ফ্রেশ স্টোর তৈরি করুন' : 'Clear all dummy data for clean final client delivery'}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>{isBn ? 'সকল ডাটা মুছুন' : 'Clear All Data'}</span>
                </button>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-[#141620] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#181a28] border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4">{isBn ? 'গহনার নাম ও কোড' : 'Jewellery Item & SKU'}</th>
                      <th className="py-3.5 px-4">{isBn ? 'ওজন ও স্পেক্স' : 'Weight & Specs'}</th>
                      <th className="py-3.5 px-4">{isBn ? 'ছবি (মিনিমাম ৩)' : 'Images (Min 3)'}</th>
                      <th className="py-3.5 px-4">{isBn ? 'শপ স্টক স্ট্যাটাস' : 'Shop Stock Status'}</th>
                      <th className="py-3.5 px-4">{isBn ? 'মজুত সংখ্যা' : 'Stock Qty'}</th>
                      <th className="py-3.5 px-4">{isBn ? 'মূল্য (টাকা ৳)' : 'Price (BDT ৳)'}</th>
                      <th className="py-3.5 px-4 text-right">{isBn ? 'অ্যাকশন (আপডেট ও ডিলিট)' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-850/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="font-bold text-white text-sm">
                                {isBn && item.nameBn ? item.nameBn : item.name}
                              </div>
                              <div className="text-[10px] text-[#d4af37] font-mono-numbers uppercase font-semibold">
                                {item.sku} · {item.collection}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-300">
                          <div>{item.metal.replace(/-/g, ' ')}</div>
                          <div className="text-slate-400 text-[11px]">
                            {item.weightGrams}g ({item.weightVhori || 1} {isBn ? 'ভরি' : 'Vhori'})
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-emerald-400 font-mono-numbers">
                              {isBn ? toBnDigits(item.images.length) : item.images.length}
                            </span>
                            <span className="text-slate-400 text-[10px]">{isBn ? 'টি কোণ' : 'angles'}</span>
                          </div>
                          <span className="text-[10px] text-emerald-500 font-semibold">✓ Verified $\ge 3$</span>
                        </td>

                        {/* SHOP STOCK STATUS DROPDOWN (Direct update from table) */}
                        <td className="py-3.5 px-4">
                          <select
                            value={item.stockStatus || 'in-stock'}
                            onChange={(e) =>
                              handleStockStatusChange(
                                item.id,
                                e.target.value as 'in-stock' | 'low-stock' | 'made-to-order' | 'sold-out'
                              )
                            }
                            className={`text-[11px] font-bold px-2 py-1 rounded-lg border cursor-pointer focus:outline-none transition-colors ${
                              item.stockStatus === 'sold-out'
                                ? 'bg-red-950/70 text-red-300 border-red-500/50'
                                : item.stockStatus === 'low-stock'
                                ? 'bg-amber-950/70 text-amber-300 border-amber-500/50'
                                : item.stockStatus === 'made-to-order'
                                ? 'bg-sky-950/70 text-sky-300 border-sky-500/50'
                                : 'bg-emerald-950/70 text-emerald-300 border-emerald-500/50'
                            }`}
                          >
                            <option value="in-stock">{isBn ? 'মজুত আছে (In Stock)' : 'In Stock'}</option>
                            <option value="low-stock">{isBn ? 'সীমিত স্টক (Low Stock)' : 'Low Stock'}</option>
                            <option value="made-to-order">{isBn ? 'অর্ডারে তৈরি (Made to Order)' : 'Made to Order'}</option>
                            <option value="sold-out">{isBn ? 'স্টক শেষ (Sold Out)' : 'Sold Out'}</option>
                          </select>
                        </td>

                        {/* Stock Counter */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleStockChange(item.id, Math.max(0, item.stock - 1))}
                              className="w-6 h-6 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md flex items-center justify-center font-bold text-xs cursor-pointer"
                            >
                              -
                            </button>
                            <span className="font-mono-numbers text-xs font-bold px-1.5">
                              {isBn ? toBnDigits(item.stock) : item.stock}
                            </span>
                            <button
                              onClick={() => handleStockChange(item.id, item.stock + 1)}
                              className="w-6 h-6 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md flex items-center justify-center font-bold text-xs cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        {/* Inline price edit in BDT */}
                        <td className="py-3.5 px-4">
                          {editingPriceId === item.id ? (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-slate-400">৳</span>
                              <input
                                type="number"
                                step="1000"
                                value={editingPriceValue}
                                onChange={(e) => setEditingPriceValue(Number(e.target.value))}
                                className="w-28 bg-black border border-[#d4af37] rounded-xl px-2 py-1 text-xs text-white font-mono-numbers focus:outline-none"
                              />
                              <button
                                onClick={() => handleSavePrice(item.id)}
                                className="p-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white cursor-pointer"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingPriceId(null)}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 cursor-pointer"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-[#f3e5ab] font-mono-numbers">
                                {formatBDT(item.price, isBn)}
                              </span>
                              <button
                                onClick={() => handleStartEditPrice(item)}
                                className="p-1 text-slate-400 hover:text-[#d4af37] transition-colors cursor-pointer"
                                title="Edit price"
                              >
                                <Edit2 className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </td>

                        {/* Actions: Update uploaded jewelry item & delete post (Smooth In-App Confirmation Modal!) */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingItemForModal(item)}
                              className="px-2.5 py-1.5 bg-[#d4af37]/20 hover:bg-[#d4af37]/35 text-[#f3e5ab] hover:text-white rounded-lg border border-[#d4af37]/50 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title={isBn ? 'গহনার পোস্ট ও স্টক আপডেট করুন' : 'Update uploaded jewelry item'}
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                              <span>{isBn ? 'আপডেট' : 'Update'}</span>
                            </button>
                            <button
                              onClick={() => setItemToDelete(item)}
                              className="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-200 border border-red-800/50 rounded-lg transition-colors cursor-pointer"
                              title={isBn ? 'পোস্ট ডিলিট করুন' : 'Delete listing'}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredItems.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-14 text-center">
                          <Package className="h-9 w-9 text-slate-600 mx-auto mb-2" />
                          <div className="text-sm font-bold text-white">
                            {isBn ? 'ইনভেন্টরিতে কোনো গহনা নেই' : 'No Jewelry Items in Inventory'}
                          </div>
                          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                            {isBn
                              ? 'আপনার ক্লায়েন্টের জন্য নতুন গহনা যোগ করতে "+ গহনা যোগ করুন" চাপুন অথবা প্রদর্শনের জন্য নমুনা কালেকশন লোড করুন।'
                              : 'Upload your fine jewelry pieces using "+ Add Jewellery Item" or load sample showcase pieces.'}
                          </p>
                          <div className="flex items-center justify-center gap-3 mt-4">
                            <button
                              onClick={() => setIsAddModalOpen(true)}
                              className="px-4 py-2 bg-[#d4af37] text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#d4af37]/20"
                            >
                              <Plus className="h-4 w-4" />
                              <span>{isBn ? 'নতুন গহনা যোগ করুন' : 'Add New Jewellery Item'}</span>
                            </button>
                            <button
                              onClick={handleLoadSampleShowcase}
                              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs border border-slate-700 cursor-pointer"
                            >
                              <span>{isBn ? 'নমুনা গহনা লোড করুন' : 'Load Sample Pieces'}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: BAJUS Live Rates Management */}
        {activeTab === 'rates' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#171a2b] via-[#141624] to-[#10121d] border border-[#d4af37]/35 shadow-xl">
              <div>
                <div className="inline-flex items-center gap-2 text-xs text-[#d4af37] font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{isBn ? 'বাজুস (BAJUS) মানদণ্ড লাইভ রেট কনফিগারেশন' : 'Official BAJUS Live Rate Configuration'}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mt-1">
                  {isBn ? 'বাংলাদেশে স্বর্ণ ও রৌপ্যের বাজার দর ব্যবস্থাপনা' : 'Bangladesh Gold & Silver Live Rates Management'}
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  {isBn
                    ? 'বাংলাদেশ জুয়েলার্স অ্যাসোসিয়েশন (BAJUS) এর নতুন দর অনুযায়ী প্রতি ভরি স্বর্ণ ও রূপার সঠিক মূল্য লিখুন। প্রতি গ্রামের মূল্য ও গ্রাহকের গোল্ড ক্যালকুলেটর স্বয়ংক্রিয়ভাবে আপডেট হবে।'
                    : 'Configure the real market price per Vhori in BDT. The per-gram price (11.664g standard) and customer storefront calculator sync immediately.'}
                </p>
              </div>

              {isRatesSaved && (
                <div className="px-4 py-2 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>{isBn ? 'সফলভাবে সংরক্ষিত ও লাইভ হয়েছে!' : 'Rates Saved & Published Live!'}</span>
                </div>
              )}
            </div>

            <form onSubmit={handleOwnerSaveRates} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ownerRates.map((rate) => {
                  const is22K = rate.purity === '22K';
                  return (
                    <div
                      key={rate.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        is22K
                          ? 'bg-gradient-to-b from-[#221f13] to-[#151726] border-[#d4af37] shadow-lg shadow-[#d4af37]/10'
                          : 'bg-[#151726] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#f3e5ab]">
                            {rate.purity}
                          </span>
                          <h4 className="text-sm font-bold text-white">
                            {isBn ? rate.nameBn : rate.name}
                          </h4>
                        </div>
                        <span className="text-[10px] text-slate-400 uppercase font-mono">
                          {rate.metal}
                        </span>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div>
                          <label className="block text-xs text-slate-300 font-semibold mb-1">
                            {isBn ? 'প্রতি ভরি দর (টাকা)' : 'Price Per Vhori (BDT)'}
                            <span className="text-[10px] text-slate-500 ml-1 font-normal">(১১.৬৬৪ গ্রাম)</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-2 text-slate-500 font-bold text-xs">৳</span>
                            <input
                              type="number"
                              min="100"
                              step="1"
                              value={rate.pricePerVhori || ''}
                              onChange={(e) => handleOwnerPriceChange(rate.id, e.target.value)}
                              className="w-full bg-[#0d0f17] border border-slate-700 focus:border-[#d4af37] rounded-xl pl-8 pr-3 py-2 text-sm text-white font-mono-numbers font-bold focus:outline-none"
                              required
                            />
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-[#0f111a] border border-slate-800 flex items-center justify-between text-xs">
                          <span className="text-slate-400">{isBn ? 'প্রতি গ্রাম দর (স্বয়ংক্রিয়):' : 'Per Gram (Auto-calc):'}</span>
                          <span className="text-[#f3e5ab] font-bold font-mono-numbers">
                            {formatBDT(rate.pricePerGram, isBn)}
                          </span>
                        </div>

                        <div>
                          <label className="block text-xs text-slate-300 font-semibold mb-1">
                            {isBn ? '২৪ ঘণ্টার পরিবর্তন (+ / - টাকা)' : '24h Change (BDT)'}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-2 text-slate-500 font-bold text-xs">৳</span>
                            <input
                              type="number"
                              step="1"
                              value={rate.change24h || ''}
                              onChange={(e) => handleOwner24hChange(rate.id, e.target.value)}
                              className="w-full bg-[#0d0f17] border border-slate-700 focus:border-[#d4af37] rounded-xl pl-8 pr-3 py-2 text-xs text-emerald-400 font-mono-numbers font-semibold focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="text-[10px] text-slate-500 pt-1 flex items-center justify-between">
                          <span>{rate.lastUpdated}</span>
                          <span className="text-emerald-400 font-bold">+{rate.changePercent}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Actions Bar */}
              <div className="p-4 bg-[#141624] border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <ShieldCheck className="h-4 w-4 text-[#d4af37] shrink-0" />
                  <span>
                    {isBn
                      ? 'দর পরিবর্তন করার সাথে সাথে ক্যাটালগের গ্রাহক ভিউ এবং গোল্ড ক্যালকুলেটর রিয়েল-টাইমে আপডেট হবে।'
                      : 'Changes take effect immediately across customer storefront and live jewelry calculators.'}
                  </span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleOwnerResetRates}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-700 hover:border-[#d4af37] text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-[#d4af37]" />
                    <span>{isBn ? 'অফিশিয়াল বাজুস বেঞ্চমার্কে রিসেট' : 'Reset to Official BAJUS'}</span>
                  </button>

                  <button
                    type="submit"
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-slate-950 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#d4af37]/20 transition-all cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    <span>{isBn ? 'দর সেভ ও লাইভ প্রকাশ করুন' : 'Save & Publish Rates'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: Orders Management */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl text-white font-bold">
                {isBn ? 'গ্রাহকদের অর্ডার ও ডেলিভারি ডায়েরি' : 'Client Orders & Delivery Details'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isBn
                  ? 'গ্রাহকের যোগাযোগের পূর্ণ তথ্য এবং নির্দিষ্ট অর্ডারের চাহিদা রিয়েল-টাইমে সংরক্ষিত।'
                  : 'Real-time pipeline containing full customer contact details and exact requirements.'}
              </p>
            </div>

            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 bg-[#141620] border border-slate-800 rounded-2xl space-y-4 hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono-numbers text-[#d4af37] font-bold">
                        {order.orderNumber}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs text-slate-400">
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-medium">
                        {isBn ? 'স্ট্যাটাস:' : 'Status:'}
                      </span>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleOrderStatusChange(order.id, e.target.value as CustomerOrder['status'])
                        }
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                          order.status === 'pending'
                            ? 'bg-amber-950/40 text-amber-300 border-amber-600/50'
                            : order.status === 'confirmed'
                            ? 'bg-blue-950/40 text-blue-300 border-blue-600/50'
                            : order.status === 'in-crafting'
                            ? 'bg-purple-950/40 text-purple-300 border-purple-600/50'
                            : order.status === 'shipped'
                            ? 'bg-sky-950/40 text-sky-300 border-sky-600/50'
                            : 'bg-emerald-950/40 text-emerald-300 border-emerald-600/50'
                        }`}
                      >
                        <option value="pending">{isBn ? 'অপেক্ষমান (Pending)' : 'Pending Atelier Review'}</option>
                        <option value="confirmed">{isBn ? 'নিশ্চিতকৃত (Confirmed)' : 'Confirmed by Goldsmith'}</option>
                        <option value="in-crafting">{isBn ? 'তৈরি চলছে (In Crafting)' : 'In Crafting & Polishing'}</option>
                        <option value="shipped">{isBn ? 'কুরিয়ারে প্রেরিত (Shipped)' : 'Dispatched via Courier'}</option>
                        <option value="delivered">{isBn ? 'ডেলিভার্ড (Delivered)' : 'Delivered & Sealed'}</option>
                      </select>

                      <button
                        onClick={() => setOrderToDelete(order)}
                        className="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-200 border border-red-800/50 rounded-lg transition-colors cursor-pointer"
                        title={isBn ? 'অর্ডার রেকর্ড মুছে ফেলুন' : 'Delete order record'}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                    <div className="space-y-1.5 p-3.5 bg-[#181a26] rounded-xl border border-slate-800/80">
                      <span className="text-[11px] font-bold text-[#f3e5ab] uppercase tracking-wider block mb-1">
                        {isBn ? 'গ্রাহকের তথ্য' : 'Client Dossier'}
                      </span>
                      <div>
                        <span className="text-slate-400">{isBn ? 'নাম: ' : 'Name: '}</span>
                        <span className="font-bold text-white">{order.customerName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">{isBn ? 'ইমেইল: ' : 'Email: '}</span>
                        <a href={`mailto:${order.customerEmail}`} className="text-sky-400 hover:underline">
                          {order.customerEmail}
                        </a>
                      </div>
                      <div>
                        <span className="text-slate-400">{isBn ? 'মোবাইল: ' : 'Phone: '}</span>
                        <span className="text-slate-200">{order.customerPhone}</span>
                      </div>
                      <div className="pt-1 text-[11px] text-slate-400">
                        <span>{isBn ? 'ঠিকানা: ' : 'Address: '}</span>
                        <span className="text-slate-300">
                          {order.shippingAddress}, {order.city}, {order.district}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 p-3.5 bg-[#181a26] rounded-xl border border-slate-800/80">
                      <span className="text-[11px] font-bold text-[#f3e5ab] uppercase tracking-wider block mb-1">
                        {isBn ? 'গ্রাহকের চাহিদা ও মাপ' : 'Customer Specifications'}
                      </span>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="font-bold text-white">{item.productName}</div>
                          <div className="text-slate-300">
                            {isBn ? 'মাপ / সাইজ: ' : 'Requested Size: '}
                            <span className="font-bold text-[#f3e5ab]">{item.sizeOrLength}</span>
                          </div>
                          {item.engraving && (
                            <div className="text-emerald-400 italic font-medium">
                              {isBn ? 'খোদাই নাম: ' : 'Bespoke Engraving: '} "{item.engraving}"
                            </div>
                          )}
                        </div>
                      ))}
                      {order.specialRequirements ? (
                        <div className="pt-2 text-[11px] border-t border-slate-700/60 text-amber-200">
                          <span className="font-bold block text-amber-400">{isBn ? 'বিশেষ নোট:' : 'Special Notes:'}</span>
                          "{order.specialRequirements}"
                        </div>
                      ) : (
                        <div className="pt-2 text-[11px] text-slate-500">
                          {isBn ? 'স্ট্যান্ডার্ড ব্রাইডাল প্যাকেজিং।' : 'Standard luxury packaging requested.'}
                        </div>
                      )}
                    </div>

                    <div className="p-3.5 bg-[#181a26] rounded-xl border border-slate-800/80 flex flex-col justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-[#f3e5ab] uppercase tracking-wider block mb-1">
                          {isBn ? 'মূল্য পরিশোধ বিবরণ' : 'Payment Summary'}
                        </span>
                        <div className="flex items-center gap-3 mt-2">
                          <img
                            src={order.items[0]?.image}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="text-lg font-bold text-white font-mono-numbers text-[#f3e5ab]">
                              {formatBDT(order.totalAmount, isBn)}
                            </div>
                            <div className="text-[11px] text-slate-400 capitalize">
                              {order.paymentMethod.replace(/-/g, ' ')}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 text-[11px] text-emerald-400 font-semibold">
                        {isBn ? 'অর্ডার রেকর্ড নিশ্চিত' : 'Payment Authorization Confirmed'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {orders.length === 0 && (
                <div className="py-16 text-center bg-[#141620] rounded-2xl border border-slate-800 space-y-2">
                  <Package className="h-8 w-8 text-slate-600 mx-auto" />
                  <h4 className="text-sm font-bold text-white">
                    {isBn ? 'এখনও কোনো গ্রাহক অর্ডার নেই' : 'No Customer Orders Yet'}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    {isBn
                      ? 'গ্রাহকরা ওয়েবসাইট থেকে অর্ডার সাবমিট করলে তা এখানে তাৎক্ষণিক লাইভ প্রদর্শিত হবে।'
                      : 'When clients submit orders from the store, they will appear here live with push notifications.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: Concierge Inquiries */}
        {activeTab === 'inquiries' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[640px]">
            <div className="lg:col-span-5 bg-[#141620] border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
              <div className="p-3.5 border-b border-slate-800 bg-[#161824] flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  {isBn ? 'গ্রাহকদের বার্তা সমাহার' : 'Client Inquiry Messages'}
                </span>
                <span className="text-xs text-slate-400">
                  {isBn ? `${toBnDigits(inquiries.length)} টি থ্রেড` : `${inquiries.length} threads`}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
                {inquiries.map((inq) => (
                  <button
                    key={inq.id}
                    onClick={() => setSelectedInquiryId(inq.id)}
                    className={`w-full p-4 text-left transition-colors flex items-start gap-3 cursor-pointer ${
                      activeInquiry?.id === inq.id
                        ? 'bg-[#181b2c] border-l-3 border-[#d4af37]'
                        : 'hover:bg-slate-850/40'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-xs text-[#f3e5ab] font-bold shrink-0">
                      {inq.customerName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate">{inq.customerName}</span>
                        <span className="text-[10px] text-slate-500 font-mono-numbers">
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#d4af37] truncate mt-0.5 font-medium">
                        {inq.productName || (isBn ? 'সাধারণ অনুসন্ধান' : 'General Atelier Inquiry')}
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-1">"{inq.message}"</p>
                    </div>
                  </button>
                ))}

                {inquiries.length === 0 && (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    <MessageSquare className="h-6 w-6 mx-auto mb-2 text-slate-600" />
                    <span>{isBn ? 'কোনো বার্তা অপেক্ষমান নেই' : 'No customer messages'}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#141620] border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
              {activeInquiry ? (
                <>
                  <div className="p-4 border-b border-slate-800 bg-[#161824] flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{activeInquiry.customerName}</h4>
                        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                          {activeInquiry.inquiryType.replace(/-/g, ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {activeInquiry.customerEmail} · {activeInquiry.customerPhone || 'No phone'}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {activeInquiry.productName && (
                        <div className="text-right text-xs">
                          <div className="text-slate-400">{isBn ? 'গহনা:' : 'Regarding:'}</div>
                          <div className="font-bold text-[#f3e5ab]">{activeInquiry.productName}</div>
                        </div>
                      )}
                      <button
                        onClick={() => setInquiryToDelete(activeInquiry)}
                        className="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-200 border border-red-800/50 rounded-lg transition-colors cursor-pointer"
                        title={isBn ? 'এই বার্তা থ্রেড ডিলিট করুন' : 'Delete conversation thread'}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#0d0e14]/50">
                    {activeInquiry.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className={`flex flex-col max-w-[80%] ${
                          reply.sender === 'owner' ? 'ml-auto items-end' : 'mr-auto items-start'
                        }`}
                      >
                        <span className="text-[10px] text-slate-400 mb-1 px-1">
                          {reply.senderName} · {new Date(reply.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <div
                          className={`p-3 rounded-2xl text-xs leading-relaxed ${
                            reply.sender === 'owner'
                              ? 'bg-[#d4af37] text-slate-950 font-bold rounded-tr-none'
                              : 'bg-[#1e202e] text-white border border-slate-700 rounded-tl-none'
                          }`}
                        >
                          {reply.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 border-t border-slate-800 bg-[#161824] flex items-center gap-2">
                    <input
                      type="text"
                      value={replyInput}
                      onChange={(e) => setReplyInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendReply(activeInquiry.id);
                      }}
                      placeholder={isBn ? `${activeInquiry.customerName}-কে উত্তর লিখুন...` : `Reply to ${activeInquiry.customerName}...`}
                      className="flex-1 bg-[#10111a] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                    <button
                      onClick={() => handleSendReply(activeInquiry.id)}
                      className="px-4 py-2 bg-[#d4af37] hover:bg-[#e5c158] text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>{isBn ? 'উত্তর দিন' : 'Reply'}</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
                  {isBn ? 'বামপাশ থেকে একটি বার্তা থ্রেড নির্বাচন করুন।' : 'Select a message thread on the left.'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: Alerts Log */}
        {activeTab === 'alerts' && (
          <div className="p-5 bg-[#141620] border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl text-white font-bold">
                  {isBn ? 'তাৎক্ষণিক পুশ নোটিফিকেশন লগ' : 'Instant Order & Push Notification Log'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isBn ? 'নতুন অর্ডার ও বার্তার অডিও সংকেত সহ পুশ হিস্ট্রি' : 'Real-time alert records delivered with crystal audio chime.'}
                </p>
              </div>
              <button
                onClick={handleSendTestPushAlert}
                className="px-3.5 py-1.5 bg-[#d4af37] text-slate-950 font-bold rounded-xl text-xs cursor-pointer"
              >
                {isBn ? 'টেস্ট অ্যালার্ট দিন' : 'Trigger Test Chime'}
              </button>
            </div>

            <div className="space-y-3">
              {notifications.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3.5 bg-[#181a26] border border-slate-800 rounded-xl flex items-start gap-3"
                >
                  <div className="p-2 bg-[#d4af37]/15 rounded-xl text-[#d4af37] shrink-0 mt-0.5">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{alert.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono-numbers">
                        {new Date(alert.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Jewelry Modal (Requires >= 3 images) */}
      <AddJewelryModal
        lang={lang}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onItemAdded={(newItem) => {
          const updated = [newItem, ...items];
          onItemsChange(updated);
        }}
      />

      {/* Edit Jewelry & Shop Stock Status Modal */}
      <EditJewelryModal
        lang={lang}
        isOpen={!!editingItemForModal}
        item={editingItemForModal}
        onClose={() => setEditingItemForModal(null)}
        onItemUpdated={(updatedItem) => {
          const updated = updateJewelryItem(updatedItem);
          onItemsChange(updated);
          setEditingItemForModal(null);
        }}
        onItemDeleted={(id) => {
          const updated = deleteJewelryItem(id);
          onItemsChange(updated);
          setEditingItemForModal(null);
        }}
      />

      {/* 1. In-App Delete Jewelry Item Modal (Replaces window.confirm) */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#161826] border border-red-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 bg-red-950/60 rounded-xl border border-red-500/30">
                <Trash2 className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  {isBn ? 'গহনা লিস্টিং ডিলিট নিশ্চিতকরণ' : 'Confirm Jewelry Deletion'}
                </h4>
                <p className="text-xs text-slate-400">
                  {isBn ? 'এই অ্যাকশনটি স্থায়ী এবং অপরিবর্তনীয়।' : 'This action is permanent and cannot be undone.'}
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#0f1019] border border-slate-800 rounded-xl flex items-center gap-3">
              <img
                src={itemToDelete.images[0]}
                alt={itemToDelete.name}
                className="w-12 h-12 rounded-lg object-cover border border-slate-700 shrink-0"
              />
              <div className="flex-1 min-w-0 text-xs">
                <div className="font-bold text-white truncate">
                  {isBn && itemToDelete.nameBn ? itemToDelete.nameBn : itemToDelete.name}
                </div>
                <div className="text-slate-400 text-[11px] font-mono-numbers mt-0.5">
                  {itemToDelete.sku} · {formatBDT(itemToDelete.price, isBn)}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              {isBn
                ? `আপনি কি নিশ্চিত যে "${itemToDelete.nameBn || itemToDelete.name}" গহনাটি ইনভেন্টরি থেকে সম্পূর্ণ মুছে ফেলতে চান?`
                : `Are you sure you want to permanently delete "${itemToDelete.name}" from your store inventory?`}
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={handleConfirmDeleteItem}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-lg shadow-red-600/30 flex items-center gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{isBn ? 'হ্যাঁ, ডিলিট করুন' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. In-App Delete Customer Order Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#161826] border border-red-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 bg-red-950/60 rounded-xl border border-red-500/30">
                <Trash2 className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  {isBn ? 'অর্ডার রেকর্ড মুছে ফেলুন' : 'Delete Customer Order Record'}
                </h4>
                <p className="text-xs text-slate-400">
                  {isBn ? 'অর্ডার ডাটাবেজ থেকে মুছে ফেলা হবে।' : 'Permanently remove this order from pipeline.'}
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#0f1019] border border-slate-800 rounded-xl text-xs space-y-1">
              <div className="font-bold text-white flex items-center justify-between">
                <span>{orderToDelete.orderNumber}</span>
                <span className="text-[#f3e5ab] font-mono-numbers">{formatBDT(orderToDelete.totalAmount, isBn)}</span>
              </div>
              <div className="text-slate-400">
                {isBn ? 'গ্রাহক: ' : 'Customer: '} {orderToDelete.customerName} ({orderToDelete.customerPhone})
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setOrderToDelete(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={handleConfirmDeleteOrder}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-lg shadow-red-600/30 flex items-center gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{isBn ? 'ডিলিট করুন' : 'Delete Order'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. In-App Delete Inquiry Modal */}
      {inquiryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#161826] border border-red-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 bg-red-950/60 rounded-xl border border-red-500/30">
                <Trash2 className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  {isBn ? 'বার্তা থ্রেড মুছে ফেলুন' : 'Delete Inquiry Thread'}
                </h4>
                <p className="text-xs text-slate-400">
                  {isBn ? 'এই গ্রাহকের বার্তার ইতিহাস মুছে যাবে।' : 'Delete conversation history.'}
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#0f1019] border border-slate-800 rounded-xl text-xs space-y-1">
              <div className="font-bold text-white">{inquiryToDelete.customerName}</div>
              <p className="text-slate-400 line-clamp-2">"{inquiryToDelete.message}"</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setInquiryToDelete(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={handleConfirmDeleteInquiry}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-lg shadow-red-600/30 flex items-center gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{isBn ? 'ডিলিট করুন' : 'Delete Thread'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Clear All Dummy Data Confirmation Modal */}
      {isClearingAllData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#161826] border-2 border-red-500/60 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-3 bg-red-950/70 rounded-2xl border border-red-500/40">
                <Trash2 className="h-7 w-7 text-red-400 animate-pulse" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">
                  {isBn ? 'সকল ডামি ডাটা মুছে ফেলবেন?' : 'Clear Entire Web App Data?'}
                </h4>
                <p className="text-xs text-red-300">
                  {isBn ? 'ক্লায়েন্টকে পাঠানোর জন্য ফ্রেশ স্টোর তৈরি হবে।' : 'Prepare 100% clean store for your client.'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {isBn
                ? 'এই অপশনটি নিশ্চিত করলে সব ডামি গহনা লিস্টিং, ডামি অর্ডার এবং টেস্ট ইনকোয়ারি মুছে যাবে। আপনার ক্লায়েন্ট একটি সম্পূর্ণ পরিষ্কার এবং ফ্রেশ জুয়েলারি স্টোর পাবে।'
                : 'This will purge all mock orders, dummy inquiries, and catalog listings, delivering a completely pristine, zero-dummy store ready for client delivery.'}
            </p>

            <div className="p-3 bg-red-950/30 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <span className="font-bold">⚠️</span>
              <span>{isBn ? 'প্রয়োজনে আপনি যে কোনো সময় "+ নমুনা গহনা" বোতামে চাপ দিয়ে পুনরায় টেস্ট আইটেম দেখতে পারবেন।' : 'You can still reload sample showcase pieces at any time using the "+ Sample Pieces" button.'}</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsClearingAllData(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={handleClearAllStoreData}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-lg shadow-red-600/40 flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>{isBn ? 'হ্যাঁ, সমস্ত ডাটা মুছুন' : 'Yes, Clear All Data'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
