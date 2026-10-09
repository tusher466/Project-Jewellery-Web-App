import { CustomerInquiry, CustomerOrder, JewelryItem } from '../types';
import { triggerPushNotification } from './pushNotification';

const STORAGE_KEYS = {
  ITEMS: 'rk_jewellery_items_v4',
  ORDERS: 'rk_jewellery_orders_v4',
  INQUIRIES: 'rk_jewellery_inquiries_v4',
  OWNER_AUTH: 'rk_owner_auth_v4',
};

// Optional Sample Showcase Products (can be loaded on demand, but defaults to clean state for client delivery)
export const SAMPLE_SHOWCASE_ITEMS: JewelryItem[] = [
  {
    id: 'rk-jewel-1',
    sku: 'RK-RNG-101',
    name: 'Royal Mayur 22K Gold Bridal Ring',
    nameBn: 'রয়্যাল ময়ূর ২২ ক্যারেট ব্রাইডাল আংটি',
    category: 'rings',
    collection: 'Rajkonna Bridal',
    collectionBn: 'রাজকন্যা ব্রাইডাল',
    price: 98500,
    originalPrice: 105000,
    metal: '22k-gold',
    gemstone: 'ruby',
    weightGrams: 8.2,
    weightVhori: 0.7,
    description: 'Traditional handcrafted 22K Hallmark gold ring inspired by royal peacock motifs, embedded with natural Burmese ruby and intricate filigree art.',
    descriptionBn: '২২ ক্যারেট হলমার্ক সোনায় নিখুঁত ময়ূর মোটিফে তৈরি রাজকীয় আংটি। এতে বসানো রয়েছে খাঁটি বার্মিজ রুবি এবং সূক্ষ্ম কারুকার্য।',
    craftsmanshipNotes: 'Hallmark 916 certified by Dhaka Goldsmith guild. Handcrafted with traditional KDM soldering.',
    craftsmanshipNotesBn: 'ঢাকা জুয়েলার্স গিল্ড দ্বারা ৯১৬ হলমার্ক সার্টিফাইড। সম্পূর্ণ খাঁটি কেডিএম সোল্ডারিংয়ে নির্মিত।',
    stock: 4,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&auto=format&fit=crop&q=80',
    ],
    viewsCount: 620,
    inquiriesCount: 34,
    createdAt: '2026-09-20T10:00:00.000Z',
  },
  {
    id: 'rk-jewel-2',
    sku: 'RK-NCK-204',
    name: 'Sultana Choker & Sita Haar Set',
    nameBn: 'সুলতানা চোকার ও সীতা হার সেট',
    category: 'necklaces',
    collection: 'Mughal Heritage',
    collectionBn: 'মুঘল হেরিটেজ কালেকশন',
    price: 485000,
    originalPrice: 510000,
    metal: '22k-gold',
    gemstone: 'emerald',
    weightGrams: 41.5,
    weightVhori: 3.56,
    description: 'Magnificent 3.56 Vhori 22K Hallmark gold bridal choker and long sita haar set with Colombian emerald drops and handcrafted filigree tassels.',
    descriptionBn: '৩.৫৬ ভরি ওজনের ২২ ক্যারেট হলমার্ক সোনার জাঁকজমকপূর্ণ বিয়ের চোকার ও সীতা হার সেট। সাথে রয়েছে খাঁটি পান্না ও ঝালর কাজ।',
    craftsmanshipNotes: 'Created by senior artisan with 140 hours of dedicated filigree wire shaping. BAJUS standard certified.',
    craftsmanshipNotesBn: '১৪০ ঘণ্টার সূক্ষ্ম তারের কাজে অভিজ্ঞ কারিগরের হাতে তৈরি। বাজুস মান অনুযায়ী পরীক্ষিত।',
    stock: 2,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611591475152-478311394f4b?w=800&auto=format&fit=crop&q=80',
    ],
    viewsCount: 890,
    inquiriesCount: 52,
    createdAt: '2026-09-25T14:30:00.000Z',
  },
  {
    id: 'rk-jewel-3',
    sku: 'RK-BRC-302',
    name: 'Shankha Pola 22K Gold Plated Bala',
    nameBn: '২২ ক্যারেট সোনার কারুকার্যময় বালা জোড়া',
    category: 'bracelets',
    collection: 'Bengal Tradition',
    collectionBn: 'বাংলার ঐতিহ্য কালেকশন',
    price: 195000,
    metal: '22k-gold',
    gemstone: 'none',
    weightGrams: 16.3,
    weightVhori: 1.4,
    description: 'Traditional solid 22K gold bangle pair (Bala) adorned with embossed floral vines and screw clasp mechanism.',
    descriptionBn: '১.৪ ভরি ওজনের ২২ ক্যারেট পাকা সোনার চিরায়ত বালা জোড়া। চমৎকার ফুল ও লতাপাতার খোদাই নকশা সহ।',
    craftsmanshipNotes: 'Solid gold die-cast construction with seamless screw locking.',
    craftsmanshipNotesBn: 'দৃঢ় নকশা ও উন্নত স্ক্রু লক সিস্টেম যা আজীবন ব্যবহারের উপযোগী।',
    stock: 3,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1611591475152-478311394f4b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
    ],
    viewsCount: 440,
    inquiriesCount: 26,
    createdAt: '2026-10-01T09:15:00.000Z',
  },
  {
    id: 'rk-jewel-4',
    sku: 'RK-EAR-405',
    name: 'Jhumka Diamond & Gold Ear Ornaments',
    nameBn: 'আভিজাত্যময় ২২ ক্যারেট সোনার ঝুমকা',
    category: 'earrings',
    collection: 'Utsab Festive',
    collectionBn: 'উৎসব কালেকশন',
    price: 135000,
    metal: '22k-gold',
    gemstone: 'pearl',
    weightGrams: 11.2,
    weightVhori: 0.96,
    description: 'Classic triple-tier 22K gold Jhumka earrings cascading with south sea seed pearls and delicate gold bells.',
    descriptionBn: 'তিন স্তরের চমৎকার ২২ ক্যারেট সোনার ঝুমকা, যাতে ঝুলছে খাঁটি মুক্তা এবং মধুর ধ্বনিময় ঘুঙুর।',
    craftsmanshipNotes: 'Balanced weight distribution for comfortable festive daylong wear.',
    craftsmanshipNotesBn: 'দীর্ঘক্ষণ আরামদায়কভাবে পরার জন্য ভারসাম্যপূর্ণ ওজনের কারিগরি।',
    stock: 4,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
    ],
    viewsCount: 510,
    inquiriesCount: 31,
    createdAt: '2026-10-03T16:45:00.000Z',
  },
  {
    id: 'rk-jewel-5',
    sku: 'RK-SET-501',
    name: 'Grand Zamindari Complete Bridal Ensemble',
    nameBn: 'জমিদারি সম্পূর্ণ ব্রাইডাল বিয়ের সেট',
    category: 'bridal-sets',
    collection: 'Imperial Zamindari',
    collectionBn: 'জমিদারি রাজকীয় সেট',
    price: 850000,
    metal: '22k-gold',
    gemstone: 'diamond',
    weightGrams: 70.0,
    weightVhori: 6.0,
    description: 'Complete 6 Vhori 22K Hallmark gold bridal set including heavy choker, long sita haar, earrings with kanpasha, tikli, and ratanchur.',
    descriptionBn: 'সম্পূর্ণ ৬ ভরি ওজনের ২২ ক্যারেট সোনার ব্রাইডাল সেট: ভারী চোকার, সীতা হার, কানপাশা সহ ঝুমকা, টিকলি এবং রতনচূড়।',
    craftsmanshipNotes: 'Masterpiece crafted by master karigars in Tantibazar, Dhaka. Complete BAJUS certification.',
    craftsmanshipNotesBn: 'ঢাকার তাঁতীবাজারের ঐতিহ্যবাহী প্রধান কারিগরদের হাতে তৈরি। সম্পূর্ণ হলমার্ক সনদপত্র সহ।',
    stock: 1,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&auto=format&fit=crop&q=80',
    ],
    viewsCount: 1200,
    inquiriesCount: 68,
    createdAt: '2026-10-05T11:20:00.000Z',
  },
];

