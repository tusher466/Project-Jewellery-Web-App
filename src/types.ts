export type JewelryCategory = 'rings' | 'necklaces' | 'bracelets' | 'earrings' | 'bridal-sets';
export type MetalType = '22k-gold' | '21k-gold' | '18k-gold' | 'platinum-950' | '925-silver';
export type GemstoneType = 'diamond' | 'ruby' | 'emerald' | 'sapphire' | 'pearl' | 'none';

export interface JewelryItem {
  id: string;
  sku: string;
  name: string;
  nameBn?: string;
  category: JewelryCategory;
  collection: string;
  collectionBn?: string;
  price: number; // in BDT (৳)
  originalPrice?: number;
  metal: MetalType;
  gemstone: GemstoneType;
  weightGrams: number;
  weightVhori?: number; // 1 Vhori = 11.664 grams
  caratWeight?: number; // for diamonds/gems
  description: string;
  descriptionBn?: string;
  craftsmanshipNotes: string;
  craftsmanshipNotesBn?: string;
  stock: number;
  stockStatus?: 'in-stock' | 'low-stock' | 'made-to-order' | 'sold-out';
  isFeatured?: boolean;
  images: string[]; // Minimum 3 images required
  viewsCount: number;
  inquiriesCount: number;
  createdAt: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'in-crafting' | 'shipped' | 'delivered';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number; // BDT
  image: string;
  quantity: number;
  metal: MetalType;
  sizeOrLength: string;
  engraving?: string;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  district: string;
  country: string;
  postalCode: string;
  specialRequirements?: string;
  items: OrderItem[];
  totalAmount: number; // BDT
  paymentMethod: 'cash-on-delivery' | 'bkash-nagad' | 'bank-transfer' | 'store-pickup';
  status: OrderStatus;
  updatedAt: string;
}

export interface CustomerInquiry {
  id: string;
  productId?: string;
  productName?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  message: string;
  inquiryType: 'price-quote' | 'custom-sizing' | 'making-charge' | 'hallmark-certificate';
  replies: {
    id: string;
    sender: 'customer' | 'owner';
    senderName: string;
    text: string;
    timestamp: string;
  }[];
  createdAt: string;
  status: 'new' | 'replied' | 'resolved';
}

export interface PushNotificationAlert {
  id: string;
  type: 'new_order' | 'new_inquiry' | 'inventory_alert' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  orderId?: string;
  inquiryId?: string;
}

export interface LiveMetalRate {
  id: string;
  name: string;
  nameBn: string;
  metal: 'gold' | 'silver';
  purity: '22K' | '21K' | '18K' | 'Traditional' | 'Silver-22K';
  pricePerVhori: number; // BDT per 11.664g
  pricePerGram: number; // BDT per gram
  change24h: number; // BDT change
  changePercent: number; // %
  lastUpdated: string;
}
