export type Language = 'en' | 'bn';

export interface Translations {
  appName: string;
  appSubtitle: string;
  tagline: string;
  heroHeadline: string;
  heroHeadlineAccent: string;
  heroDescription: string;
  exploreCollection: string;
  viewLiveRatesBtn: string;
  directConcierge: string;
  trustMarker1: string;
  trustMarker1Sub: string;
  trustMarker2: string;
  trustMarker2Sub: string;
  trustMarker3: string;
  trustMarker3Sub: string;
  trustMarker4: string;
  trustMarker4Sub: string;

  // Nav
  navCollections: string;
  navLiveRates: string;
  navInquiry: string;
  navTracking: string;
  ownerLogin: string;
  ownerDashboard: string;
  languageToggle: string;

  // Filters & Catalog
  catalogTitle: string;
  catalogSubtitle: string;
  searchPlaceholder: string;
  allMasterpieces: string;
  rings: string;
  necklaces: string;
  bracelets: string;
  earrings: string;
  bridalSets: string;
  filterMetal: string;
  allMetals: string;
  sortFeatured: string;
  sortPriceAsc: string;
  sortPriceDesc: string;
  noProductsFound: string;
  resetFilters: string;

  // Product Card & PDP
  quickView: string;
  orderNow: string;
  messageOwner: string;
  stockLabel: string;
  acquisitionPrice: string;
  craftsmanshipNotes: string;
  ethicalOrigin: string;
  armoredCourier: string;
  multiAngleGallery: string;
  perspectiveOf: string;
  weightLabel: string;

  // Order Tracking
  trackingTitle: string;
  trackingSubtitle: string;
  trackingInputPlaceholder: string;
  trackButton: string;
  orderMilestone1: string;
  orderMilestone2: string;
  orderMilestone3: string;
  orderMilestone4: string;
  totalSettled: string;
  autofillSample: string;

  // Modals
  inquiryTitle: string;
  inquirySubtitle: string;
  inquiryName: string;
  inquiryEmail: string;
  inquiryPhone: string;
  inquiryPurpose: string;
  inquiryMessage: string;
  transmitInquiry: string;
  inquirySuccessTitle: string;
  inquirySuccessMsg: string;

  // Checkout
  checkoutTitle: string;
  checkoutSubtitle: string;
  ringSizeLabel: string;
  engravingLabel: string;
  engravingPlaceholder: string;
  customerNameLabel: string;
  customerEmailLabel: string;
  customerPhoneLabel: string;
  shippingAddressLabel: string;
  cityLabel: string;
  districtLabel: string;
  specialReqLabel: string;
  specialReqPlaceholder: string;
  confirmOrderBtn: string;
  orderSuccessTitle: string;
  orderSuccessSub: string;
  paymentMethodLabel: string;
  paymentCod: string;
  paymentBkash: string;
  paymentBank: string;

  // Owner Panel
  ownerTerminal: string;
  ownerSub: string;
  ownerEmailLabel: string;
  ownerEmailHelp: string;
  ownerAuthBtn: string;
  accessDenied: string;
  salesTelemetry: string;
  inventoryManager: string;
  ordersRequests: string;
  conciergeInquiries: string;
  alertsLog: string;
  addItemBtn: string;
  customerView: string;
  logoutBtn: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'RK Jewellery',
    appSubtitle: 'Fine Gold & Bridal Atelier',
    tagline: 'Authentic 22K Hallmark Gold · BAJUS Standard',
    heroHeadline: 'Timeless Elegance in',
    heroHeadlineAccent: '22K Hallmark Gold & Exquisite Craftsmanship',
    heroDescription:
      'Welcome to RK Jewellery. Discover exquisite handcrafted bridal jewelry, check real-time Bangladesh gold rates, and message proprietor Rithik Karmokar directly for bespoke orders and inquiries.',
    exploreCollection: 'Explore Collection',
    viewLiveRatesBtn: 'Live Gold Rates (BAJUS)',
    directConcierge: 'Direct Message to Owner',
    trustMarker1: '100% 22K Hallmark Gold',
    trustMarker1Sub: 'Cadmium 916 BAJUS Certified',
    trustMarker2: 'Daily Live Market Rates',
    trustMarker2Sub: 'Per Vhori & Gram benchmark',
    trustMarker3: 'Instant Push Alerts',
    trustMarker3Sub: 'Direct proprietor notification',
    trustMarker4: '100% Insured Delivery',
    trustMarker4Sub: 'Secure delivery across Bangladesh',

    navCollections: 'Collections',
    navLiveRates: 'Live Gold Rates',
    navInquiry: 'Message Owner',
    navTracking: 'Track Order',
    ownerLogin: 'Owner Access',
    ownerDashboard: 'Owner Dashboard',
    languageToggle: 'বাংলা',