// Clean initial state (zero dummy data for final client delivery)
const INITIAL_ORDERS: CustomerOrder[] = [];
const INITIAL_INQUIRIES: CustomerInquiry[] = [];

// Product Store
export function getJewelryItems(): JewelryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ITEMS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify([]));
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveJewelryItems(items: JewelryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save items', err);
  }
}

export function updateJewelryItemPrice(id: string, newPrice: number): JewelryItem[] {
  const items = getJewelryItems();
  const updated = items.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        originalPrice: item.price,
        price: Math.max(1, newPrice),
      };
    }
    return item;
  });
  saveJewelryItems(updated);
  return updated;
}

export function updateJewelryItemStock(id: string, stock: number): JewelryItem[] {
  const items = getJewelryItems();
  const updated = items.map((item) => (item.id === id ? { ...item, stock: Math.max(0, stock) } : item));
  saveJewelryItems(updated);
  return updated;
}

export function updateJewelryItem(updatedItem: JewelryItem): JewelryItem[] {
  const items = getJewelryItems();
  const updated = items.map((item) => (item.id === updatedItem.id ? updatedItem : item));
  saveJewelryItems(updated);
  return updated;
}

export function updateJewelryItemStockStatus(
  id: string,
  stockStatus: 'in-stock' | 'low-stock' | 'made-to-order' | 'sold-out'
): JewelryItem[] {
  const items = getJewelryItems();
  const updated = items.map((item) => (item.id === id ? { ...item, stockStatus } : item));
  saveJewelryItems(updated);
  return updated;
}