    catalogTitle: 'Exclusive Jewellery Collection',
    catalogSubtitle: 'Crafted with genuine 22K hallmark gold with verified multi-angle photography',
    searchPlaceholder: 'Search rings, necklaces, bala, sets...',
    allMasterpieces: 'All Jewellery',
    rings: 'Rings (আংটি)',
    necklaces: 'Chokers & Haars (হার)',
    bracelets: 'Bangles & Bala (বালা)',
    earrings: 'Jhumka & Earrings (ঝুমকা)',
    bridalSets: 'Bridal Sets (বিয়ের সেট)',
    filterMetal: 'Metal / Purity:',
    allMetals: 'All Metals',
    sortFeatured: 'Featured Pieces',
    sortPriceAsc: 'Price: Low to High',
    sortPriceDesc: 'Price: High to Low',
    noProductsFound: 'No jewellery matches your search criteria',
    resetFilters: 'Reset Filters',

    quickView: 'Quick View',
    orderNow: 'Order in BDT',
    messageOwner: 'Message Owner',
    stockLabel: 'In Stock:',
    acquisitionPrice: 'Price (BDT)',
    craftsmanshipNotes: 'Artisan Craftsmanship & Hallmark Provenance',
    ethicalOrigin: '100% Certified 22K Hallmark Gold',
    armoredCourier: 'Insured Delivery Across Bangladesh',
    multiAngleGallery: 'Multi-Angle Gallery',
    perspectiveOf: 'Perspective Photo',
    weightLabel: 'Weight:',

    trackingTitle: 'Track Order & Crafting Progress',
    trackingSubtitle: 'Enter your order number to check artisan carving and courier status.',
    trackingInputPlaceholder: 'e.g. RK-2026-501',
    trackButton: 'Track Order',
    orderMilestone1: '1. Order Registered',
    orderMilestone2: '2. Goldsmith Confirmed',
    orderMilestone3: '3. Handcrafting & Polishing',
    orderMilestone4: '4. Dispatched via Courier',
    totalSettled: 'Total Amount (BDT):',
    autofillSample: 'Try Sample Order Number →',

    inquiryTitle: 'Direct Message to Shop Owner',
    inquirySubtitle: 'Inquire directly regarding price, making charges, or custom orders',
    inquiryName: 'Your Full Name *',
    inquiryEmail: 'Email Address *',
    inquiryPhone: 'Mobile Number (+880) *',
    inquiryPurpose: 'Purpose of Inquiry',
    inquiryMessage: 'Your Message / Sizing Details *',
    transmitInquiry: 'Send Message to Owner',
    inquirySuccessTitle: 'Message Transmitted to Owner',
    inquirySuccessMsg:
      'The proprietor has received an instant push notification and will get back to you shortly.',

    checkoutTitle: 'Place Order & Delivery Details',
    checkoutSubtitle: 'Insured delivery across all 64 districts in Bangladesh',
    ringSizeLabel: 'Sizing / Measurement *',
    engravingLabel: 'Custom Name Engraving (Optional)',
    engravingPlaceholder: 'e.g. Nasrin & Farhan',
    customerNameLabel: 'Customer Full Name *',
    customerEmailLabel: 'Email Address *',
    customerPhoneLabel: 'Mobile Number (For Courier Call) *',
    shippingAddressLabel: 'House, Road & Area *',
    cityLabel: 'Thana / City *',
    districtLabel: 'District *',
    specialReqLabel: 'Special Requirements / Delivery Notes',
    specialReqPlaceholder: 'e.g. Specific bridal box, delivery timing, urgent event date...',
    confirmOrderBtn: 'Confirm Order in BDT',
    orderSuccessTitle: 'Order Placed Successfully!',
    orderSuccessSub: 'The owner has received an instant notification with your details and needs.',
    paymentMethodLabel: 'Payment Method',
    paymentCod: 'Cash on Delivery (COD)',
    paymentBkash: 'bKash / Nagad Digital Payment',
    paymentBank: 'Bank Transfer / Store Pickup',

    ownerTerminal: 'RK Jewellery Proprietor Portal',
    ownerSub: 'Executive inventory, pricing & order telemetry',
    ownerEmailLabel: 'Authorized Proprietor Email',
    ownerEmailHelp: 'Strictly restricted to authorized proprietor.',
    ownerAuthBtn: 'Authenticate & Enter',
    accessDenied: 'Access Restricted: Unauthorized email address.',
    salesTelemetry: 'Sales Telemetry (BDT)',
    inventoryManager: 'Inventory & Pricing',
    ordersRequests: 'Customer Orders',
    conciergeInquiries: 'Customer Messages',
    alertsLog: 'Push Alerts Log',
    addItemBtn: 'Add Jewellery (Min. 3 Img)',
    customerView: 'Customer Storefront',
    logoutBtn: 'Logout',
  },
  bn: {
    appName: 'আরকে জুয়েলারি',
    appSubtitle: 'খাঁটি সোনা ও ব্রাইডাল জুয়েলারি',
    tagline: '১০০% খাঁটি ২২ ক্যারেট হলমার্ক সোনা · বাজুস মানদণ্ড',
    heroHeadline: 'অনবদ্য রূপ ও আভিজাত্যে',
    heroHeadlineAccent: '২২ ক্যারেট হলমার্ক স্বর্ণ ও নিপুণ কারুকাজ',
    heroDescription:
      'আরকে জুয়েলারিতে আপনাকে স্বাগতম। আমাদের ঐতিহ্যবাহী হস্তনির্মিত ব্রাইডাল বিয়ের গহনা দেখুন, বাংলাদেশে আজকের সোনার লাইভ বাজার দর জানুন এবং যেকোনো কাস্টম অর্ডারের জন্য সরাসরি দোকান মালিকের সাথে যোগাযোগ করুন।',
    exploreCollection: 'কালেকশন দেখুন',
    viewLiveRatesBtn: 'সোনার লাইভ দর (বাজুস)',
    directConcierge: 'মালিককে সরাসরি বার্তা দিন',
    trustMarker1: '১০০% ২২ ক্যারেট হলমার্ক সোনা',
    trustMarker1Sub: 'ক্যাডমিয়াম ৯১৬ বাজুস মানদণ্ড',
    trustMarker2: 'প্রতিদিনের লাইভ বাজার দর',
    trustMarker2Sub: 'প্রতি ভরি ও গ্রাম ভিত্তিক মূল্য',
    trustMarker3: 'তাৎক্ষণিক পুশ নোটিফিকেশন',
    trustMarker3Sub: 'মালিকের কাছে সরাসরি অর্ডার অ্যালার্ট',
    trustMarker4: '১০০% নিরাপদ ডেলিভারি',
    trustMarker4Sub: 'সারা দেশে বিশ্বস্ত ও সুরক্ষিত পার্সেল',

    navCollections: 'কালেকশন',
    navLiveRates: 'সোনার লাইভ দর',
    navInquiry: 'মালিককে বার্তা',
    navTracking: 'অর্ডার ট্র্যাকিং',
    ownerLogin: 'মালিক প্রবেশ',
    ownerDashboard: 'মালিক ড্যাশবোর্ড',
    languageToggle: 'English',

    catalogTitle: 'এক্সক্লুসিভ জুয়েলারি কালেকশন',
    catalogSubtitle: 'প্রতিটি গহনা ২২ ক্যারেট খাঁটি হলমার্ক সোনায় তৈরি এবং অন্তত ৩টি কোণের ছবি সহ প্রদর্শিত',
    searchPlaceholder: 'আংটি, হার, বালা, বিয়ের সেট খুঁজুন...',
    allMasterpieces: 'সব গহনা',
    rings: 'আংটি',
    necklaces: 'হার ও চোকার',
    bracelets: 'বালা ও চুড়ি',
    earrings: 'ঝুমকা ও দুল',
    bridalSets: 'ব্রাইডাল বিয়ের সেট',
    filterMetal: 'ধাতু ও মান:',
    allMetals: 'সব ধাতু',
    sortFeatured: 'সেরা কালেকশন',
    sortPriceAsc: 'দাম: কম থেকে বেশি',
    sortPriceDesc: 'দাম: বেশি থেকে কম',
    noProductsFound: 'আপনার অনুসন্ধানের সাথে মিলে এমন কোনো গহনা পাওয়া যায়নি',
    resetFilters: 'ফিল্টার রিসেট করুন',

    quickView: 'কুইক ভিউ',
    orderNow: 'অর্ডার করুন',
    messageOwner: 'মালিককে বার্তা',
    stockLabel: 'মজুত:',
    acquisitionPrice: 'মূল্য (টাকা ৳)',
    craftsmanshipNotes: 'কারিগরি শিল্প ও হলমার্ক সনদ',
    ethicalOrigin: '১০০% খাঁটি ২২ ক্যারেট হলমার্ক সোনা',
    armoredCourier: 'সমগ্র বাংলাদেশে নিরাপদ ডেলিভারি',
    multiAngleGallery: 'নানা কোণের ছবি',
    perspectiveOf: 'ছবি নম্বর',
    weightLabel: 'ওজন:',

    trackingTitle: 'অর্ডার ট্র্যাকিং ও ডেলিভারি স্ট্যাটাস',
    trackingSubtitle: 'আপনার অর্ডার নম্বর প্রবেশ করিয়ে তৈরির অগ্রগতি ও কুরিয়ার তথ্য জানুন।',
    trackingInputPlaceholder: 'যেমন: RK-2026-501',
    trackButton: 'ট্র্যাক করুন',
    orderMilestone1: '১. অর্ডার গৃহীত',
    orderMilestone2: '২. স্বর্ণকার নিশ্চিত করেছে',
    orderMilestone3: '৩. তৈরি ও পলিশিং চলছে',
    orderMilestone4: '৪. কুরিয়ারে পাঠানো হয়েছে',
    totalSettled: 'পরিশোধিত মোট মূল্য (টাকা ৳):',
    autofillSample: 'নমুনা অর্ডার নম্বর বসান →',

    inquiryTitle: 'দোকান মালিকের সাথে সরাসরি যোগাযোগ',
    inquirySubtitle: 'দাম, মজুরি বা কাস্টম ডিজাইন নিয়ে মালিকের সাথে কথা বলুন',
    inquiryName: 'আপনার পূর্ণ নাম *',
    inquiryEmail: 'ইমেইল অ্যাড্রেস *',
    inquiryPhone: 'মোবাইল নম্বর (+৮৮০) *',
    inquiryPurpose: 'বার্তার উদ্দেশ্য',
    inquiryMessage: 'আপনার বার্তা বা মাপের বিবরণ *',
    transmitInquiry: 'মালিককে বার্তা পাঠান',
    inquirySuccessTitle: 'বার্তাটি পাঠানো হয়েছে',
    inquirySuccessMsg: 'মালিকের ফোনে তাৎক্ষণিক পুশ নোটিফিকেশন পৌঁছেছে। তিনি শীঘ্রই আপনার সাথে যোগাযোগ করবেন।',

    checkoutTitle: 'অর্ডার নিশ্চিতকরণ ও ডেলিভারি ঠিকানা',
    checkoutSubtitle: 'বাংলাদেশের যেকোনো জেলায় সম্পূর্ণ নিরাপদে বিমাকৃত ডেলিভারি',
    ringSizeLabel: 'মাপ বা সাইজ *',
    engravingLabel: 'গহনায় নাম খোদাই (ঐচ্ছিক)',
    engravingPlaceholder: 'যেমন: নাসরিন ও ফারহান',
    customerNameLabel: 'গ্রাহকের পূর্ণ নাম *',
    customerEmailLabel: 'ইমেইল অ্যাড্রেস *',
    customerPhoneLabel: 'মোবাইল নম্বর (কুরিয়ারের জন্য) *',
    shippingAddressLabel: 'বাসা/রোড নম্বর ও এলাকা *',
    cityLabel: 'থানা / শহর *',
    districtLabel: 'জেলা *',
    specialReqLabel: 'বিশেষ কোনো চাহিদা বা নির্দেশনা',
    specialReqPlaceholder: 'যেমন: নির্দিষ্ট বিয়ের দিন, বিশেষ বক্স বা ডেলিভারি সময়...',
    confirmOrderBtn: 'অর্ডার নিশ্চিত করুন (টাকা ৳)',
    orderSuccessTitle: 'অর্ডারটি সফলভাবে সম্পন্ন হয়েছে!',
    orderSuccessSub: 'আপনার সমস্ত তথ্যাদি ও চাহিদা তাৎক্ষণিক পুশ নোটিফিকেশনে মালিকের কাছে পৌঁছে গেছে।',
    paymentMethodLabel: 'মূল্য পরিশোধ পদ্ধতি',
    paymentCod: 'ক্যাশ অন ডেলিভারি (হোম ডেলিভারি)',
    paymentBkash: 'বিকাশ / নগদ পেমেন্ট',
    paymentBank: 'ব্যাংক ট্রান্সফার / শোরুম পিকআপ',

    ownerTerminal: 'আরকে জুয়েলারি মালিক পোর্টাল',
    ownerSub: 'ম্যানেজমেন্ট, ইনভেন্টরি ও অর্ডার ড্যাশবোর্ড',
    ownerEmailLabel: 'মালিকের অনুমোদিত ইমেইল',
    ownerEmailHelp: 'শুধুমাত্র অনুমোদিত মালিকের জন্য সংরক্ষিত।',
    ownerAuthBtn: 'লগইন করুন',
    accessDenied: 'প্রবেশাধিকার সংরক্ষিত: শুধুমাত্র অনুমোদিত মালিক প্রবেশ করতে পারবেন।',
    salesTelemetry: 'বিক্রয় ও আয় (টাকা ৳)',
    inventoryManager: 'ইনভেন্টরি ও দাম',
    ordersRequests: 'গ্রাহকদের অর্ডার',
    conciergeInquiries: 'গ্রাহকদের বার্তা',
    alertsLog: 'নোটিফিকেশন লগ',
    addItemBtn: 'নতুন গহনা যুক্ত করুন (মিনিমাম ৩ ছবি)',
    customerView: 'কাস্টমার ভিউ',
    logoutBtn: 'লগআউট',
  },
};