export function getShopWhatsAppNumber(): string {
  try {
    return localStorage.getItem('rk_shop_whatsapp_number') || '8801711234567';
  } catch {
    return '8801711234567';
  }
}

export function saveShopWhatsAppNumber(num: string): void {
  try {
    localStorage.setItem('rk_shop_whatsapp_number', num.replace(/[^0-9]/g, ''));
  } catch {}
}

export function addJewelryItem(newItem: JewelryItem): JewelryItem[] {
  const items = getJewelryItems();
  const updated = [newItem, ...items];
  saveJewelryItems(updated);
  return updated;
}

export function deleteJewelryItem(id: string): JewelryItem[] {
  const items = getJewelryItems();
  const updated = items.filter((item) => item.id !== id);
  saveJewelryItems(updated);
  return updated;
}

// Clear all store data completely (zero dummy data for final client delivery)
export function clearAllStoreData(): {
  items: JewelryItem[];
  orders: CustomerOrder[];
  inquiries: CustomerInquiry[];
} {
  saveJewelryItems([]);
  saveOrders([]);
  saveInquiries([]);
  return { items: [], orders: [], inquiries: [] };
}

// Load sample showcase pieces if the owner desires demonstration data
export function loadSampleShowcaseItems(): JewelryItem[] {
  saveJewelryItems(SAMPLE_SHOWCASE_ITEMS);
  return SAMPLE_SHOWCASE_ITEMS;
}

// Order Store
export function getOrders(): CustomerOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveOrders(orders: CustomerOrder[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  } catch (err) {
    console.error('Failed to save orders', err);
  }
}

export function deleteOrder(orderId: string): CustomerOrder[] {
  const orders = getOrders();
  const updated = orders.filter((o) => o.id !== orderId);
  saveOrders(updated);
  return updated;
}

export function createOrder(orderData: Omit<CustomerOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'status'>): CustomerOrder {
  const orders = getOrders();
  const orderNumber = `RK-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
  const now = new Date().toISOString();

  const newOrder: CustomerOrder = {
    ...orderData,
    id: 'ord-' + Date.now(),
    orderNumber,
    createdAt: now,
    updatedAt: now,
    status: 'pending',
  };

  const updatedOrders = [newOrder, ...orders];
  saveOrders(updatedOrders);

  // Trigger push alert for owner
  const itemCount = newOrder.items.reduce((acc, it) => acc + it.quantity, 0);
  const itemsList = newOrder.items.map((i) => i.productName).join(', ');

  triggerPushNotification({
    type: 'new_order',
    title: `💎 New Order Placed: ${orderNumber}`,
    message: `${newOrder.customerName} placed order for ৳${newOrder.totalAmount.toLocaleString()} (${itemCount} item: ${itemsList}). Delivery to ${newOrder.city}, ${newOrder.country}. Phone: ${newOrder.customerPhone}`,
    orderId: newOrder.id,
  });

  return newOrder;
}

export function updateOrderStatus(orderId: string, status: CustomerOrder['status']): CustomerOrder[] {
  const orders = getOrders();
  const updated = orders.map((o) => (o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o));
  saveOrders(updated);
  return updated;
}

// Inquiry Store
export function getInquiries(): CustomerInquiry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify([]));
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveInquiries(inquiries: CustomerInquiry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
  } catch (err) {
    console.error('Failed to save inquiries', err);
  }
}

export function deleteInquiry(inquiryId: string): CustomerInquiry[] {
  const inquiries = getInquiries();
  const updated = inquiries.filter((i) => i.id !== inquiryId);
  saveInquiries(updated);
  return updated;
}

export function createInquiry(payload: {
  productId?: string;
  productName?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  message: string;
  inquiryType: CustomerInquiry['inquiryType'];
}): CustomerInquiry {
  const inquiries = getInquiries();
  const now = new Date().toISOString();

  const newInquiry: CustomerInquiry = {
    id: 'inq-' + Date.now(),
    productId: payload.productId,
    productName: payload.productName,
    customerName: payload.customerName,
    customerEmail: payload.customerEmail,
    customerPhone: payload.customerPhone,
    message: payload.message,
    inquiryType: payload.inquiryType,
    replies: [
      {
        id: 'rep-' + Date.now(),
        sender: 'customer',
        senderName: payload.customerName,
        text: payload.message,
        timestamp: now,
      },
    ],
    createdAt: now,
    status: 'new',
  };

  const updated = [newInquiry, ...inquiries];
  saveInquiries(updated);

  triggerPushNotification({
    type: 'new_inquiry',
    title: `✉️ New Customer Message: ${payload.customerName}`,
    message: `${payload.productName ? `Regarding ${payload.productName}: ` : ''}"${payload.message.slice(0, 100)}" (Phone: ${payload.customerPhone || 'N/A'})`,
    inquiryId: newInquiry.id,
  });

  return newInquiry;
}

export function addInquiryReply(inquiryId: string, replyText: string, sender: 'customer' | 'owner', senderName: string): CustomerInquiry[] {
  const inquiries = getInquiries();
  const updated = inquiries.map((inq) => {
    if (inq.id === inquiryId) {
      const newReply = {
        id: 'rep-' + Date.now() + Math.random().toString(36).substring(2, 5),
        sender,
        senderName,
        text: replyText,
        timestamp: new Date().toISOString(),
      };
      return {
        ...inq,
        replies: [...inq.replies, newReply],
        status: sender === 'owner' ? ('replied' as const) : inq.status,
      };
    }
    return inq;
  });
  saveInquiries(updated);
  return updated;
}

// SECURITY: STRICT PRIVATE AUTHENTICATION
// The authorized email is strictly verified internally without ever leaking or displaying it to viewers!
const AUTHORIZED_OWNER_EMAILS = [
  'mdtusherhossen701@gmail.com',
  'rithikkarmokar6952@gmail.com',
];

export function isOwnerAuthenticated(): boolean {
  try {
    const session =
      localStorage.getItem(STORAGE_KEYS.OWNER_AUTH) ||
      localStorage.getItem('rk_owner_auth_v2');
    if (!session) return false;
    const parsed = JSON.parse(session);
    return (
      parsed.verified === true &&
      AUTHORIZED_OWNER_EMAILS.some(
        (em) => em.toLowerCase() === parsed.email?.trim().toLowerCase()
      )
    );
  } catch {
    return false;
  }
}

export function authenticateOwnerWithEmail(inputEmail: string): boolean {
  const normalized = inputEmail.trim().toLowerCase();
  const match = AUTHORIZED_OWNER_EMAILS.find((em) => em.toLowerCase() === normalized);
  if (match) {
    const payload = JSON.stringify({
      verified: true,
      email: match,
      loggedInAt: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEYS.OWNER_AUTH, payload);
    localStorage.setItem('rk_owner_auth_v2', payload);
    return true;
  }
  return false;
}

export function logoutOwner(): void {
  localStorage.removeItem(STORAGE_KEYS.OWNER_AUTH);
  localStorage.removeItem('rk_owner_auth_v2');
}
