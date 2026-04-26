// ══════════════════════════════════════════════
//   QuickBite — Grocery Ordering & Management App
//   Backend: Node.js API + persistent JSON storage
//   Images: Unsplash
// ══════════════════════════════════════════════

// ─────────────────────────────────────────────
//  DATABASE: Categories
// ─────────────────────────────────────────────
const categories = [
  { id:'fruits',     name:'Fruits',       img:'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=200&q=80&auto=format' },
  { id:'vegetables', name:'Vegetables',   img:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=80&auto=format' },
  { id:'dairy',      name:'Dairy',        img:'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&q=80&auto=format' },
  { id:'bakery',     name:'Bakery',       img:'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80&auto=format' },
  { id:'snacks',     name:'Snacks',       img:'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&q=80&auto=format' },
  { id:'beverages',  name:'Beverages',    img:'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&q=80&auto=format' },
  { id:'household',  name:'Household',    img:'https://images.unsplash.com/photo-1583947582886-f40ec95dd752?w=200&q=80&auto=format' },
  { id:'organic',    name:'Organic',      img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=80&auto=format' },
  { id:'essentials', name:'Essentials',   img:'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=200&q=80&auto=format' },
];

// ─────────────────────────────────────────────
//  DATA SOURCE: Dynamic grocery stores from backend
// ─────────────────────────────────────────────
const demoRestaurants = [
  {
    id: 401,
    name: 'FreshBasket Market',
    cuisine: 'Fruits, Vegetables, Dairy',
    rating: 4.8,
    deliveryTime: 18,
    minOrder: 199,
    avgCost: 620,
    category: 'fruits',
    promo: 'Free delivery above Rs399',
    tags: ['Top Rated', 'Express'],
    img: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80&auto=format&fit=crop',
    address: 'Sector 22, Chandigarh',
    menu: [
      { id: 40101, name: 'Banana (6 pcs)', desc: 'Farm-fresh naturally ripened bananas.', price: 48, img: 'https://images.unsplash.com/photo-1574226516831-e1dff420e8f8?w=400&q=80&auto=format', veg: true, bestseller: true, stock: 120, reorderLevel: 20, category: 'fruits', unit: 'pack', sku: 'FBM-BAN-6' },
      { id: 40102, name: 'Apple Royal Gala (1 kg)', desc: 'Sweet and crispy premium apples.', price: 169, img: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&q=80&auto=format', veg: true, bestseller: true, stock: 64, reorderLevel: 14, category: 'fruits', unit: 'kg', sku: 'FBM-APP-1K' },
      { id: 40103, name: 'Tomato (1 kg)', desc: 'Fresh red tomatoes for curries and salads.', price: 44, img: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 90, reorderLevel: 18, category: 'vegetables', unit: 'kg', sku: 'FBM-TOM-1K' },
      { id: 40104, name: 'Onion (1 kg)', desc: 'Everyday premium onions for kitchen staples.', price: 39, img: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 95, reorderLevel: 20, category: 'vegetables', unit: 'kg', sku: 'FBM-ONI-1K' },
      { id: 40105, name: 'A2 Cow Milk (1 L)', desc: 'Pasteurized full-cream milk.', price: 72, img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80&auto=format', veg: true, bestseller: true, stock: 52, reorderLevel: 12, category: 'dairy', unit: 'ltr', sku: 'FBM-MLK-1L' },
      { id: 40106, name: 'Paneer Fresh (200 g)', desc: 'Soft cottage cheese block.', price: 95, img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 44, reorderLevel: 10, category: 'dairy', unit: 'pack', sku: 'FBM-PNR-200' },
      { id: 40107, name: 'Brown Bread (400 g)', desc: 'Whole wheat sliced bread.', price: 48, img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 36, reorderLevel: 8, category: 'bakery', unit: 'pack', sku: 'FBM-BRD-400' },
      { id: 40108, name: 'Muesli Crunch (500 g)', desc: 'Oats, nuts and dried fruits mix.', price: 229, img: 'https://images.unsplash.com/photo-1514996937319-344454492b37?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 27, reorderLevel: 8, category: 'snacks', unit: 'pack', sku: 'FBM-MSL-500' },
    ],
  },
  {
    id: 402,
    name: 'DailyNeeds Hypermart',
    cuisine: 'Staples, Snacks, Beverages',
    rating: 4.6,
    deliveryTime: 24,
    minOrder: 249,
    avgCost: 780,
    category: 'essentials',
    promo: '10% OFF on monthly baskets',
    tags: ['Bulk Saver', 'Family Packs'],
    img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80&auto=format&fit=crop',
    address: 'Phase 7, Mohali',
    menu: [
      { id: 40201, name: 'Basmati Rice (5 kg)', desc: 'Long-grain aromatic rice.', price: 489, img: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&q=80&auto=format', veg: true, bestseller: true, stock: 30, reorderLevel: 6, category: 'essentials', unit: 'bag', sku: 'DNH-RIC-5K' },
      { id: 40202, name: 'Atta Chakki Fresh (10 kg)', desc: 'Stone-ground whole wheat flour.', price: 445, img: 'https://images.unsplash.com/photo-1586444248879-4f2df6f8f52a?w=400&q=80&auto=format', veg: true, bestseller: true, stock: 26, reorderLevel: 5, category: 'essentials', unit: 'bag', sku: 'DNH-ATT-10K' },
      { id: 40203, name: 'Toor Dal (1 kg)', desc: 'Unpolished premium toor dal.', price: 154, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 47, reorderLevel: 10, category: 'essentials', unit: 'kg', sku: 'DNH-TDL-1K' },
      { id: 40204, name: 'Sunflower Oil (1 L)', desc: 'Refined sunflower cooking oil.', price: 162, img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 42, reorderLevel: 10, category: 'essentials', unit: 'ltr', sku: 'DNH-OIL-1L' },
      { id: 40205, name: 'Salted Chips (150 g)', desc: 'Classic crunchy potato chips.', price: 45, img: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 80, reorderLevel: 20, category: 'snacks', unit: 'pack', sku: 'DNH-CHP-150' },
      { id: 40206, name: 'Orange Juice (1 L)', desc: 'Refreshing fruit drink.', price: 109, img: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 38, reorderLevel: 10, category: 'beverages', unit: 'ltr', sku: 'DNH-JCE-1L' },
      { id: 40207, name: 'Dishwash Gel (750 ml)', desc: 'Lemon fresh dishwashing gel.', price: 139, img: 'https://images.unsplash.com/photo-1583947582886-f40ec95dd752?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 22, reorderLevel: 8, category: 'household', unit: 'bottle', sku: 'DNH-DWG-750' },
      { id: 40208, name: 'Laundry Liquid (2 L)', desc: 'Liquid detergent for daily washes.', price: 289, img: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 18, reorderLevel: 6, category: 'household', unit: 'bottle', sku: 'DNH-LDR-2L' },
    ],
  },
  {
    id: 403,
    name: 'Organic Nest',
    cuisine: 'Organic Produce, Dairy, Wellness',
    rating: 4.7,
    deliveryTime: 26,
    minOrder: 299,
    avgCost: 910,
    category: 'organic',
    promo: 'Fresh organic picks daily',
    tags: ['Organic', 'Farm Direct'],
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&auto=format&fit=crop',
    address: 'Sector 9, Panchkula',
    menu: [
      { id: 40301, name: 'Organic Spinach (250 g)', desc: 'Pesticide-free spinach leaves.', price: 52, img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 34, reorderLevel: 10, category: 'vegetables', unit: 'pack', sku: 'ORG-SPN-250' },
      { id: 40302, name: 'Avocado Hass (2 pcs)', desc: 'Creamy ripe avocados.', price: 199, img: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&q=80&auto=format', veg: true, bestseller: true, stock: 24, reorderLevel: 8, category: 'fruits', unit: 'pack', sku: 'ORG-AVC-2P' },
      { id: 40303, name: 'Organic Eggs (12 pcs)', desc: 'Free-range protein-rich eggs.', price: 148, img: 'https://images.unsplash.com/photo-1498654200943-1088dd4438ae?w=400&q=80&auto=format', veg: false, bestseller: true, stock: 32, reorderLevel: 8, category: 'dairy', unit: 'tray', sku: 'ORG-EGG-12' },
      { id: 40304, name: 'Greek Yogurt (400 g)', desc: 'Thick probiotic yogurt.', price: 124, img: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 29, reorderLevel: 7, category: 'dairy', unit: 'tub', sku: 'ORG-YGT-400' },
      { id: 40305, name: 'Cold Pressed Peanut Oil (1 L)', desc: 'Wood-pressed peanut oil.', price: 329, img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 18, reorderLevel: 6, category: 'organic', unit: 'ltr', sku: 'ORG-OIL-1L' },
      { id: 40306, name: 'Granola Honey Nuts (400 g)', desc: 'Baked granola with almonds.', price: 285, img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 21, reorderLevel: 6, category: 'snacks', unit: 'pack', sku: 'ORG-GRL-400' },
      { id: 40307, name: 'Herbal Green Tea (25 bags)', desc: 'Wellness antioxidant blend.', price: 179, img: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 40, reorderLevel: 12, category: 'beverages', unit: 'box', sku: 'ORG-TEA-25' },
      { id: 40308, name: 'Bamboo Tissue Roll (4 pack)', desc: 'Eco-friendly soft tissue rolls.', price: 149, img: 'https://images.unsplash.com/photo-1583947582886-f40ec95dd752?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 28, reorderLevel: 8, category: 'household', unit: 'pack', sku: 'ORG-TIS-4P' },
    ],
  },
  {
    id: 404,
    name: 'Verka Dairy',
    cuisine: 'Milk, Curd, Paneer, Lassi',
    rating: 4.7,
    deliveryTime: 16,
    minOrder: 99,
    avgCost: 420,
    category: 'dairy',
    promo: 'Fresh dairy delivered daily',
    tags: ['Dairy Only', 'Brand Store'],
    img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&q=80&auto=format&fit=crop',
    address: 'Sector 34, Chandigarh',
    menu: [
      { id: 40401, name: 'Verka Toned Milk (1 L)', desc: 'Pasteurized toned milk for daily use.', price: 66, img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80&auto=format', veg: true, bestseller: true, stock: 120, reorderLevel: 20, category: 'dairy', unit: 'ltr', sku: 'VRK-MLK-1L' },
      { id: 40402, name: 'Verka Full Cream Milk (500 ml)', desc: 'Rich and creamy milk, hygienically packed.', price: 38, img: 'https://images.unsplash.com/photo-1601436423474-51738541c9c5?w=400&q=80&auto=format', veg: true, bestseller: true, stock: 140, reorderLevel: 24, category: 'dairy', unit: 'pack', sku: 'VRK-FCM-500' },
      { id: 40403, name: 'Verka Curd (400 g)', desc: 'Fresh probiotic curd with a smooth texture.', price: 46, img: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=400&q=80&auto=format', veg: true, bestseller: true, stock: 100, reorderLevel: 16, category: 'dairy', unit: 'cup', sku: 'VRK-CRD-400' },
      { id: 40404, name: 'Verka Paneer (200 g)', desc: 'Soft paneer block for curries and snacks.', price: 92, img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80&auto=format', veg: true, bestseller: true, stock: 90, reorderLevel: 14, category: 'dairy', unit: 'pack', sku: 'VRK-PNR-200' },
      { id: 40405, name: 'Verka Plain Lassi (180 ml)', desc: 'Classic chilled lassi for everyday refreshment.', price: 24, img: 'https://images.unsplash.com/photo-1626201850129-a96f7f07c151?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 160, reorderLevel: 30, category: 'dairy', unit: 'bottle', sku: 'VRK-LSI-180' },
      { id: 40406, name: 'Verka Sweet Lassi (200 ml)', desc: 'Sweet Punjabi lassi with a creamy taste.', price: 28, img: 'https://images.unsplash.com/photo-1626201850129-a96f7f07c151?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 150, reorderLevel: 24, category: 'dairy', unit: 'bottle', sku: 'VRK-SLS-200' },
      { id: 40407, name: 'Verka Butter (100 g)', desc: 'Salted table butter made from fresh cream.', price: 58, img: 'https://images.unsplash.com/photo-1589985270958-b3f00b3e1f87?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 95, reorderLevel: 14, category: 'dairy', unit: 'pack', sku: 'VRK-BTR-100' },
      { id: 40408, name: 'Verka Ghee (500 ml)', desc: 'Traditional ghee with rich aroma and purity.', price: 349, img: 'https://images.unsplash.com/photo-1626201850129-a96f7f07c151?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 70, reorderLevel: 10, category: 'dairy', unit: 'jar', sku: 'VRK-GHE-500' },
    ],
  },
];
let restaurants = [...demoRestaurants];
const restaurantDirectory = new Map(demoRestaurants.map(restaurant => [restaurant.id, restaurant]));

// ─────────────────────────────────────────────
//  CART STATE
// ─────────────────────────────────────────────
let cart         = JSON.parse(localStorage.getItem('qb_cart')    || '[]');
let currentRest  = null;
let currentPage  = 'home';
let prevPage     = 'home';
let activeCat    = 'all';
let currentSort  = 'rating';
let searchQuery  = '';
let currentUser  = null;
let guestFavourites = JSON.parse(localStorage.getItem('qb_guest_favourites') || '[]');
let favourites   = [...guestFavourites];
let appliedCouponCode = localStorage.getItem('qb_coupon') || '';
let authMode     = 'login';
let authIntent   = null;
let trackingOrderId = '';
let trackingTimerId = null;
let ordersRefreshTimerId = null;
let orderSuccessAnimationTimerId = null;
let successOrderId = sessionStorage.getItem('qb_success_order') || '';
let ordersCache = [];
let adminOrdersCache = [];
let adminCatalogCache = { stores: [], summary: null, globalSummary: null, access: null };
let adminPanelTab = 'overview';
let adminSelectedStoreId = 0;
let adminCreatedStoreMeta = null;
let userOrderCount = 0;
let restaurantDataMode = 'catalog';
let liveRestaurantsLoading = false;
let liveRestaurantsError = '';
let restaurantSourceNote = 'Loading grocery catalogue';
let restaurantFetchRequestId = 0;
let searchDebounceTimer = null;
let lastLiveBackendProbeAt = 0;
let lastLiveBackendProbeOk = false;
let liveBackendProbePromise = null;
const LIVE_BACKEND_PROBE_INTERVAL_MS = 4000;
const LIVE_BACKEND_PROBE_TIMEOUT_MS = 1500;

const availableLocations = [
  'Chandigarh, India',
  'Mohali, India',
  'Panchkula, India',
  'Delhi, India',
];
const ADMIN_PRODUCT_CATEGORIES = ['fruits', 'vegetables', 'dairy', 'bakery', 'snacks', 'beverages', 'household', 'essentials', 'organic'];
const couponCatalog = {
  FIRST50: {
    code: 'FIRST50',
    title: 'Flat Rs50 off',
    type: 'flat',
    value: 50,
    minTotal: 249,
    description: 'Flat Rs50 off on orders above Rs249',
  },
  SAVE20: {
    code: 'SAVE20',
    title: '20% off up to Rs120',
    type: 'percent',
    value: 20,
    maxDiscount: 120,
    minTotal: 299,
    description: 'Save 20% up to Rs120 on bigger carts',
  },
  FREEDEL: {
    code: 'FREEDEL',
    title: 'Free delivery',
    type: 'delivery',
    minTotal: 199,
    description: 'Waives the delivery fee on eligible orders',
  },
};
const AUTH_TOKEN_KEY = 'qb_auth_token';
const ADMIN_TOKEN_KEY = 'qb_admin_token';
const ADMIN_ACCESS_KEY = 'qb_admin_access';
const DEFAULT_API_PORT = '3000';
const API_BASE_URL = resolveApiBaseUrl();
const LOCAL_DEMO_STORE_KEY = 'qb_local_demo_backend_store_v1';
const LOCAL_ADMIN_PASSWORD = 'QuickBite@2026';
const LOCAL_USER_SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const LOCAL_ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 12;
let activeLocation = localStorage.getItem('qb_location') || availableLocations[0];
let adminAuthenticated = Boolean(sessionStorage.getItem(ADMIN_TOKEN_KEY));
let adminAccess = (() => {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(ADMIN_ACCESS_KEY) || 'null');
    if (parsed && typeof parsed === 'object') return parsed;
  } catch {}

  return {
    role: 'super',
    storeId: null,
    storeName: '',
    canManageAllStores: true,
    defaultStorePasswordPattern: 'Store<StoreId>@QB',
  };
})();
let localDemoBackendActive = false;

function normalizeLocalText(value, maxLength = 160) {
  return String(value || '').trim().slice(0, maxLength);
}

function createLocalToken() {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);
    return [...bytes].map(byte => byte.toString(16).padStart(2, '0')).join('');
  }

  return `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`;
}

function localCreateError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function localDefaultStorePassword(storeId) {
  return `Store${Number(storeId) || 0}@QB`;
}

function localNormalizeAdminSession(session, validStoreIds = new Set(), now = Date.now()) {
  const token = normalizeLocalText(session?.token, 120);
  if (!token) return null;

  const role = session?.role === 'store' ? 'store' : 'super';
  const storeId = role === 'store' ? Number(session?.storeId) || 0 : null;
  if (role === 'store' && (!storeId || !validStoreIds.has(storeId))) return null;

  return {
    token,
    role,
    storeId,
    createdAt: Number(session?.createdAt) || now,
    expiresAt: Number(session?.expiresAt) || now,
  };
}

function localNormalizeStoreManager(account, validStoreIds = new Set(), now = Date.now()) {
  const storeId = Number(account?.storeId) || 0;
  if (!storeId || !validStoreIds.has(storeId)) return null;

  const password = normalizeLocalText(account?.password, 120);
  if (!password) return null;

  return {
    storeId,
    password,
    createdAt: Number(account?.createdAt) || now,
    updatedAt: Number(account?.updatedAt) || now,
  };
}

function cloneDemoCatalogStores() {
  return demoRestaurants.map(storeEntry => ({
    ...storeEntry,
    tags: Array.isArray(storeEntry.tags) ? [...storeEntry.tags] : [],
    menu: (storeEntry.menu || []).map(product => ({
      ...product,
      tags: Array.isArray(product.tags) ? [...product.tags] : [],
    })),
  }));
}

function mergeMissingDefaultStores(state) {
  const defaultStores = cloneDemoCatalogStores();
  const existingById = new Map((state.catalogStores || []).map(storeEntry => [storeEntry.id, storeEntry]));
  const LEGACY_ORGANIC_COVER = 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80&auto=format&fit=crop';

  defaultStores.forEach(defaultStore => {
    const existing = existingById.get(defaultStore.id);
    if (!existing) {
      state.catalogStores.push(defaultStore);
      return;
    }

    // Keep user-edited stores intact, but upgrade stale legacy defaults.
    if (existing.name === defaultStore.name && (existing.img === LEGACY_ORGANIC_COVER || !existing.img)) {
      existing.img = defaultStore.img;
    }
  });
}

function createInitialLocalDemoStore() {
  const now = Date.now();
  const catalogStores = cloneDemoCatalogStores();
  const storeManagers = catalogStores.map(storeEntry => ({
    storeId: storeEntry.id,
    password: localDefaultStorePassword(storeEntry.id),
    createdAt: now,
    updatedAt: now,
  }));

  return {
    users: [
      {
        id: 'demo-user-001',
        name: 'Demo Shopper',
        email: 'demo@quickbite.local',
        phone: '9876543210',
        address: 'Sector 22, Chandigarh',
        favourites: [],
        password: 'demo123',
        createdAt: now,
        updatedAt: now,
      },
    ],
    orders: [],
    sessions: [],
    adminSessions: [],
    storeManagers,
    catalogStores,
  };
}

function sanitizeLocalUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address || '',
    favourites: Array.isArray(user.favourites) ? [...user.favourites] : [],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function normalizeLocalProduct(product, storeId) {
  const id = Number(product?.id) || 0;
  const name = normalizeLocalText(product?.name, 120);
  if (!id || !name) return null;

  return {
    id,
    restId: Number(product?.restId) || Number(storeId) || 0,
    name,
    desc: normalizeLocalText(product?.desc, 220),
    price: Math.max(0, Number(product?.price) || 0),
    img: normalizeLocalText(product?.img, 500),
    veg: Boolean(product?.veg),
    bestseller: Boolean(product?.bestseller),
    stock: Math.max(0, Number(product?.stock) || 0),
    reorderLevel: Math.max(1, Number(product?.reorderLevel) || 8),
    category: normalizeLocalText(product?.category, 40).toLowerCase() || 'essentials',
    unit: normalizeLocalText(product?.unit, 24) || 'unit',
    sku: normalizeLocalText(product?.sku, 40).toUpperCase() || `SKU-${id}`,
    tags: Array.isArray(product?.tags) ? product.tags.map(tag => normalizeLocalText(tag, 30)).filter(Boolean) : [],
  };
}

function normalizeLocalStore(storeEntry) {
  const id = Number(storeEntry?.id) || 0;
  const name = normalizeLocalText(storeEntry?.name, 120);
  if (!id || !name) return null;

  return {
    id,
    name,
    cuisine: normalizeLocalText(storeEntry?.cuisine, 120),
    rating: Math.min(5, Math.max(0, Number(storeEntry?.rating) || 0)),
    deliveryTime: Math.min(90, Math.max(10, Number(storeEntry?.deliveryTime) || 30)),
    minOrder: Math.max(0, Number(storeEntry?.minOrder) || 0),
    avgCost: Math.max(0, Number(storeEntry?.avgCost) || 0),
    category: normalizeLocalText(storeEntry?.category, 40).toLowerCase() || 'essentials',
    promo: normalizeLocalText(storeEntry?.promo, 90),
    tags: Array.isArray(storeEntry?.tags) ? storeEntry.tags.map(tag => normalizeLocalText(tag, 30)).filter(Boolean) : [],
    img: normalizeLocalText(storeEntry?.img, 500),
    address: normalizeLocalText(storeEntry?.address, 180),
    menu: Array.isArray(storeEntry?.menu)
      ? storeEntry.menu.map(product => normalizeLocalProduct(product, id)).filter(Boolean)
      : [],
  };
}

function ensureLocalDemoShape(source) {
  const state = source && typeof source === 'object' ? { ...source } : {};

  if (!Array.isArray(state.users)) state.users = [];
  if (!Array.isArray(state.orders)) state.orders = [];
  if (!Array.isArray(state.sessions)) state.sessions = [];
  if (!Array.isArray(state.adminSessions)) state.adminSessions = [];
  if (!Array.isArray(state.catalogStores)) state.catalogStores = cloneDemoCatalogStores();

  state.catalogStores = state.catalogStores
    .map(entry => normalizeLocalStore(entry))
    .filter(Boolean);

  if (!state.catalogStores.length) state.catalogStores = cloneDemoCatalogStores();
  mergeMissingDefaultStores(state);
  state.catalogStores.sort((a, b) => a.id - b.id);

  const validStoreIds = new Set(state.catalogStores.map(storeEntry => storeEntry.id));
  if (!Array.isArray(state.storeManagers)) state.storeManagers = [];
  state.storeManagers = state.storeManagers
    .map(entry => localNormalizeStoreManager(entry, validStoreIds))
    .filter(Boolean);

  state.catalogStores.forEach(storeEntry => {
    if (!state.storeManagers.some(account => account.storeId === storeEntry.id)) {
      state.storeManagers.push({
        storeId: storeEntry.id,
        password: localDefaultStorePassword(storeEntry.id),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  });

  state.adminSessions = (state.adminSessions || [])
    .map(entry => localNormalizeAdminSession(entry, validStoreIds))
    .filter(Boolean);

  return state;
}

function readLocalDemoStore() {
  const raw = localStorage.getItem(LOCAL_DEMO_STORE_KEY);
  if (!raw) {
    const initial = ensureLocalDemoShape(createInitialLocalDemoStore());
    localStorage.setItem(LOCAL_DEMO_STORE_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    const parsed = JSON.parse(raw);
    const normalized = ensureLocalDemoShape(parsed);
    localStorage.setItem(LOCAL_DEMO_STORE_KEY, JSON.stringify(normalized));
    return normalized;
  } catch {
    const fresh = ensureLocalDemoShape(createInitialLocalDemoStore());
    localStorage.setItem(LOCAL_DEMO_STORE_KEY, JSON.stringify(fresh));
    return fresh;
  }
}

function writeLocalDemoStore(state) {
  localStorage.setItem(LOCAL_DEMO_STORE_KEY, JSON.stringify(state));
}

function pruneLocalSessions(state) {
  const now = Date.now();
  state.sessions = state.sessions.filter(session => session.expiresAt > now);
  state.adminSessions = state.adminSessions.filter(session => session.expiresAt > now);
}

function getLocalUserFromToken(state, token) {
  if (!token) return null;
  const session = state.sessions.find(entry => entry.token === token && entry.expiresAt > Date.now());
  if (!session) return null;
  return state.users.find(entry => entry.id === session.userId) || null;
}

function getLocalAdminSession(state, token) {
  if (!token) return null;
  return state.adminSessions.find(entry => entry.token === token && entry.expiresAt > Date.now()) || null;
}

function getLocalAdminAccess(state, token) {
  const session = getLocalAdminSession(state, token);
  if (!session) return null;

  if (session.role === 'store') {
    const storeEntry = localGetStoreById(state, session.storeId);
    if (!storeEntry) return null;
    return {
      role: 'store',
      storeId: storeEntry.id,
      storeName: storeEntry.name,
      canManageAllStores: false,
      defaultStorePasswordPattern: 'Store<StoreId>@QB',
    };
  }

  return {
    role: 'super',
    storeId: null,
    storeName: '',
    canManageAllStores: true,
    defaultStorePasswordPattern: 'Store<StoreId>@QB',
  };
}

function isLocalStoreAllowed(access, storeId) {
  if (!access || access.role !== 'store') return true;
  return Number(access.storeId) === Number(storeId);
}

function scopeLocalStores(state, access) {
  if (!access || access.role !== 'store') return state.catalogStores;
  return (state.catalogStores || []).filter(storeEntry => Number(storeEntry.id) === Number(access.storeId));
}

function scopeLocalOrders(state, access) {
  if (!access || access.role !== 'store') return state.orders;
  return (state.orders || []).filter(order => Number(order.restId) === Number(access.storeId));
}

function localInventorySummary(catalogStores = []) {
  let totalProducts = 0;
  let lowStockProducts = 0;
  let outOfStockProducts = 0;
  let inventoryValue = 0;

  catalogStores.forEach(storeEntry => {
    (storeEntry.menu || []).forEach(product => {
      totalProducts += 1;
      if ((product.stock || 0) <= 0) outOfStockProducts += 1;
      if ((product.stock || 0) <= (product.reorderLevel || 8)) lowStockProducts += 1;
      inventoryValue += Number(product.stock || 0) * Number(product.price || 0);
    });
  });

  return {
    totalStores: catalogStores.length,
    totalProducts,
    lowStockProducts,
    outOfStockProducts,
    inventoryValue,
  };
}

function localGetStoreById(state, storeId) {
  return (state.catalogStores || []).find(entry => entry.id === Number(storeId)) || null;
}

function localFindProductById(state, productId) {
  for (const storeEntry of state.catalogStores || []) {
    const product = (storeEntry.menu || []).find(entry => entry.id === Number(productId));
    if (product) return { store: storeEntry, product };
  }
  return null;
}

function localResolveOrderItems(state, incomingItems = [], fallbackStoreId = 0) {
  const items = [];

  for (const rawItem of incomingItems || []) {
    const storeId = Number(rawItem.restId) || Number(fallbackStoreId) || 0;
    const productId = Number(rawItem.id) || 0;
    const qty = Math.max(0, Number(rawItem.qty) || 0);
    if (!storeId || !productId || !qty) continue;

    const storeEntry = localGetStoreById(state, storeId);
    if (!storeEntry) {
      return { error: 'Selected store is unavailable right now.' };
    }
    const product = (storeEntry.menu || []).find(entry => entry.id === productId);
    if (!product) {
      return { error: `${rawItem.name || 'A product'} is no longer available in ${storeEntry.name}.` };
    }

    items.push({
      id: product.id,
      restId: storeEntry.id,
      name: product.name,
      price: product.price,
      img: product.img,
      qty,
      sku: product.sku,
      unit: product.unit,
      category: product.category,
    });
  }

  if (!items.length) return { error: 'Your cart is empty' };
  return { items };
}

function localBuildDemand(orderItems = []) {
  const demand = new Map();

  orderItems.forEach(item => {
    const key = `${item.restId}:${item.id}`;
    const existing = demand.get(key)?.qty || 0;
    demand.set(key, {
      key,
      storeId: Number(item.restId),
      productId: Number(item.id),
      qty: existing + Math.max(0, Number(item.qty) || 0),
    });
  });

  return [...demand.values()];
}

function localCheckDemand(state, demand = []) {
  for (const line of demand) {
    const storeEntry = localGetStoreById(state, line.storeId);
    if (!storeEntry) return { ok: false, message: 'Selected store is unavailable right now.' };
    const product = (storeEntry.menu || []).find(entry => entry.id === line.productId);
    if (!product) return { ok: false, message: 'Some products are no longer available.' };
    if (Number(product.stock || 0) < Number(line.qty || 0)) {
      return { ok: false, message: `${product.name} has only ${product.stock} left in stock.` };
    }
  }

  return { ok: true };
}

function localApplyDemand(state, demand = [], direction = 'deduct') {
  const multiplier = direction === 'add' ? 1 : -1;

  demand.forEach(line => {
    const storeEntry = localGetStoreById(state, line.storeId);
    if (!storeEntry) return;
    const product = (storeEntry.menu || []).find(entry => entry.id === line.productId);
    if (!product) return;
    product.stock = Math.max(0, Number(product.stock || 0) + (Number(line.qty || 0) * multiplier));
  });
}

function localCalculateTotals(items, couponCode = '') {
  const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0), 0);
  const delivery = subtotal >= 299 ? 0 : subtotal > 0 ? 40 : 0;
  const coupon = couponCatalog[String(couponCode || '').toUpperCase()] || null;
  let foodDiscount = 0;
  let deliveryDiscount = 0;
  let couponEligible = false;

  if (coupon && subtotal >= coupon.minTotal) {
    couponEligible = true;
    if (coupon.type === 'flat') {
      foodDiscount = Math.min(coupon.value, subtotal);
    } else if (coupon.type === 'percent') {
      foodDiscount = Math.min(Math.round((subtotal * coupon.value) / 100), coupon.maxDiscount || Infinity);
    } else if (coupon.type === 'delivery') {
      deliveryDiscount = delivery;
    }
  }

  const discountedSubtotal = Math.max(subtotal - foodDiscount, 0);
  const finalDelivery = Math.max(delivery - deliveryDiscount, 0);
  const tax = Math.round(discountedSubtotal * 0.05);
  const total = discountedSubtotal + finalDelivery + tax;

  return {
    subtotal,
    tax,
    finalDelivery,
    total,
    discountTotal: foodDiscount + deliveryDiscount,
    couponCode: couponEligible && coupon ? coupon.code : '',
  };
}

function localSyncOrderStatuses(state) {
  const now = Date.now();
  let changed = false;

  state.orders.forEach(order => {
    if (order.status === 'Cancelled' || order.status === 'Delivered') return;
    const etaMinutes = Number(order.etaMinutes || 30);
    const elapsedRatio = Math.max(0, (now - Number(order.createdAt || now)) / (etaMinutes * 60 * 1000));
    const nextStatus = elapsedRatio >= 1 ? 'Delivered' : elapsedRatio >= 0.35 ? 'Confirmed' : 'Pending';
    if (getStatusRank(nextStatus) > getStatusRank(order.status)) {
      order.status = nextStatus;
      changed = true;
    }
  });

  return changed;
}

function updateBackendModePill() {
  const pill = document.getElementById('backendModePill');
  if (!pill) return;

  const isFallback = Boolean(localDemoBackendActive);
  pill.textContent = isFallback ? 'Fallback demo' : 'Live backend';
  pill.classList.toggle('fallback', isFallback);
  pill.classList.toggle('live', !isFallback);
  pill.title = isFallback
    ? 'Backend API unavailable. Running on local browser demo data.'
    : 'Connected to backend API.';
}

async function probeLiveBackend(options = {}) {
  const { force = false } = options;
  const now = Date.now();

  if (!force && liveBackendProbePromise) return liveBackendProbePromise;
  if (!force && now - lastLiveBackendProbeAt < LIVE_BACKEND_PROBE_INTERVAL_MS) return lastLiveBackendProbeOk;

  lastLiveBackendProbeAt = now;
  const healthUrl = new URL('/api/health', API_BASE_URL).toString();
  liveBackendProbePromise = (async () => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), LIVE_BACKEND_PROBE_TIMEOUT_MS);

    try {
      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        cache: 'no-store',
        signal: controller.signal,
      });
      const contentType = response.headers.get('content-type') || '';
      lastLiveBackendProbeOk = response.ok && contentType.includes('application/json');
      return lastLiveBackendProbeOk;
    } catch {
      lastLiveBackendProbeOk = false;
      return false;
    } finally {
      window.clearTimeout(timeoutId);
    }
  })();

  try {
    return await liveBackendProbePromise;
  } finally {
    liveBackendProbePromise = null;
  }
}

async function tryRecoverLiveBackend() {
  if (!localDemoBackendActive) return true;
  const reachable = await probeLiveBackend();
  if (!reachable) return false;

  localDemoBackendActive = false;
  updateBackendModePill();
  toast('Backend reconnected. Switched back to live mode.', 'success');
  return true;
}

function activateLocalDemoBackend(reason = 'unreachable') {
  if (!localDemoBackendActive) {
    localDemoBackendActive = true;
    console.warn(`QuickBite backend unavailable (${reason}). Switching to local demo backend mode.`);
    if (typeof toast === 'function') {
      toast('Backend not reachable. Running in local demo mode.', 'info');
    }
  }
  updateBackendModePill();
}

async function localApiRequest(endpoint, options = {}) {
  activateLocalDemoBackend(options.reason || 'fallback');

  const { method = 'GET', body = {}, token = '' } = options;
  const url = new URL(endpoint, 'http://local.quickbite');
  const pathname = url.pathname;
  const state = readLocalDemoStore();
  pruneLocalSessions(state);

  if (method === 'GET' && pathname === '/api/health') {
    writeLocalDemoStore(state);
    return { ok: true, source: 'local-demo-backend' };
  }

  if (method === 'GET' && pathname === '/api/catalog') {
    writeLocalDemoStore(state);
    return {
      location: normalizeLocalText(url.searchParams.get('location'), 120) || 'All zones',
      source: 'QuickBite local demo catalog',
      fetchedAt: Date.now(),
      stores: state.catalogStores,
      summary: localInventorySummary(state.catalogStores),
    };
  }

  if (method === 'POST' && pathname === '/api/auth/signup') {
    const name = normalizeLocalText(body.name, 80);
    const email = normalizeLocalText(body.email, 120).toLowerCase();
    const phone = normalizeLocalText(body.phone, 20);
    const password = String(body.password || '');

    if (!name || !email || !phone || !password) throw localCreateError('Please fill all signup fields', 400);
    if (!/^\d{10}$/.test(phone)) throw localCreateError('Enter a valid 10-digit phone number', 400);
    if (password.length < 6) throw localCreateError('Password must be at least 6 characters', 400);
    if (state.users.some(user => user.email === email)) throw localCreateError('An account with this email already exists', 409);

    const now = Date.now();
    const user = {
      id: `demo-user-${now}-${Math.floor(Math.random() * 999)}`,
      name,
      email,
      phone,
      address: '',
      favourites: [],
      password,
      createdAt: now,
      updatedAt: now,
    };
    const authToken = createLocalToken();
    state.users.push(user);
    state.sessions.push({
      token: authToken,
      userId: user.id,
      createdAt: now,
      expiresAt: now + LOCAL_USER_SESSION_TTL_MS,
    });

    writeLocalDemoStore(state);
    return { token: authToken, user: sanitizeLocalUser(user) };
  }

  if (method === 'POST' && pathname === '/api/auth/login') {
    const email = normalizeLocalText(body.email, 120).toLowerCase();
    const password = String(body.password || '');
    if (!email || !password) throw localCreateError('Enter email and password', 400);

    const user = state.users.find(entry => entry.email === email);
    if (!user || String(user.password) !== password) {
      throw localCreateError('Account not found or password is incorrect', 401);
    }

    const now = Date.now();
    const authToken = createLocalToken();
    state.sessions.push({
      token: authToken,
      userId: user.id,
      createdAt: now,
      expiresAt: now + LOCAL_USER_SESSION_TTL_MS,
    });

    writeLocalDemoStore(state);
    return { token: authToken, user: sanitizeLocalUser(user) };
  }

  if (method === 'GET' && pathname === '/api/auth/me') {
    const user = getLocalUserFromToken(state, token);
    if (!user) throw localCreateError('Your session has expired. Please sign in again.', 401);
    writeLocalDemoStore(state);
    return { user: sanitizeLocalUser(user) };
  }

  if (method === 'POST' && pathname === '/api/auth/logout') {
    if (token) {
      state.sessions = state.sessions.filter(entry => entry.token !== token);
    }
    writeLocalDemoStore(state);
    return {};
  }

  if (method === 'PUT' && pathname === '/api/users/me/profile') {
    const user = getLocalUserFromToken(state, token);
    if (!user) throw localCreateError('Your session has expired. Please sign in again.', 401);

    if (body.name !== undefined) {
      const name = normalizeLocalText(body.name, 80);
      if (!name) throw localCreateError('Name cannot be empty', 400);
      user.name = name;
    }
    if (body.phone !== undefined) {
      const phone = normalizeLocalText(body.phone, 20);
      if (!/^\d{10}$/.test(phone)) throw localCreateError('Enter a valid 10-digit phone number', 400);
      user.phone = phone;
    }
    if (body.address !== undefined) {
      user.address = normalizeLocalText(body.address, 240);
    }
    if (body.favourites !== undefined) {
      if (!Array.isArray(body.favourites)) throw localCreateError('Favourites must be an array', 400);
      user.favourites = [...new Set(body.favourites.map(value => Number(value)).filter(value => Number.isInteger(value) && value > 0))];
    }

    user.updatedAt = Date.now();
    writeLocalDemoStore(state);
    return { user: sanitizeLocalUser(user) };
  }

  if (method === 'GET' && pathname === '/api/orders/me') {
    const user = getLocalUserFromToken(state, token);
    if (!user) throw localCreateError('Your session has expired. Please sign in again.', 401);

    const changed = localSyncOrderStatuses(state);
    if (changed) writeLocalDemoStore(state);
    else writeLocalDemoStore(state);

    return {
      orders: state.orders
        .filter(order => order.userId === user.id)
        .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0)),
    };
  }

  if (method === 'POST' && pathname === '/api/orders') {
    const user = getLocalUserFromToken(state, token);
    if (!user) throw localCreateError('Your session has expired. Please sign in again.', 401);

    const customer = body.customer || {};
    const name = normalizeLocalText(customer.name, 80);
    const phone = normalizeLocalText(customer.phone, 20);
    const address = normalizeLocalText(customer.address, 240);
    const note = normalizeLocalText(customer.note, 160);
    const payment = normalizeLocalText(body.payment, 40);
    const restId = Number(body.restId) || 0;
    const etaMinutes = Math.min(90, Math.max(10, Number(body.etaMinutes) || 30));
    const incomingItems = Array.isArray(body.items) ? body.items : [];

    if (!name || !phone || !address) throw localCreateError('Please fill all required fields', 400);
    if (!/^\d{10}$/.test(phone)) throw localCreateError('Enter a valid 10-digit phone number', 400);
    if (!payment) throw localCreateError('Choose a payment method', 400);

    const resolved = localResolveOrderItems(state, incomingItems, restId);
    if (resolved.error) throw localCreateError(resolved.error, 400);

    const items = resolved.items;
    const demand = localBuildDemand(items);
    const check = localCheckDemand(state, demand);
    if (!check.ok) throw localCreateError(check.message, 409);

    localApplyDemand(state, demand, 'deduct');

    const primaryStore = localGetStoreById(state, items[0]?.restId || restId);
    const finalRestId = Number(primaryStore?.id || restId || items[0]?.restId || 0);
    const restName = normalizeLocalText(body.restName, 120) || primaryStore?.name || 'QuickBite Grocery';
    const restImg = normalizeLocalText(body.restImg, 500) || primaryStore?.img || '';
    const totals = localCalculateTotals(items, body.couponCode);
    const createdAt = Date.now();
    const order = {
      orderId: `QB${createdAt}${Math.floor(100 + Math.random() * 900)}`,
      restId: finalRestId,
      restName,
      restImg,
      customer: { name, phone, address, note },
      userId: user.id,
      userEmail: user.email,
      items,
      subtotal: totals.subtotal,
      tax: totals.tax,
      delivery: totals.finalDelivery,
      total: totals.total,
      couponCode: totals.couponCode,
      discount: totals.discountTotal,
      payment,
      status: 'Pending',
      date: new Date(createdAt).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
      }),
      createdAt,
      etaMinutes,
      stockReverted: false,
    };

    user.name = name;
    user.phone = phone;
    user.address = address;
    user.updatedAt = createdAt;
    state.orders.unshift(order);
    writeLocalDemoStore(state);

    return { order, user: sanitizeLocalUser(user) };
  }

  if (method === 'POST' && pathname === '/api/admin/login') {
    const accessType = normalizeLocalText(body.accessType, 20).toLowerCase() === 'store' ? 'store' : 'super';
    const password = String(body.password || '');
    if (!password) throw localCreateError(accessType === 'store' ? 'Enter the store password' : 'Enter the admin password', 400);

    let access = {
      role: 'super',
      storeId: null,
      storeName: '',
      canManageAllStores: true,
      defaultStorePasswordPattern: 'Store<StoreId>@QB',
    };

    if (accessType === 'store') {
      const storeId = Number(body.storeId) || 0;
      const storeEntry = localGetStoreById(state, storeId);
      if (!storeEntry) throw localCreateError('Choose a valid grocery store', 400);

      const manager = (state.storeManagers || []).find(entry => Number(entry.storeId) === Number(storeId));
      if (!manager || String(manager.password) !== password) {
        throw localCreateError('Incorrect store password', 401);
      }

      access = {
        role: 'store',
        storeId: storeEntry.id,
        storeName: storeEntry.name,
        canManageAllStores: false,
        defaultStorePasswordPattern: 'Store<StoreId>@QB',
      };
    } else if (password !== LOCAL_ADMIN_PASSWORD) {
      throw localCreateError('Incorrect admin password', 401);
    }

    const now = Date.now();
    const adminToken = createLocalToken();
    state.adminSessions.push({
      token: adminToken,
      role: access.role,
      storeId: access.storeId,
      createdAt: now,
      expiresAt: now + LOCAL_ADMIN_SESSION_TTL_MS,
    });
    writeLocalDemoStore(state);
    return { token: adminToken, access };
  }

  if (method === 'POST' && pathname === '/api/admin/logout') {
    if (token) {
      state.adminSessions = state.adminSessions.filter(entry => entry.token !== token);
    }
    writeLocalDemoStore(state);
    return {};
  }

  if (method === 'GET' && pathname === '/api/admin/me') {
    const access = getLocalAdminAccess(state, token);
    if (!access) throw localCreateError('Admin session expired. Please unlock the dashboard again.', 401);
    writeLocalDemoStore(state);
    return { access };
  }

  if (method === 'GET' && pathname === '/api/admin/orders') {
    const access = getLocalAdminAccess(state, token);
    if (!access) {
      throw localCreateError('Admin session expired. Please unlock the dashboard again.', 401);
    }

    const changed = localSyncOrderStatuses(state);
    if (changed) writeLocalDemoStore(state);
    else writeLocalDemoStore(state);

    return {
      orders: [...scopeLocalOrders(state, access)].sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0)),
      access,
    };
  }

  if (method === 'GET' && pathname === '/api/admin/catalog') {
    const access = getLocalAdminAccess(state, token);
    if (!access) {
      throw localCreateError('Admin session expired. Please unlock the dashboard again.', 401);
    }

    const scopedStores = scopeLocalStores(state, access);
    writeLocalDemoStore(state);
    return {
      stores: scopedStores,
      summary: localInventorySummary(scopedStores),
      globalSummary: localInventorySummary(state.catalogStores),
      access,
    };
  }

  if (method === 'POST' && pathname === '/api/admin/stores') {
    const access = getLocalAdminAccess(state, token);
    if (!access) {
      throw localCreateError('Admin session expired. Please unlock the dashboard again.', 401);
    }
    if (access.role === 'store') {
      throw localCreateError('Store managers cannot create new stores.', 403);
    }

    const name = normalizeLocalText(body.name, 120);
    if (!name) throw localCreateError('Store name is required', 400);

    const normalizedName = name.toLowerCase();
    const duplicate = (state.catalogStores || []).some(storeEntry => normalizeLocalText(storeEntry.name, 120).toLowerCase() === normalizedName);
    if (duplicate) throw localCreateError('A store with this name already exists', 409);

    const maxStoreId = (state.catalogStores || [])
      .reduce((max, storeEntry) => Math.max(max, Number(storeEntry.id) || 0), 400);
    const nextStoreId = maxStoreId + 1;
    const managerPassword = normalizeLocalText(body.managerPassword, 120) || localDefaultStorePassword(nextStoreId);

    const storeEntry = normalizeLocalStore({
      id: nextStoreId,
      name,
      cuisine: normalizeLocalText(body.cuisine, 120) || 'Daily Grocery Essentials',
      rating: Math.min(5, Math.max(0, Number(body.rating) || 4.5)),
      deliveryTime: Math.min(90, Math.max(10, Number(body.deliveryTime) || 30)),
      minOrder: Math.max(0, Number(body.minOrder) || 199),
      avgCost: Math.max(0, Number(body.avgCost) || 500),
      category: normalizeLocalText(body.category, 40).toLowerCase() || 'essentials',
      promo: normalizeLocalText(body.promo, 90) || 'Fresh grocery picks available daily',
      tags: Array.isArray(body.tags)
        ? body.tags.map(tag => normalizeLocalText(tag, 30)).filter(Boolean)
        : ['New Store'],
      img: normalizeLocalText(body.img, 500) || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80&auto=format&fit=crop',
      address: normalizeLocalText(body.address, 180) || 'Service area not specified',
      menu: [],
    });
    if (!storeEntry) throw localCreateError('Invalid store payload', 400);

    state.catalogStores.push(storeEntry);
    state.storeManagers = (state.storeManagers || []).filter(entry => Number(entry.storeId) !== storeEntry.id);
    state.storeManagers.push({
      storeId: storeEntry.id,
      password: managerPassword,
      createdAt: Date.now(),
    });
    writeLocalDemoStore(state);

    const scopedStores = scopeLocalStores(state, access);
    return {
      store: storeEntry,
      managerPassword,
      summary: localInventorySummary(scopedStores),
      globalSummary: localInventorySummary(state.catalogStores),
      access,
    };
  }

  if (method === 'POST' && pathname === '/api/admin/products') {
    const access = getLocalAdminAccess(state, token);
    if (!access) {
      throw localCreateError('Admin session expired. Please unlock the dashboard again.', 401);
    }

    const name = normalizeLocalText(body.name, 120);
    const price = Math.max(0, Number(body.price) || 0);
    if (!name || !price) throw localCreateError('Enter valid product details and price', 400);

    const applyToAll = Boolean(body.applyToAll) && access.role !== 'store';
    if (access.role === 'store' && body.storeId !== undefined) {
      const requestedStoreId = Number(body.storeId) || 0;
      if (requestedStoreId && requestedStoreId !== Number(access.storeId)) {
        throw localCreateError('Store managers can only add products to their assigned store.', 403);
      }
    }
    const targetStores = (() => {
      if (applyToAll) return state.catalogStores || [];
      const targetStoreId = access.role === 'store' ? Number(access.storeId) : Number(body.storeId) || 0;
      const targetStore = localGetStoreById(state, targetStoreId);
      return targetStore ? [targetStore] : [];
    })();
    if (!targetStores.length) throw localCreateError('Choose a valid grocery store', 400);
    if (access.role === 'store' && targetStores.some(storeEntry => !isLocalStoreAllowed(access, storeEntry.id))) {
      throw localCreateError('Store managers can only add products to their assigned store.', 403);
    }

    const maxProductId = (state.catalogStores || [])
      .flatMap(entry => entry.menu || [])
      .reduce((max, product) => Math.max(max, Number(product.id) || 0), 40000);
    let runningId = maxProductId;
    const createdProducts = [];

    targetStores.forEach(storeEntry => {
      runningId += 1;
      const product = normalizeLocalProduct({
        id: runningId,
        restId: storeEntry.id,
        name,
        desc: normalizeLocalText(body.desc, 220),
        price,
        img: normalizeLocalText(body.img, 500) || storeEntry.img,
        veg: body.veg !== false,
        bestseller: Boolean(body.bestseller),
        stock: Math.max(0, Number(body.stock) || 0),
        reorderLevel: Math.max(1, Number(body.reorderLevel) || 8),
        category: normalizeLocalText(body.category, 40).toLowerCase() || 'essentials',
        unit: normalizeLocalText(body.unit, 24) || 'unit',
        sku: normalizeLocalText(body.sku, 40) || `${storeEntry.name.slice(0, 3).toUpperCase()}-${runningId}`,
      }, storeEntry.id);
      if (!product) return;
      storeEntry.menu.unshift(product);
      createdProducts.push(product);
    });

    if (!createdProducts.length) throw localCreateError('Invalid product payload', 400);
    writeLocalDemoStore(state);

    const scopedStores = scopeLocalStores(state, access);
    return {
      product: createdProducts[0],
      products: createdProducts,
      createdCount: createdProducts.length,
      storeId: createdProducts[0]?.restId || null,
      storeIds: [...new Set(createdProducts.map(product => Number(product.restId)))],
      scope: createdProducts.length > 1 ? 'all-stores' : 'single-store',
      summary: localInventorySummary(scopedStores),
      access,
    };
  }

  if (method === 'PATCH' && /^\/api\/admin\/products\/\d+\/stock$/.test(pathname)) {
    const access = getLocalAdminAccess(state, token);
    if (!access) {
      throw localCreateError('Admin session expired. Please unlock the dashboard again.', 401);
    }

    const productId = Number(pathname.split('/')[4]) || 0;
    const found = localFindProductById(state, productId);
    if (!found) throw localCreateError('Product not found', 404);
    if (!isLocalStoreAllowed(access, found.store.id)) {
      throw localCreateError('Store managers can only manage products in their assigned store.', 403);
    }

    const delta = Number(body.delta);
    const nextStock = body.stock !== undefined
      ? Math.max(0, Number(body.stock) || 0)
      : Number.isFinite(delta)
        ? Math.max(0, Number(found.product.stock || 0) + Math.round(delta))
        : NaN;

    if (!Number.isFinite(nextStock)) {
      throw localCreateError('Provide either `delta` or `stock` to update inventory', 400);
    }

    found.product.stock = nextStock;
    writeLocalDemoStore(state);

    const scopedStores = scopeLocalStores(state, access);
    return {
      product: found.product,
      storeId: found.store.id,
      summary: localInventorySummary(scopedStores),
      access,
    };
  }

  if (method === 'PATCH' && /^\/api\/admin\/products\/\d+$/.test(pathname)) {
    const access = getLocalAdminAccess(state, token);
    if (!access) {
      throw localCreateError('Admin session expired. Please unlock the dashboard again.', 401);
    }

    const productId = Number(pathname.split('/')[4]) || 0;
    const found = localFindProductById(state, productId);
    if (!found) throw localCreateError('Product not found', 404);
    if (!isLocalStoreAllowed(access, found.store.id)) {
      throw localCreateError('Store managers can only manage products in their assigned store.', 403);
    }

    if (body.name !== undefined) {
      const name = normalizeLocalText(body.name, 120);
      if (!name) throw localCreateError('Product name cannot be empty', 400);
      found.product.name = name;
    }
    if (body.desc !== undefined) found.product.desc = normalizeLocalText(body.desc, 220);
    if (body.price !== undefined) {
      const price = Math.max(0, Number(body.price) || 0);
      if (!price) throw localCreateError('Price must be greater than zero', 400);
      found.product.price = price;
    }
    if (body.reorderLevel !== undefined) found.product.reorderLevel = Math.max(1, Number(body.reorderLevel) || 1);
    if (body.category !== undefined) found.product.category = normalizeLocalText(body.category, 40).toLowerCase() || found.product.category;
    if (body.unit !== undefined) found.product.unit = normalizeLocalText(body.unit, 24) || found.product.unit;
    if (body.sku !== undefined) found.product.sku = normalizeLocalText(body.sku, 40).toUpperCase() || found.product.sku;
    if (body.img !== undefined) found.product.img = normalizeLocalText(body.img, 500) || found.product.img;
    if (body.veg !== undefined) found.product.veg = Boolean(body.veg);
    if (body.bestseller !== undefined) found.product.bestseller = Boolean(body.bestseller);

    writeLocalDemoStore(state);
    const scopedStores = scopeLocalStores(state, access);
    return {
      product: found.product,
      storeId: found.store.id,
      summary: localInventorySummary(scopedStores),
      access,
    };
  }

  if (method === 'PATCH' && /^\/api\/admin\/orders\/.+\/status$/.test(pathname)) {
    const access = getLocalAdminAccess(state, token);
    if (!access) {
      throw localCreateError('Admin session expired. Please unlock the dashboard again.', 401);
    }

    const orderId = decodeURIComponent(pathname.split('/')[4] || '');
    const nextStatus = normalizeLocalText(body.status, 40);
    const allowed = new Set(['Pending', 'Confirmed', 'Delivered', 'Cancelled']);
    if (!allowed.has(nextStatus)) throw localCreateError('Invalid order status', 400);

    const order = state.orders.find(entry => entry.orderId === orderId);
    if (!order) throw localCreateError('Order not found', 404);
    if (!isLocalStoreAllowed(access, order.restId)) {
      throw localCreateError('Store managers can only update orders from their assigned store.', 403);
    }

    const wasCancelled = order.status === 'Cancelled';
    const willCancel = nextStatus === 'Cancelled';
    const demand = localBuildDemand(order.items || []);

    if (!wasCancelled && willCancel && demand.length) {
      localApplyDemand(state, demand, 'add');
      order.stockReverted = true;
    }
    if (wasCancelled && !willCancel && demand.length) {
      const check = localCheckDemand(state, demand);
      if (!check.ok) throw localCreateError(`Cannot reopen this order: ${check.message}`, 409);
      localApplyDemand(state, demand, 'deduct');
      order.stockReverted = false;
    }

    order.status = nextStatus;
    writeLocalDemoStore(state);
    return { order, access };
  }

  throw localCreateError('API route not found', 404);
}

function saveCart() { localStorage.setItem('qb_cart', JSON.stringify(cart)); }
function saveGuestFavourites() { localStorage.setItem('qb_guest_favourites', JSON.stringify(guestFavourites)); }
function saveCoupon() {
  if (appliedCouponCode) localStorage.setItem('qb_coupon', appliedCouponCode);
  else localStorage.removeItem('qb_coupon');
}

function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY) || '';
}

function getAdminToken() {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY) || '';
}

function syncFavouritesState() {
  favourites = currentUser?.favourites ? [...currentUser.favourites] : [...guestFavourites];
}

function setCurrentUser(user) {
  currentUser = user ? { ...user } : null;
  syncFavouritesState();
}

function setAuthSession(token, user) {
  if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
  setCurrentUser(user);
}

function clearAuthSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  setCurrentUser(null);
  ordersCache = [];
  userOrderCount = 0;
}

function normalizeAdminAccess(access) {
  const role = String(access?.role || '').toLowerCase() === 'store' ? 'store' : 'super';
  return {
    role,
    storeId: role === 'store' ? Number(access?.storeId) || null : null,
    storeName: role === 'store' ? normalizeLocalText(access?.storeName, 120) : '',
    canManageAllStores: role !== 'store',
    defaultStorePasswordPattern: normalizeLocalText(access?.defaultStorePasswordPattern, 60) || 'Store<StoreId>@QB',
  };
}

function setAdminAccess(access) {
  adminAccess = normalizeAdminAccess(access || {});
  sessionStorage.setItem(ADMIN_ACCESS_KEY, JSON.stringify(adminAccess));
}

function isStoreAdminAccess() {
  return normalizeAdminAccess(adminAccess).role === 'store';
}

function setAdminSession(token, access = null) {
  if (token) sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  adminAuthenticated = Boolean(token);
  if (access) setAdminAccess(access);
}

function clearAdminSession() {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  sessionStorage.removeItem(ADMIN_ACCESS_KEY);
  adminAuthenticated = false;
  adminAccess = normalizeAdminAccess({ role: 'super' });
  adminOrdersCache = [];
  adminCatalogCache = { stores: [], summary: null, globalSummary: null, access: null };
  adminPanelTab = 'overview';
  adminSelectedStoreId = 0;
  adminCreatedStoreMeta = null;
}

function resolveApiBaseUrl() {
  if (typeof window === 'undefined') return `http://127.0.0.1:${DEFAULT_API_PORT}`;

  const { protocol, hostname, port, origin } = window.location;
  if (protocol === 'file:') {
    return `http://127.0.0.1:${DEFAULT_API_PORT}`;
  }

  const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';
  if (isLocalHost) {
    // Force IPv4 localhost for backend to avoid localhost/IPv6 resolution mismatch.
    return `http://127.0.0.1:${DEFAULT_API_PORT}`;
  }

  // In deployed environments (like Vercel), use same-origin API routes.
  return origin || `http://127.0.0.1:${DEFAULT_API_PORT}`;
}

async function apiRequest(endpoint, options = {}) {
  const { method = 'GET', body, auth = false, admin = false } = options;
  const headers = {
    'Content-Type': 'application/json',
  };

  const token = admin ? getAdminToken() : auth ? getAuthToken() : '';
  if (token) headers.Authorization = `Bearer ${token}`;

  // Keep request routing consistent after fallback activates.
  // When fallback is active, periodically probe live backend and recover automatically.
  if (localDemoBackendActive) {
    const restored = await tryRecoverLiveBackend();
    if (!restored) {
      return localApiRequest(endpoint, {
        method,
        body,
        auth,
        admin,
        token,
        reason: 'sticky-local-demo',
      });
    }
  }

  let response;
  const requestUrl = new URL(endpoint, API_BASE_URL).toString();
  try {
    response = await fetch(requestUrl, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    const reachable = await probeLiveBackend({ force: true });
    if (reachable) {
      const error = new Error('Backend request failed. Please try again.');
      error.status = 503;
      throw error;
    }
    return localApiRequest(endpoint, {
      method,
      body,
      auth,
      admin,
      token,
      reason: 'network-error',
    });
  }

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : { message: await response.text() };

  if (!response.ok) {
    const isLikelyWrongServer = endpoint.startsWith('/api/')
      && !contentType.includes('application/json')
      && response.status === 404;
    if (isLikelyWrongServer) {
      const reachable = await probeLiveBackend({ force: true });
      return localApiRequest(endpoint, {
        method,
        body,
        auth,
        admin,
        token,
        reason: reachable ? 'api-route-unavailable' : 'api-not-found-on-origin',
      });
    }
    const message = isLikelyWrongServer
      ? 'QuickBite API was not found on this server. Start the backend with `npm start` and open http://localhost:3000.'
      : payload.message || 'Request failed';
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  updateBackendModePill();
  return payload;
}

function handleSessionExpiry(error, options = {}) {
  const { auth = false, admin = false } = options;

  if (auth && error?.status === 401) {
    clearAuthSession();
    updateAuthUI();
  }

  if (admin && error?.status === 401) {
    clearAdminSession();
    updateAdminActions();
  }
}

async function fetchCurrentUserOrders() {
  if (!currentUser) {
    ordersCache = [];
    userOrderCount = 0;
    return [];
  }

  const data = await apiRequest('/api/orders/me', { auth: true });
  ordersCache = data.orders || [];
  userOrderCount = ordersCache.length;
  return ordersCache;
}

async function fetchAdminOrders() {
  const data = await apiRequest('/api/admin/orders', { admin: true });
  if (data.access) setAdminAccess(data.access);
  adminOrdersCache = data.orders || [];
  return adminOrdersCache;
}

async function fetchAdminCatalog() {
  const data = await apiRequest('/api/admin/catalog', { admin: true });
  if (data.access) setAdminAccess(data.access);
  adminCatalogCache = {
    stores: data.stores || [],
    summary: data.summary || null,
    globalSummary: data.globalSummary || null,
    access: data.access ? normalizeAdminAccess(data.access) : normalizeAdminAccess(adminAccess),
  };
  return adminCatalogCache;
}

async function fetchAdminAccess() {
  const data = await apiRequest('/api/admin/me', { admin: true });
  if (data.access) setAdminAccess(data.access);
  return normalizeAdminAccess(data.access || adminAccess);
}

async function updateAdminProductStock(productId, delta) {
  return apiRequest(`/api/admin/products/${productId}/stock`, {
    method: 'PATCH',
    admin: true,
    body: { delta },
  });
}

async function createAdminProduct(payload) {
  return apiRequest('/api/admin/products', {
    method: 'POST',
    admin: true,
    body: payload,
  });
}

async function createAdminStore(payload) {
  return apiRequest('/api/admin/stores', {
    method: 'POST',
    admin: true,
    body: payload,
  });
}

async function mergeGuestFavouritesIntoAccount() {
  if (!currentUser || !guestFavourites.length) return;

  const existing = Array.isArray(currentUser.favourites) ? currentUser.favourites : [];
  const pendingGuestFavourites = [...guestFavourites];
  const merged = [...new Set([...existing, ...pendingGuestFavourites])];

  if (merged.length === existing.length) {
    guestFavourites = [];
    saveGuestFavourites();
    setCurrentUser({ ...currentUser, favourites: merged });
    return;
  }

  await syncCurrentUserProfile({ favourites: merged }, { silent: true, rerenderProfile: false });
  guestFavourites = [];
  saveGuestFavourites();
}

async function restoreUserSession() {
  const token = getAuthToken();
  if (!token) return;

  try {
    const data = await apiRequest('/api/auth/me', { auth: true });
    setCurrentUser(data.user);
    await mergeGuestFavouritesIntoAccount();
    await fetchCurrentUserOrders();
  } catch (error) {
    handleSessionExpiry(error, { auth: true });
  }
}

function registerRestaurants(list = []) {
  list.forEach(restaurant => {
    restaurantDirectory.set(restaurant.id, restaurant);
  });
}

function getRestaurantById(id) {
  return restaurantDirectory.get(id) || restaurants.find(restaurant => restaurant.id === id) || null;
}

function setRestaurants(list, mode = 'catalog') {
  restaurants = list.map(restaurant => ({
    ...restaurant,
    tags: Array.isArray(restaurant.tags) ? [...restaurant.tags] : [],
    menu: Array.isArray(restaurant.menu) ? restaurant.menu.map(item => ({ ...item })) : [],
  }));
  restaurantDirectory.clear();
  registerRestaurants(restaurants);
  syncCartWithCatalog();
  restaurantDataMode = mode;

  if (currentRest?.id) {
    currentRest = getRestaurantById(currentRest.id) || currentRest;
  }
}

function isLiveLocationMode() {
  return false;
}

function getSortLabel(sortKey) {
  const labels = {
    rating: 'Top Rated',
    deliveryTime: 'Fastest',
    minOrder: 'Low Min. Basket',
  };

  return labels[sortKey] || sortKey;
}

function updateSortButtonLabels() {
  document.querySelectorAll('.sort-btn').forEach(button => {
    button.textContent = getSortLabel(button.dataset.sort);
  });
}

async function loadRestaurantsForLocation(location, options = {}) {
  const { toastOnFail = true } = options;
  const requestId = ++restaurantFetchRequestId;

  liveRestaurantsLoading = true;
  liveRestaurantsError = '';
  restaurantSourceNote = `Loading grocery stores for ${location}...`;
  updateSortButtonLabels();
  if (currentPage === 'home') renderHomePage();

  try {
    const data = await apiRequest(`/api/catalog?location=${encodeURIComponent(location)}`);
    if (requestId !== restaurantFetchRequestId) return;

    if (Array.isArray(data.stores) && data.stores.length) {
      setRestaurants(data.stores, 'catalog');
      const productCount = Number(data?.summary?.totalProducts) || 0;
      const storeCount = Number(data?.summary?.totalStores) || data.stores.length;
      restaurantSourceNote = `${data.source || 'QuickBite Grocery'} · ${productCount} products across ${storeCount} stores`;
      liveRestaurantsError = '';
    } else {
      setRestaurants([], 'catalog');
      restaurantSourceNote = 'No grocery stores found for this location.';
      liveRestaurantsError = 'No stores found for this location.';
      if (toastOnFail) toast('No grocery stores found there right now.', 'info');
    }
  } catch (error) {
    if (requestId !== restaurantFetchRequestId) return;

    setRestaurants([], 'catalog');
    liveRestaurantsError = error.message;
    restaurantSourceNote = 'Could not load live grocery catalogue right now.';
    if (toastOnFail) {
      toast('Could not load grocery catalog right now.', 'info');
    }
  } finally {
    if (requestId === restaurantFetchRequestId) {
      liveRestaurantsLoading = false;
      updateSortButtonLabels();
      if (currentPage === 'home') renderHomePage();
    }
  }
}

function isFavourite(restId) {
  return favourites.includes(restId);
}

function getCurrentUserInitial() {
  return currentUser?.name ? currentUser.name.trim().charAt(0).toUpperCase() : 'Q';
}

function getAppliedCoupon() {
  return couponCatalog[appliedCouponCode] || null;
}

function clearAppliedCoupon() {
  appliedCouponCode = '';
  saveCoupon();
}

function calculateCartTotals(items = cart) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const delivery = subtotal >= 299 ? 0 : subtotal > 0 ? 40 : 0;
  const coupon = getAppliedCoupon();
  let foodDiscount = 0;
  let deliveryDiscount = 0;
  let couponMessage = '';
  let couponEligible = false;

  if (coupon && subtotal > 0) {
    if (subtotal < coupon.minTotal) {
      couponMessage = `Add Rs${coupon.minTotal - subtotal} more to unlock ${coupon.code}`;
    } else {
      couponEligible = true;
      if (coupon.type === 'flat') {
        foodDiscount = Math.min(coupon.value, subtotal);
      } else if (coupon.type === 'percent') {
        foodDiscount = Math.min(Math.round((subtotal * coupon.value) / 100), coupon.maxDiscount || Infinity);
      } else if (coupon.type === 'delivery') {
        deliveryDiscount = delivery;
      }
      couponMessage = `${coupon.code} applied successfully`;
    }
  }

  const discountedSubtotal = Math.max(subtotal - foodDiscount, 0);
  const finalDelivery = Math.max(delivery - deliveryDiscount, 0);
  const tax = Math.round(discountedSubtotal * 0.05);
  const discountTotal = foodDiscount + deliveryDiscount;
  const total = discountedSubtotal + finalDelivery + tax;

  return {
    subtotal,
    delivery,
    finalDelivery,
    tax,
    total,
    coupon,
    couponEligible,
    couponMessage,
    foodDiscount,
    deliveryDiscount,
    discountTotal,
    savings: (delivery === 0 ? 40 : 0) + discountTotal,
  };
}

function updateCartActions() {
  const clearBtn = document.getElementById('clearCartBtn');
  if (clearBtn) clearBtn.classList.toggle('visible', cart.length > 0);
}

function getCartRestaurant() {
  return getRestaurantById(cart[0]?.restId) || null;
}

function hasMixedCart() {
  return new Set(cart.map(item => item.restId)).size > 1;
}

function syncCartWithCatalog() {
  if (!cart.length) return;

  const normalizedCart = [];

  cart.forEach(item => {
    const storeEntry = restaurants.find(entry => entry.id === item.restId);
    const product = storeEntry?.menu?.find(entry => entry.id === item.id);
    const maxStock = Number(product?.stock || 0);
    if (!product || maxStock <= 0) return;

    const qty = Math.max(1, Math.min(Number(item.qty || 0), maxStock));
    normalizedCart.push({
      id: product.id,
      restId: storeEntry.id,
      name: product.name,
      price: product.price,
      img: product.img,
      qty,
      stock: maxStock,
      unit: product.unit || '',
    });
  });

  const changed = JSON.stringify(normalizedCart) !== JSON.stringify(cart);
  if (!changed) return;

  cart = normalizedCart;
  if (!cart.length) clearAppliedCoupon();
  saveCart();
  updateCartCount();
}

function getVisibleRestaurants() {
  const q = searchQuery.toLowerCase().trim();
  const list = restaurants.filter(r => {
    const matchesCategory = activeCat === 'all'
      || r.category === activeCat
      || r.menu.some(item => item.category === activeCat);
    const matchesSearch = !q ||
      r.name.toLowerCase().includes(q) ||
      r.cuisine.toLowerCase().includes(q) ||
      (r.address || '').toLowerCase().includes(q) ||
      r.menu.some(m => m.name.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return list.sort((a, b) => {
    if (isLiveLocationMode()) {
      if (currentSort === 'rating') return (a.distanceKm || 999) - (b.distanceKm || 999);
      if (currentSort === 'deliveryTime') return a.name.localeCompare(b.name);
      if (currentSort === 'minOrder') {
        return Number(Boolean(b.website)) - Number(Boolean(a.website))
          || Number(Boolean(b.phone)) - Number(Boolean(a.phone))
          || a.name.localeCompare(b.name);
      }
    }

    if (currentSort === 'deliveryTime') return a.deliveryTime - b.deliveryTime;
    if (currentSort === 'minOrder') return a.minOrder - b.minOrder;
    return b.rating - a.rating;
  });
}

function syncSearchInputs() {
  const searchInput = document.getElementById('searchInput');
  const heroSearch = document.getElementById('heroSearch');
  if (searchInput) searchInput.value = searchQuery;
  if (heroSearch) heroSearch.value = searchQuery;
}

function syncSortButtons() {
  updateSortButtonLabels();
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.sort === currentSort);
  });
}

function renderLocationOptions() {
  const menu = document.getElementById('locationMenu');
  if (!menu) return;

  menu.innerHTML = availableLocations.map(location => `
    <button
      type="button"
      class="location-option ${location === activeLocation ? 'active' : ''}"
      onclick="setLocation('${location}')"
    >
      ${location}
    </button>
  `).join('');
}

function updateLocationLabel() {
  const label = document.getElementById('locationLabel');
  if (label) label.textContent = activeLocation;
}

function closeLocationDrop() {
  const menu = document.getElementById('locationMenu');
  const toggle = document.getElementById('locationToggle');
  if (menu) menu.classList.remove('open');
  if (toggle) {
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
}

function toggleLocationDrop(event) {
  if (event) event.stopPropagation();
  const menu = document.getElementById('locationMenu');
  const toggle = document.getElementById('locationToggle');
  if (!menu || !toggle) return;

  const isOpen = menu.classList.toggle('open');
  toggle.classList.toggle('open', isOpen);
  toggle.setAttribute('aria-expanded', String(isOpen));
}

function setLocation(location) {
  activeLocation = location;
  localStorage.setItem('qb_location', activeLocation);
  updateLocationLabel();
  renderLocationOptions();
  closeLocationDrop();
  loadRestaurantsForLocation(location);
  toast(`Service area set to ${location}`, 'info');
}

function renderHomePage(options = {}) {
  const { scrollToSection = false } = options;
  const visibleRestaurants = getVisibleRestaurants();
  renderCategories();
  syncSearchInputs();
  syncSortButtons();
  renderResultsMeta(visibleRestaurants);
  renderRestaurants(visibleRestaurants);

  if (scrollToSection) {
    document.getElementById('restaurantSection').scrollIntoView({ behavior: 'smooth' });
  }
}

function updateAdminActions() {
  const logoutBtn = document.getElementById('adminLogoutBtn');
  if (logoutBtn) {
    logoutBtn.classList.toggle('visible', adminAuthenticated);
    logoutBtn.textContent = isStoreAdminAccess() ? 'Logout (Store)' : 'Logout';
  }
}

function updateAuthUI() {
  const trigger = document.getElementById('authTrigger');
  const label = document.getElementById('authTriggerLabel');
  if (!trigger) return;

  if (currentUser) {
    if (label) label.textContent = `Hi, ${currentUser.name.split(' ')[0]}`;
    trigger.classList.add('logged-in');
  } else {
    if (label) label.textContent = 'Sign In';
    trigger.classList.remove('logged-in');
  }
}

function requireAuth(intent) {
  if (currentUser) return true;
  authIntent = intent;
  openAuthModal('login');
  toast('Sign in to continue', 'info');
  return false;
}

function openAuthModal(mode = currentUser ? 'profile' : 'login') {
  const modal = document.getElementById('authModal');
  if (!modal) return;

  closeLocationDrop();
  authMode = currentUser ? 'profile' : mode;
  renderAuthView();
  modal.classList.add('open');

  if (currentUser) {
    fetchCurrentUserOrders()
      .then(() => {
        if (document.getElementById('authModal')?.classList.contains('open')) renderAuthView();
      })
      .catch(error => {
        handleSessionExpiry(error, { auth: true });
        if (error?.status === 401) {
          closeAuthModal();
          toast('Your session expired. Please sign in again.', 'info');
        }
      });
  }
}

function closeAuthModal(preserveIntent = false) {
  const modal = document.getElementById('authModal');
  if (modal) modal.classList.remove('open');
  if (!preserveIntent) authIntent = null;
}

function setAuthMode(mode) {
  if (currentUser) return;
  authMode = mode;
  renderAuthView();
}

function getUserOrderCount() {
  return currentUser ? userOrderCount : 0;
}

function renderAuthView() {
  const switcher = document.getElementById('authSwitch');
  const loginTab = document.getElementById('authLoginTab');
  const signupTab = document.getElementById('authSignupTab');
  const view = document.getElementById('authView');
  if (!switcher || !view) return;

  if (currentUser) {
    switcher.classList.add('hidden');
    view.innerHTML = `
      <div class="auth-profile-card">
        <div class="auth-profile-badge">${getCurrentUserInitial()}</div>
        <h4>${currentUser.name}</h4>
        <p>${currentUser.email} · ${currentUser.phone || 'No phone saved yet'}</p>
        <div class="auth-profile-grid">
          <div class="auth-profile-stat">
            <strong>${getUserOrderCount()}</strong>
            <span>Your orders</span>
          </div>
          <div class="auth-profile-stat">
            <strong>${favourites.length}</strong>
            <span>Saved stores</span>
          </div>
        </div>
        <div class="auth-profile-actions">
          <button class="btn-primary" type="button" onclick="showPage('orders'); closeAuthModal();">View Orders</button>
          <button class="tracking-ghost-btn" type="button" onclick="logoutUser()">Logout</button>
        </div>
      </div>
    `;
    return;
  }

  switcher.classList.remove('hidden');
  loginTab.classList.toggle('active', authMode === 'login');
  signupTab.classList.toggle('active', authMode === 'signup');

  if (authMode === 'signup') {
    view.innerHTML = `
      <div class="auth-form">
        <h4>Create your account</h4>
        <p>Save delivery details, reorder faster and keep your favourites synced.</p>
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" id="signupName" placeholder="Rituraj Singh"/>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" id="signupEmail" placeholder="rituraj@example.com"/>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Phone</label>
            <input type="tel" id="signupPhone" placeholder="9876543210"/>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="signupPassword" placeholder="At least 6 characters" onkeydown="handleAuthKey(event, 'signup')"/>
          </div>
        </div>
        <button class="btn-primary w-full" type="button" onclick="signupUser()">Create Account</button>
        <div class="auth-helper">Already have an account? <button class="auth-link-btn" type="button" onclick="setAuthMode('login')">Login here</button></div>
      </div>
    `;
    return;
  }

  view.innerHTML = `
    <div class="auth-form">
      <h4>Login to continue</h4>
      <p>Use your QuickBite account to unlock grocery checkout, live tracking and fast reorders.</p>
      <div class="form-group">
        <label>Email</label>
        <input type="email" id="loginEmail" placeholder="rituraj@example.com"/>
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" id="loginPassword" placeholder="Enter your password" onkeydown="handleAuthKey(event, 'login')"/>
      </div>
      <button class="btn-primary w-full" type="button" onclick="loginUser()">Login</button>
      <div class="auth-helper">New here? <button class="auth-link-btn" type="button" onclick="setAuthMode('signup')">Create an account</button></div>
    </div>
  `;
}

function handleAuthKey(event, mode) {
  if (event.key !== 'Enter') return;
  if (mode === 'login') loginUser();
  if (mode === 'signup') signupUser();
}

async function loginUser() {
  const email = document.getElementById('loginEmail')?.value.trim().toLowerCase();
  const password = document.getElementById('loginPassword')?.value || '';

  if (!email || !password) {
    toast('Enter email and password', 'error');
    return;
  }

  try {
    const data = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });

    setAuthSession(data.token, data.user);
    await mergeGuestFavouritesIntoAccount();
    await fetchCurrentUserOrders();
    updateAuthUI();
    renderAuthView();
    closeAuthModal(true);
    toast(`Welcome back, ${currentUser.name.split(' ')[0]}`, 'success');
    continuePostAuthFlow();
  } catch (error) {
    toast(error.message, 'error');
  }
}

async function signupUser() {
  const name = document.getElementById('signupName')?.value.trim();
  const email = document.getElementById('signupEmail')?.value.trim().toLowerCase();
  const phone = document.getElementById('signupPhone')?.value.trim();
  const password = document.getElementById('signupPassword')?.value || '';

  if (!name || !email || !phone || !password) {
    toast('Please fill all signup fields', 'error');
    return;
  }
  if (!/^\d{10}$/.test(phone)) {
    toast('Enter a valid 10-digit phone number', 'error');
    return;
  }
  if (password.length < 6) {
    toast('Password must be at least 6 characters', 'error');
    return;
  }

  try {
    const data = await apiRequest('/api/auth/signup', {
      method: 'POST',
      body: { name, email, phone, password },
    });

    setAuthSession(data.token, data.user);
    await mergeGuestFavouritesIntoAccount();
    ordersCache = [];
    userOrderCount = 0;
    updateAuthUI();
    renderAuthView();
    closeAuthModal(true);
    toast('Account created successfully', 'success');
    continuePostAuthFlow();
  } catch (error) {
    toast(error.message, 'error');
  }
}

async function logoutUser() {
  try {
    if (getAuthToken()) {
      await apiRequest('/api/auth/logout', {
        method: 'POST',
        auth: true,
      });
    }
  } catch (error) {
    handleSessionExpiry(error, { auth: true });
  }

  clearAuthSession();
  closeAuthModal();
  updateAuthUI();
  renderAuthView();
  if (currentPage === 'orders' || currentPage === 'tracking') showPage('home', { remember: false });
  toast('Signed out from QuickBite', 'info');
}

function continuePostAuthFlow() {
  const intent = authIntent;
  authIntent = null;
  if (!intent) return;

  if (intent.type === 'checkout') {
    openModal();
    return;
  }
  if (intent.type === 'orders') {
    showPage('orders', { remember: false });
    return;
  }
  if (intent.type === 'tracking' && intent.orderId) {
    trackOrder(intent.orderId);
  }
}

function getStatusRank(status) {
  const ranks = { Pending: 0, Confirmed: 1, Delivered: 2 };
  return ranks[status] ?? -1;
}

function getCurrentUserOrders() {
  return currentUser ? ordersCache : [];
}

function renderResultsMeta(list) {
  const meta = document.getElementById('resultsMeta');
  if (!meta) return;
  const activeCategoryName = categories.find(category => category.id === activeCat)?.name || activeCat;

  const pills = [
    `<span class="results-pill"><strong>${list.length}</strong> grocery stores in ${activeLocation.split(',')[0]}</span>`,
  ];
  if (activeCat !== 'all') pills.push(`<span class="results-pill">Category: <strong>${activeCategoryName}</strong></span>`);
  if (searchQuery.trim()) pills.push(`<span class="results-pill">Search: <strong>${searchQuery.trim()}</strong></span>`);
  pills.push(`<span class="results-pill">Sort: <strong>${getSortLabel(currentSort)}</strong></span>`);
  if (liveRestaurantsLoading) {
    pills.push(`<span class="results-pill">Fetching: <strong>Store inventory...</strong></span>`);
  }
  if (restaurantSourceNote) {
    pills.push(`<span class="results-pill">${restaurantSourceNote}</span>`);
  }

  meta.innerHTML = pills.join('');
}

function getTrackingMetrics(order) {
  const now = Date.now();
  const totalMs = (order.etaMinutes || 30) * 60 * 1000;
  const elapsed = Math.max(0, now - (order.createdAt || now));
  const rawProgress = totalMs ? Math.min(elapsed / totalMs, 1) : 1;
  const progress = order.status === 'Cancelled' ? 0.18 : order.status === 'Delivered' ? 1 : rawProgress;
  const remainingMs = Math.max(totalMs - elapsed, 0);
  const remainingMin = Math.ceil(remainingMs / 60000);
  const activeStop = progress < 0.34 ? 'pickup' : progress < 0.8 ? 'midway' : 'drop';
  const headline = order.status === 'Cancelled'
    ? 'This order was cancelled'
    : order.status === 'Delivered'
      ? 'Delivered at your doorstep'
      : order.status === 'Confirmed'
        ? 'Your rider is on the way'
        : 'Store is packing your groceries';

  return {
    progressPercent: Math.round(progress * 100),
    riderLeft: 10 + progress * 80,
    activeStop,
    headline,
    remainingText: order.status === 'Cancelled' ? 'Cancelled' : order.status === 'Delivered' ? 'Delivered' : `${remainingMin} min left`,
    paymentText: order.payment === 'COD' ? 'Pay cash on delivery' : 'Payment received successfully',
  };
}

function stopOrdersRefreshTimer() {
  if (ordersRefreshTimerId) {
    window.clearInterval(ordersRefreshTimerId);
    ordersRefreshTimerId = null;
  }
}

function startOrdersRefreshTimer() {
  stopOrdersRefreshTimer();
  ordersRefreshTimerId = window.setInterval(() => {
    if (currentPage !== 'orders') return;
    renderOrders({ silent: true });
  }, 4000);
}

function stopTrackingTimer() {
  if (trackingTimerId) {
    window.clearInterval(trackingTimerId);
    trackingTimerId = null;
  }
}

function startTrackingTimer(orderId) {
  stopTrackingTimer();
  trackingTimerId = window.setInterval(() => {
    if (currentPage !== 'tracking') return;
    renderTrackingPage(orderId);
  }, 1000);
}

function trackOrder(orderId) {
  if (!requireAuth({ type: 'tracking', orderId })) return;
  trackingOrderId = orderId;
  showPage('tracking');
}

async function renderTrackingPage(orderId = trackingOrderId) {
  const content = document.getElementById('trackingContent');
  if (!content) return;

  try {
    const orders = await fetchCurrentUserOrders();
    const order = orders.find(item => item.orderId === orderId);
    if (!order) {
      content.innerHTML = `
        <div class="empty-state">
          <h3>Order not found</h3>
          <p>We could not find this order in your account.</p>
          <button class="btn-primary" onclick="showPage('orders')">View My Orders</button>
        </div>
      `;
      stopTrackingTimer();
      return;
    }

    const metrics = getTrackingMetrics(order);
    const showSuccess = successOrderId === order.orderId
      && order.status !== 'Delivered'
      && order.status !== 'Cancelled';
    content.innerHTML = `
      <div class="page-heading">
        <button class="back-btn" onclick="goBack()">← Back</button>
        <h2>Track Order</h2>
      </div>
      ${showSuccess ? `
        <section class="tracking-success">
          <div class="tracking-success-check" aria-hidden="true">
            <svg viewBox="0 0 72 72">
              <circle class="tsc-circle" cx="36" cy="36" r="30"></circle>
              <path class="tsc-tick" d="M22 37 L32 47 L50 27"></path>
            </svg>
          </div>
          <span class="tracking-kicker">${order.payment === 'COD' ? 'Order confirmed' : 'Payment successful'}</span>
          <h2>${order.payment === 'COD' ? 'Your order is placed.' : 'Your payment went through.'}</h2>
          <p>${order.restName} has received your grocery order and packing is already in progress.</p>
          <div class="tracking-chip-row">
            <span class="tracking-chip">Order ID ${order.orderId}</span>
            <span class="tracking-chip">${metrics.paymentText}</span>
            <span class="tracking-chip">${getEtaLabel(order)}</span>
          </div>
        </section>
      ` : ''}
      <div class="tracking-shell">
        <section class="tracking-card">
          <div class="tracking-card-head">
            <div>
              <h3>${metrics.headline}</h3>
              <p class="order-date">${order.restName} · ${getOrderPlacedLabel(order)}</p>
            </div>
            <span class="status-pill s-${order.status}">${order.status}</span>
          </div>
          <div class="tracking-map">
            <div class="tracking-line">
              <div class="tracking-line-progress" style="width:${metrics.progressPercent}%"></div>
            </div>
            <div class="tracking-stop pickup ${metrics.activeStop === 'pickup' || metrics.progressPercent > 34 ? 'active' : ''}">
              <div class="tracking-stop-dot"></div>
              <span>Store</span>
            </div>
            <div class="tracking-stop midway ${metrics.activeStop === 'midway' || metrics.progressPercent > 80 ? 'active' : ''}">
              <div class="tracking-stop-dot"></div>
              <span>On the way</span>
            </div>
            <div class="tracking-stop drop ${metrics.activeStop === 'drop' && order.status !== 'Cancelled' ? 'active' : ''}">
              <div class="tracking-stop-dot"></div>
              <span>Your door</span>
            </div>
            <div class="tracking-rider" style="left:${metrics.riderLeft}%">
              <span class="tracking-rider-badge">${metrics.remainingText}</span>
              <span class="tracking-rider-scooter">🛵</span>
            </div>
            <div class="tracking-legend">
              <div>
                <strong>Store</strong>
                Packing your grocery basket
              </div>
              <div>
                <strong>Delivery status</strong>
                ${metrics.headline}
              </div>
              <div>
                <strong>ETA</strong>
                ${getEtaLabel(order)}
              </div>
            </div>
          </div>
        </section>
        <aside class="tracking-summary">
          <div class="tracking-summary-head">
            <h3>Order Summary</h3>
            <div class="order-total-amt">₹${order.total}</div>
          </div>
          <div class="tracking-detail-list">
            <div class="tracking-detail-item">
              <span class="tracking-label">Ordered at</span>
              <div class="tracking-value">${formatOrderDateTime(order)}</div>
            </div>
            <div class="tracking-detail-item">
              <span class="tracking-label">Live now</span>
              <div class="tracking-value tracking-live-time">${getLiveNowLabel()}</div>
            </div>
            <div class="tracking-detail-item">
              <span class="tracking-label">Delivery address</span>
              <div class="tracking-value">${order.customer.address}</div>
            </div>
            <div class="tracking-detail-item">
              <span class="tracking-label">Payment</span>
              <div class="tracking-value">${order.payment}</div>
            </div>
            <div class="tracking-detail-item">
              <span class="tracking-label">Instructions</span>
              <div class="tracking-value">${order.customer.note || 'No extra instructions'}</div>
            </div>
          </div>
          <div class="tracking-item-list">
            ${order.items.map(item => `
              <div class="tracking-item-row">
                <span>${item.name} ×${item.qty}</span>
                <strong>₹${item.price * item.qty}</strong>
              </div>
            `).join('')}
          </div>
          <div class="tracking-cta">
            <button class="btn-primary" type="button" onclick="showPage('orders')">All Orders</button>
            <button class="tracking-ghost-btn" type="button" onclick="showPage('home')">Back Home</button>
          </div>
        </aside>
      </div>
    `;

    if (order.status === 'Delivered' || order.status === 'Cancelled') {
      stopTrackingTimer();
      if (successOrderId === order.orderId) {
        successOrderId = '';
        sessionStorage.removeItem('qb_success_order');
      }
    } else {
      startTrackingTimer(order.orderId);
    }

    if (showSuccess) {
      // Persist success UI while the order is still in-progress.
      sessionStorage.setItem('qb_success_order', successOrderId);
    } else if (successOrderId === order.orderId) {
      successOrderId = '';
      sessionStorage.removeItem('qb_success_order');
    }
  } catch (error) {
    handleSessionExpiry(error, { auth: true });
    if (error?.status === 401) {
      stopTrackingTimer();
      showPage('home', { remember: false });
      toast('Sign in again to continue tracking your order.', 'info');
      return;
    }

    content.innerHTML = `
      <div class="empty-state">
        <h3>Tracking is unavailable</h3>
        <p>${error.message}</p>
        <button class="btn-primary" onclick="showPage('orders')">Back to Orders</button>
      </div>
    `;
    stopTrackingTimer();
  }
}

function runHeroSearch() {
  const heroSearch = document.getElementById('heroSearch');
  const value = heroSearch ? heroSearch.value : '';
  if (!value.trim()) {
    document.getElementById('restaurantSection').scrollIntoView({ behavior: 'smooth' });
    return;
  }
  handleSearch(value);
}

function renderCouponPanel(totals) {
  const couponHints = Object.values(couponCatalog).map(coupon => `
    <span class="coupon-chip">${coupon.code} · ${coupon.title}</span>
  `).join('');

  return `
    <div class="coupon-panel">
      <div class="coupon-panel-title">Offers & coupons</div>
      <div class="coupon-input-row">
        <input type="text" id="couponInput" placeholder="Try FIRST50, SAVE20 or FREEDEL" value="${appliedCouponCode}"/>
        <button class="coupon-action" onclick="applyCoupon()">Apply</button>
      </div>
      ${totals.coupon ? `
        <div class="coupon-active">
          <div>
            <strong>${totals.coupon.code}</strong>
            <span>${totals.couponMessage || totals.coupon.description}</span>
          </div>
          <button class="coupon-remove" onclick="removeCoupon()">Remove</button>
        </div>
      ` : ''}
      <div class="coupon-help">${couponHints}</div>
      <div class="coupon-tip">Coupons apply instantly in the browser, and final grocery orders are stored on the backend at checkout.</div>
    </div>
  `;
}

function renderOrderProgress(status) {
  if (status === 'Cancelled') {
    return `
      <div class="order-progress">
        <div class="order-step done">
          <strong>Placed</strong>
          <span>Received</span>
        </div>
        <div class="order-step cancelled">
          <strong>Cancelled</strong>
          <span>Stopped by admin</span>
        </div>
        <div class="order-step">
          <strong>Delivery</strong>
          <span>Not dispatched</span>
        </div>
      </div>
    `;
  }

  const steps = ['Pending', 'Confirmed', 'Delivered'];
  const currentIndex = Math.max(steps.indexOf(status), 0);

  return `
    <div class="order-progress">
      ${steps.map((step, index) => `
        <div class="order-step ${index < currentIndex ? 'done' : ''} ${index === currentIndex ? 'current' : ''}">
          <strong>${step}</strong>
          <span>${index < currentIndex ? 'Completed' : index === currentIndex ? 'Active now' : 'Waiting'}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function getOrderTimestamp(order) {
  const createdAt = Number(order?.createdAt);
  if (Number.isFinite(createdAt) && createdAt > 0) return createdAt;
  return Date.now();
}

function formatOrderDateTime(order) {
  return new Date(getOrderTimestamp(order)).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  });
}

function getOrderPlacedLabel(order) {
  return `Ordered on ${formatOrderDateTime(order)}`;
}

function getOrderAgeLabel(order) {
  const elapsedMs = Math.max(Date.now() - getOrderTimestamp(order), 0);
  const elapsedSeconds = Math.floor(elapsedMs / 1000);

  if (elapsedSeconds < 60) return 'Placed just now';

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  if (elapsedMinutes < 60) return `Placed ${elapsedMinutes} min ago`;

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `Placed ${elapsedHours} hr ago`;

  const elapsedDays = Math.floor(elapsedHours / 24);
  return `Placed ${elapsedDays} day${elapsedDays === 1 ? '' : 's'} ago`;
}

function getLiveNowLabel() {
  return new Date().toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  });
}

function getEtaLabel(order) {
  if (order.status === 'Delivered') return 'Delivered successfully';
  if (order.status === 'Cancelled') return 'Order cancelled';

  const createdAt = order.createdAt || Date.now();
  const etaMinutes = order.etaMinutes || 30;
  const etaTime = new Date(createdAt + etaMinutes * 60000);
  const formatted = etaTime.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
  return `ETA by ${formatted}`;
}

// ─────────────────────────────────────────────
//  PAGE ROUTER
// ─────────────────────────────────────────────
function showPage(page, options = {}) {
  const { remember = true, scrollToTop = true } = options;
  if (page === 'admin' && !adminAuthenticated) {
    openAdminModal();
    return;
  }
  if (page === 'orders' && !requireAuth({ type: 'orders' })) return;

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  closeLocationDrop();
  if (page !== 'tracking') stopTrackingTimer();
  if (page !== 'orders') stopOrdersRefreshTimer();
  if (remember && currentPage !== page) prevPage = currentPage;
  currentPage = page;

  if (page === 'home') {
    document.getElementById('homePage').classList.add('active');
    renderHomePage();
  } else if (page === 'cart') {
    document.getElementById('cartPage').classList.add('active');
    renderFullCart();
  } else if (page === 'orders') {
    document.getElementById('ordersPage').classList.add('active');
    renderOrders();
    startOrdersRefreshTimer();
  } else if (page === 'tracking') {
    document.getElementById('trackingPage').classList.add('active');
    renderTrackingPage();
  } else if (page === 'admin') {
    document.getElementById('adminPage').classList.add('active');
    renderAdmin();
  }

  if (scrollToTop) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function goBack() {
  if (prevPage === 'restaurant' && currentRest) {
    openRestaurant(currentRest.id, { remember: false });
    return;
  }
  showPage(prevPage || 'home', { remember: false });
}

// ─────────────────────────────────────────────
//  HOME: Categories
// ─────────────────────────────────────────────
function renderCategories() {
  const grid = document.getElementById('categoriesGrid');
  grid.innerHTML = categories.map(c => `
    <div class="cat-card ${activeCat===c.id?'active-cat':''}" onclick="filterByCategory('${c.id}')">
      <img src="${c.img}" alt="${c.name}" loading="lazy"/>
      <p>${c.name}</p>
    </div>
  `).join('');
}

function filterByCategory(catId) {
  activeCat = activeCat === catId ? 'all' : catId;
  renderHomePage({ scrollToSection: true });
}

// ─────────────────────────────────────────────
//  HOME: Restaurants Grid
// ─────────────────────────────────────────────
function renderRestaurants(list) {
  const grid = document.getElementById('restaurantsGrid');
  if (liveRestaurantsLoading && !list.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><h3>Loading grocery stores...</h3><p>Fetching live inventory for ${activeLocation}.</p></div>`;
    return;
  }
  if (!list.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><h3>No grocery stores found</h3><p>${liveRestaurantsError || 'Try a different search or category.'}</p></div>`;
    return;
  }
  grid.innerHTML = list.map(r => `
    <div class="rest-card" onclick="openRestaurant(${r.id})">
      <div class="rest-img-wrap">
        <img src="${r.img}" alt="${r.name}" loading="lazy"/>
        ${r.promo ? `<span class="rest-tag promo">${r.promo}</span>` : ''}
        <button class="rest-save ${isFavourite(r.id) ? 'saved' : ''}" onclick="event.stopPropagation(); toggleSave(this, ${r.id})" title="Save">${isFavourite(r.id) ? '♥' : '♡'}</button>
      </div>
      <div class="rest-info">
        <div class="rest-name">${r.name}</div>
        <div class="rest-meta">
          <span class="rest-rating ${r.rating>=4.5?'':'low'}">★ ${r.rating}</span>
          <span class="rest-time">${r.deliveryTime} mins</span>
          <span>₹${r.avgCost} avg basket</span>
        </div>
        <div class="rest-cuisine">${r.cuisine}</div>
        <div class="rest-footer">
          <span>${r.address || `Min. basket: ₹${r.minOrder}`}</span>
          <span>${r.tags.map(t=>`<span style="background:#fff0f1;color:var(--red);font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px;margin-left:4px">${t}</span>`).join('')}</span>
        </div>
      </div>
    </div>
  `).join('');
}

async function toggleSave(btn, restId) {
  const alreadySaved = isFavourite(restId);
  const nextFavourites = alreadySaved
    ? favourites.filter(id => id !== restId)
    : [...favourites, restId];

  favourites = nextFavourites;
  btn.classList.toggle('saved', !alreadySaved);
  btn.textContent = !alreadySaved ? '♥' : '♡';

  if (!currentUser) {
    guestFavourites = [...nextFavourites];
    saveGuestFavourites();
    toast(!alreadySaved ? 'Added to favourites' : 'Removed from favourites', 'info');
    return;
  }

  try {
    await syncCurrentUserProfile({ favourites: nextFavourites }, { silent: true, rerenderProfile: false });
    toast(!alreadySaved ? 'Added to favourites' : 'Removed from favourites', 'info');
  } catch (error) {
    handleSessionExpiry(error, { auth: true });
    syncFavouritesState();
    btn.classList.toggle('saved', isFavourite(restId));
    btn.textContent = isFavourite(restId) ? '♥' : '♡';
    toast(error.message, 'error');
  }
}

function sortRestaurants(by) {
  currentSort = by;
  renderHomePage();
}

// ─────────────────────────────────────────────
//  RESTAURANT DETAIL
// ─────────────────────────────────────────────
function openRestaurant(id, options = {}) {
  const { remember = true } = options;
  currentRest = getRestaurantById(id);
  if (!currentRest) return;

  if (remember && currentPage !== 'restaurant') prevPage = currentPage;
  currentPage = 'restaurant';
  closeLocationDrop();

  const page  = document.getElementById('restaurantPage');
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  page.classList.add('active');

  // Group products by bestseller / regular
  const best  = currentRest.menu.filter(m => m.bestseller);
  const other = currentRest.menu.filter(m => !m.bestseller);
  const lowStockCount = currentRest.menu.filter(item => Number(item.stock || 0) <= Number(item.reorderLevel || 8)).length;
  const outOfStockCount = currentRest.menu.filter(item => Number(item.stock || 0) <= 0).length;

  const storeInfoBlock = `
    <aside class="rest-live-card">
      <div class="rest-live-card-head">
        <h3>Store Snapshot</h3>
        <span class="rest-live-distance">${currentRest.deliveryTime} min delivery</span>
      </div>
      <div class="rest-live-list">
        <div class="rest-live-item">
          <span class="rest-live-label">Address</span>
          <div class="rest-live-value">${currentRest.address || activeLocation}</div>
        </div>
        <div class="rest-live-item">
          <span class="rest-live-label">Inventory</span>
          <div class="rest-live-value">${currentRest.menu.length} products listed</div>
        </div>
        <div class="rest-live-item">
          <span class="rest-live-label">Stock Health</span>
          <div class="rest-live-value">${outOfStockCount} out of stock · ${lowStockCount} low stock</div>
        </div>
      </div>
      <div class="rest-live-note">Live stock updates are validated at checkout for fast and safe ordering.</div>
    </aside>
  `;

  page.innerHTML = `
    <img src="${currentRest.img}" alt="${currentRest.name}" class="rest-detail-hero"/>

    <div class="rest-detail-header">
      <div class="rest-detail-header-inner">
        <div>
          <div class="rest-detail-name">${currentRest.name}</div>
          <div class="rest-detail-meta">
            <span class="rating-chip">★ ${currentRest.rating}</span>
            <span class="meta-chip">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Delivery in ${currentRest.deliveryTime} mins
            </span>
            <span class="meta-chip">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
              ₹${currentRest.avgCost} avg basket
            </span>
            <span class="meta-chip" style="color:var(--green);font-weight:700">${currentRest.promo}</span>
          </div>
        </div>
        <button class="back-btn" onclick="showPage('home')">← Back to stores</button>
      </div>
    </div>

    <div class="rest-detail-body">
      <div class="menu-col">
        ${best.length ? `
          <div class="menu-category">
            <div class="menu-cat-title">Popular Products</div>
            <div class="menu-items">${best.map(item => menuItemHTML(item)).join('')}</div>
          </div>
        ` : ''}
        ${other.length ? `
          <div class="menu-category">
            <div class="menu-cat-title">All Products</div>
            <div class="menu-items">${other.map(item => menuItemHTML(item)).join('')}</div>
          </div>
          ` : ''}
      </div>

      <div class="restaurant-side-col">
        ${storeInfoBlock}
        <div id="cartSidebarWrap">${renderCartSidebar()}</div>
      </div>
    </div>
  `;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function menuItemHTML(item) {
  const inCart = cart.find(c => c.id === item.id);
  const qty    = inCart ? inCart.qty : 0;
  const stock  = Number(item.stock || 0);
  const isOutOfStock = stock <= 0;
  const atLimit = qty >= stock && stock > 0;
  const unitLabel = item.unit ? ` / ${item.unit}` : '';
  return `
    <div class="menu-item" id="menuItem${item.id}">
      <div class="menu-item-info">
        <div class="veg-dot ${item.veg ? 'veg' : 'nonveg'}"></div>
        <div class="menu-item-name">${item.name}${item.bestseller ? ' <span style="font-size:11px;background:#fff0f1;color:var(--red);padding:2px 7px;border-radius:4px;font-weight:700;margin-left:4px">Bestseller</span>' : ''}</div>
        <div class="menu-item-desc">${item.desc}</div>
        <div class="menu-item-price">₹${item.price}${unitLabel}</div>
        <div class="menu-item-desc" style="margin-top:4px;color:${isOutOfStock ? '#cc2323' : 'var(--text-4)'};font-weight:700">
          ${isOutOfStock ? 'Out of stock' : `${stock} in stock`}
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:10px">
        <img src="${item.img}" alt="${item.name}" class="menu-item-img" loading="lazy"/>
        <div class="add-item-btn ${qty===0?'zero':''}" id="addBtn${item.id}">
          <button class="btn-minus" onclick="changeQty(${item.id}, ${currentRest.id}, -1)" ${qty === 0 ? 'disabled' : ''}>−</button>
          <span class="btn-count">${qty}</span>
          <button class="btn-plus" onclick="changeQty(${item.id}, ${currentRest.id}, +1)" ${isOutOfStock || atLimit ? 'disabled' : ''}>${qty===0 ? (isOutOfStock ? 'OUT' : 'ADD') : '+'}</button>
        </div>
      </div>
    </div>
  `;
}

function renderCartSidebar() {
  const restCart = cart.filter(c => c.restId === (currentRest ? currentRest.id : null));
  const subtotal = restCart.reduce((s,i) => s + i.price * i.qty, 0);
  const delivery = subtotal >= 299 ? 0 : 40;
  const tax      = Math.round(subtotal * 0.05);
  const total    = subtotal + delivery + tax;

  if (!restCart.length) return `
    <div class="cart-sidebar">
      <div class="cart-sidebar-header">
        <span class="cart-sidebar-title">Your Cart</span>
      </div>
      <div style="padding:40px 20px;text-align:center;color:var(--text-4)">
        <div style="font-size:2rem;margin-bottom:10px">🛒</div>
        <p style="font-size:13px">Your cart is empty.<br/>Add items to get started.</p>
      </div>
    </div>
  `;

  return `
    <div class="cart-sidebar">
      <div class="cart-sidebar-header">
        <span class="cart-sidebar-title">Your Cart</span>
        <span class="cart-sidebar-count">${restCart.reduce((s,i)=>s+i.qty,0)} items</span>
      </div>
      <div class="cart-sidebar-items">
        ${restCart.map(item => `
          <div class="cart-row">
            <img src="${item.img}" alt="${item.name}" class="cart-row-img"/>
            <div class="cart-row-info">
              <div class="cart-row-name">${item.name}</div>
              <div class="cart-row-price">₹${item.price * item.qty}</div>
            </div>
            <div class="cart-row-qty">
              <button onclick="changeQty(${item.id}, ${currentRest.id}, -1)">−</button>
              <span>${item.qty}</span>
              <button onclick="changeQty(${item.id}, ${currentRest.id}, +1)">+</button>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="cart-sidebar-footer">
        <div class="cart-totals">
          <div class="total-row"><span>Subtotal</span><span>₹${subtotal}</span></div>
          <div class="total-row"><span>Delivery</span><span>${delivery===0?'<span style="color:var(--green);font-weight:700">FREE</span>':'₹'+delivery}</span></div>
          <div class="total-row"><span>GST (5%)</span><span>₹${tax}</span></div>
          <div class="total-row grand"><span>Total</span><span>₹${total}</span></div>
        </div>
        <button class="btn-primary w-full" onclick="showPage('cart')">View Full Cart →</button>
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────
//  CART LOGIC
// ─────────────────────────────────────────────
function changeQty(itemId, restId, delta) {
  const rest = restaurants.find(r => r.id === restId);
  if (!rest) return;
  const menuItem = rest.menu.find(m => m.id === itemId);
  if (!menuItem) return;
  const maxStock = Number(menuItem.stock || 0);
  const existing = cart.find(c => c.id === itemId);
  const cartRestaurant = getCartRestaurant();

  if (!existing && delta > 0 && cartRestaurant && cartRestaurant.id !== restId) {
    const shouldStartNewCart = window.confirm(
      `Your cart already has items from ${cartRestaurant.name}. Start a new cart for ${rest.name}?`
    );
    if (!shouldStartNewCart) {
      toast(`Finish your ${cartRestaurant.name} cart or clear it first`, 'info');
      return;
    }
    cart = [];
  }

  if (delta > 0 && maxStock <= 0) {
    toast(`${menuItem.name} is out of stock`, 'error');
    return;
  }

  if (delta > 0 && existing && existing.qty >= maxStock) {
    toast(`Only ${maxStock} left for ${menuItem.name}`, 'info');
    return;
  }

  if (existing) {
    existing.qty += delta;
    if (existing.qty <= 0) cart = cart.filter(c => c.id !== itemId);
  } else if (delta > 0) {
    cart.push({
      id: menuItem.id,
      restId,
      name: menuItem.name,
      price: menuItem.price,
      img: menuItem.img,
      qty: 1,
      stock: maxStock,
      unit: menuItem.unit || '',
    });
    toast(`${menuItem.name} added to cart`, 'success');
  }

  if (!cart.length) clearAppliedCoupon();
  saveCart();
  updateCartCount();

  // Update button in menu
  const btn = document.getElementById(`addBtn${itemId}`);
  if (btn) {
    const inCart = cart.find(c => c.id === itemId);
    const qty = inCart ? inCart.qty : 0;
    btn.className = `add-item-btn ${qty === 0 ? 'zero' : ''}`;
    btn.querySelector('.btn-count').textContent = qty;
    const plusBtn = btn.querySelector('.btn-plus');
    const minusBtn = btn.querySelector('.btn-minus');
    plusBtn.textContent = qty === 0 ? (maxStock > 0 ? 'ADD' : 'OUT') : '+';
    plusBtn.disabled = maxStock <= 0 || qty >= maxStock;
    minusBtn.disabled = qty === 0;
  }

  // Refresh sidebar
  const sidebar = document.getElementById('cartSidebarWrap');
  if (sidebar) sidebar.innerHTML = renderCartSidebar();
  if (currentPage === 'cart') renderFullCart();
}

function updateCartCount() {
  const total = cart.reduce((s,i) => s + i.qty, 0);
  document.getElementById('cartCount').textContent = total;
  updateCartActions();
}

// ─────────────────────────────────────────────
//  FULL CART PAGE
// ─────────────────────────────────────────────
function renderFullCart() {
  const itemsDiv   = document.getElementById('cartItems');
  const summaryDiv = document.getElementById('cartSummary');
  const mixedCart  = hasMixedCart();
  const cartRestaurant = getCartRestaurant();
  const totals = calculateCartTotals();

  if (!cart.length) {
    itemsDiv.innerHTML = `
      <div class="empty-state">
        <img src="https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=300&q=80&auto=format" alt="empty"/>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added anything yet.</p>
        <button class="btn-primary" onclick="showPage('home')">Browse Stores</button>
      </div>`;
    summaryDiv.innerHTML = '';
    return;
  }

  itemsDiv.innerHTML = `
    ${cartRestaurant ? `
      <div class="cart-origin">
        <div>
          <span class="cart-origin-label">Ordering from</span>
          <strong>${cartRestaurant.name}</strong>
        </div>
        <span class="cart-origin-time">${cartRestaurant.deliveryTime} mins</span>
      </div>
    ` : ''}
    <div class="cart-items-list">
      ${cart.map(item => `
        <div class="full-cart-item">
          <img src="${item.img}" alt="${item.name}"/>
          <div class="full-cart-item-info">
            <h4>${item.name}</h4>
            <p>₹${item.price} per item</p>
          </div>
          <div class="cart-row-qty">
            <button onclick="changeCartQty(${item.id}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="changeCartQty(${item.id}, +1)">+</button>
          </div>
          <span style="font-weight:800;font-size:15px;min-width:60px;text-align:right">₹${item.price * item.qty}</span>
          <button class="remove-item-btn" onclick="removeCartItem(${item.id})" title="Remove">✕</button>
        </div>
      `).join('')}
    </div>
  `;

  summaryDiv.innerHTML = `
    <div class="cart-summary-box">
      <div class="csb-head"><h3>Bill Details</h3></div>
      <div class="csb-body">
        <div class="csb-row"><span>Item Total</span><span>₹${totals.subtotal}</span></div>
        <div class="csb-row"><span>Delivery Fee</span><span>${totals.finalDelivery===0?'<span style="color:var(--green);font-weight:700">FREE</span>':'₹'+totals.finalDelivery}</span></div>
        ${totals.discountTotal > 0 ? `<div class="csb-row"><span>Coupon Savings</span><span style="color:var(--green);font-weight:700">-₹${totals.discountTotal}</span></div>` : ''}
        <div class="csb-row"><span>GST & Taxes (5%)</span><span>₹${totals.tax}</span></div>
        ${renderCouponPanel(totals)}
        <div class="csb-row grand"><span>To Pay</span><span>₹${totals.total}</span></div>
        ${totals.savings>0?`<div class="csb-savings">You save ₹${totals.savings} on this order!</div>`:''}
        ${mixedCart ? '<div class="cart-warning">Keep items from only one store in the cart before checkout.</div>' : ''}
      </div>
      <div class="csb-footer">
        <button class="btn-primary w-full" onclick="openModal()" ${mixedCart ? 'disabled' : ''}>Proceed to Checkout</button>
      </div>
    </div>
  `;
}

function changeCartQty(itemId, delta) {
  const item = cart.find(c => c.id === itemId);
  if (!item) return;

  const storeEntry = restaurants.find(entry => entry.id === item.restId);
  const catalogItem = storeEntry?.menu?.find(entry => entry.id === item.id);
  const maxStock = Number(catalogItem?.stock ?? item.stock ?? 0);

  if (delta > 0 && maxStock <= 0) {
    toast(`${item.name} is currently out of stock`, 'error');
    return;
  }

  if (delta > 0 && maxStock > 0 && item.qty >= maxStock) {
    toast(`Only ${maxStock} units available for ${item.name}`, 'info');
    return;
  }

  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(c => c.id !== itemId);
  if (!cart.length) clearAppliedCoupon();
  saveCart();
  updateCartCount();
  renderFullCart();
}

function removeCartItem(itemId) {
  cart = cart.filter(c => c.id !== itemId);
  if (!cart.length) clearAppliedCoupon();
  saveCart();
  updateCartCount();
  renderFullCart();
  toast('Item removed', 'info');
}

function clearCart(force = false) {
  if (!cart.length) {
    toast('Cart is already empty', 'info');
    return;
  }

  if (!force && !window.confirm('Clear all items from your cart?')) return;

  cart = [];
  clearAppliedCoupon();
  saveCart();
  updateCartCount();
  renderFullCart();

  const sidebar = document.getElementById('cartSidebarWrap');
  if (sidebar) sidebar.innerHTML = renderCartSidebar();

  toast('Cart cleared', 'info');
}

function applyCoupon() {
  if (!cart.length) {
    toast('Add items to the cart before using a coupon', 'info');
    return;
  }

  const input = document.getElementById('couponInput');
  const code = input ? input.value.trim().toUpperCase() : '';

  if (!code) {
    toast('Enter a coupon code first', 'info');
    return;
  }

  if (!couponCatalog[code]) {
    toast('That coupon does not exist', 'error');
    return;
  }

  appliedCouponCode = code;
  saveCoupon();
  const totals = calculateCartTotals();
  renderFullCart();
  toast(totals.couponEligible ? `${code} applied` : totals.couponMessage, totals.couponEligible ? 'success' : 'info');
}

function removeCoupon() {
  if (!appliedCouponCode) return;
  clearAppliedCoupon();
  renderFullCart();
  toast('Coupon removed', 'info');
}

function prefillCheckoutForm() {
  if (!currentUser) return;
  const nameInput = document.getElementById('custName');
  const phoneInput = document.getElementById('custPhone');
  const addressInput = document.getElementById('custAddress');

  if (nameInput && !nameInput.value.trim()) nameInput.value = currentUser.name || '';
  if (phoneInput && !phoneInput.value.trim()) phoneInput.value = currentUser.phone || '';
  if (addressInput && !addressInput.value.trim()) addressInput.value = currentUser.address || '';
}

async function syncCurrentUserProfile(updates = {}, options = {}) {
  if (!currentUser) return null;

  const payload = {};
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.phone !== undefined) payload.phone = updates.phone;
  if (updates.address !== undefined) payload.address = updates.address;
  if (updates.favourites !== undefined) payload.favourites = updates.favourites;
  if (!Object.keys(payload).length) return currentUser;

  const data = await apiRequest('/api/users/me/profile', {
    method: 'PUT',
    body: payload,
    auth: true,
  });

  setCurrentUser(data.user);
  updateAuthUI();
  if (options.rerenderProfile !== false && document.getElementById('authModal')?.classList.contains('open')) {
    renderAuthView();
  }
  return currentUser;
}

// ─────────────────────────────────────────────
//  CHECKOUT MODAL
// ─────────────────────────────────────────────
function openModal() {
  if (!requireAuth({ type: 'checkout' })) return;
  if (!cart.length) { toast('Cart is empty!', 'error'); return; }
  if (hasMixedCart()) {
    toast('Please keep items from only one store before checkout', 'error');
    showPage('cart', { remember: false, scrollToTop: false });
    return;
  }
  const totals = calculateCartTotals();
  prefillCheckoutForm();
  document.getElementById('modalSummary').innerHTML = `
    <div style="margin-bottom:4px;font-size:13px">${cart.map(i=>`${i.name} ×${i.qty}`).join(', ')}</div>
    ${totals.discountTotal > 0 ? `<div style="margin-bottom:4px;font-size:13px;color:var(--green);font-weight:700">Savings: ₹${totals.discountTotal}</div>` : ''}
    <div class="grand-line">Total: ₹${totals.total}</div>
  `;
  document.getElementById('checkoutModal').classList.add('open');
}

function closeModal() {
  document.getElementById('checkoutModal').classList.remove('open');
}

function showOrderPlacedSuccess(orderId = '') {
  const overlay = document.getElementById('orderSuccessOverlay');
  const message = document.getElementById('orderSuccessMessage');
  if (!overlay) return Promise.resolve();

  if (message) {
    message.textContent = orderId
      ? `Order ID ${orderId} confirmed`
      : 'Your grocery basket is confirmed';
  }

  overlay.classList.add('show');
  overlay.setAttribute('aria-hidden', 'false');

  if (orderSuccessAnimationTimerId) {
    window.clearTimeout(orderSuccessAnimationTimerId);
    orderSuccessAnimationTimerId = null;
  }

  return new Promise(resolve => {
    orderSuccessAnimationTimerId = window.setTimeout(() => {
      overlay.classList.remove('show');
      overlay.setAttribute('aria-hidden', 'true');
      orderSuccessAnimationTimerId = null;
      resolve();
    }, 1350);
  });
}

async function placeOrder() {
  if (!currentUser) {
    authIntent = { type: 'checkout' };
    closeModal();
    openAuthModal('login');
    return;
  }
  if (!cart.length) { toast('Your cart is empty', 'error'); return; }
  if (hasMixedCart()) { toast('Checkout supports one store per order', 'error'); return; }

  const name    = document.getElementById('custName').value.trim();
  const phone   = document.getElementById('custPhone').value.trim();
  const address = document.getElementById('custAddress').value.trim();
  const payment = document.getElementById('payMethod').value;
  const note    = document.getElementById('custNote').value.trim();

  if (!name || !phone || !address) { toast('Please fill all required fields', 'error'); return; }
  if (!/^\d{10}$/.test(phone))     { toast('Enter a valid 10-digit phone number', 'error'); return; }

  // Get store details from first cart item
  const restId   = cart[0]?.restId;
  const restObj  = restaurants.find(r => r.id === restId);

  try {
    await syncCurrentUserProfile({ name, phone, address }, { rerenderProfile: false });
  } catch (error) {
    handleSessionExpiry(error, { auth: true });
    if (error?.status === 401) {
      authIntent = { type: 'checkout' };
      closeModal();
      openAuthModal('login');
      toast('Sign in again to place your order.', 'info');
      return;
    }
  }

  try {
    const data = await apiRequest('/api/orders', {
      method: 'POST',
      auth: true,
      body: {
        restId,
        restName: restObj ? restObj.name : 'QuickBite Grocery',
        restImg: restObj ? restObj.img : '',
        etaMinutes: restObj ? restObj.deliveryTime : 30,
        customer: { name, phone, address, note },
        items: cart.map(item => ({ ...item })),
        couponCode: appliedCouponCode,
        payment,
      },
    });

    if (data.user) {
      setCurrentUser(data.user);
      updateAuthUI();
    }

    const order = data.order;
    ordersCache = [order, ...ordersCache.filter(item => item.orderId !== order.orderId)];
    userOrderCount = ordersCache.length;
    const placedCart = cart.map(item => ({ ...item }));

    placedCart.forEach(item => {
      const storeEntry = restaurants.find(entry => entry.id === item.restId);
      const product = storeEntry?.menu?.find(entry => entry.id === item.id);
      if (product) {
        product.stock = Math.max(0, Number(product.stock || 0) - Number(item.qty || 0));
      }
    });

    cart = [];
    clearAppliedCoupon();
    saveCart();
    updateCartCount();
    closeModal();

    ['custName','custPhone','custAddress','custNote'].forEach(id => {
      const field = document.getElementById(id);
      if (field) field.value = '';
    });

    await showOrderPlacedSuccess(order.orderId);
    toast(`Order placed! ID: ${order.orderId}`, 'success');
    trackingOrderId = order.orderId;
    successOrderId = order.orderId;
    sessionStorage.setItem('qb_success_order', successOrderId);
    showPage('tracking');
  } catch (error) {
    handleSessionExpiry(error, { auth: true });
    if (error?.status === 401) {
      authIntent = { type: 'checkout' };
      closeModal();
      openAuthModal('login');
      toast('Sign in again to place your order.', 'info');
      return;
    }

    if (error?.status === 409) {
      loadRestaurantsForLocation(activeLocation, { toastOnFail: false });
    }
    toast(error.message, 'error');
  }
}

// ─────────────────────────────────────────────
//  ORDERS PAGE
// ─────────────────────────────────────────────
async function renderOrders(options = {}) {
  const { silent = false } = options;
  const div = document.getElementById('ordersList');
  if (!div) return;

  if (!silent) {
    div.innerHTML = `
      <div class="empty-state">
        <h3>Loading your orders...</h3>
        <p>Pulling the latest order updates from the backend.</p>
      </div>`;
  }

  try {
    const orders = await fetchCurrentUserOrders();

    if (!orders.length) {
      div.innerHTML = `
        <div class="empty-state">
          <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80&auto=format" alt="no orders"/>
          <h3>No orders yet</h3>
          <p>Your personal order history will show up here after your first checkout.</p>
          <button class="btn-primary" onclick="showPage('home')">Shop Now</button>
        </div>`;
      return;
    }

    div.innerHTML = orders.map(o => `
      <div class="order-card">
        <div class="order-card-header">
          <div class="order-rest-info">
            <img src="${o.restImg}" alt="${o.restName}" class="order-rest-img"/>
            <div>
              <div class="order-rest-name">${o.restName}</div>
              <div class="order-date">${getOrderPlacedLabel(o)} · #${o.orderId}</div>
            </div>
          </div>
          <span class="status-pill s-${o.status}">${o.status}</span>
        </div>
        <div class="order-card-body">
          ${renderOrderProgress(o.status)}
          <div class="order-items-text">${o.items.map(i=>`${i.name} ×${i.qty}`).join(' • ')}</div>
          <div class="order-meta-row">
            <span>${getOrderAgeLabel(o)}</span>
            <span>${getEtaLabel(o)}</span>
          </div>
          <div class="order-meta-row">
            <span>Payment: ${o.payment}</span>
          </div>
          <div class="order-meta-row">
            <span>Deliver to: ${o.customer.address}</span>
          </div>
          ${o.couponCode ? `<div class="order-coupon">Coupon ${o.couponCode} saved ₹${o.discount || 0}</div>` : ''}
        </div>
        <div class="order-card-footer">
          <div class="order-total-amt">₹${o.total}</div>
          <div class="order-actions">
            <button class="track-order-btn" onclick="trackOrder('${o.orderId}')">Track Order</button>
            <button class="reorder-btn" onclick="reorderItems('${o.orderId}')">Reorder</button>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    handleSessionExpiry(error, { auth: true });
    if (error?.status === 401) {
      showPage('home', { remember: false });
      toast('Sign in again to view your orders.', 'info');
      return;
    }

    div.innerHTML = `
      <div class="empty-state">
        <h3>Orders are unavailable</h3>
        <p>${error.message}</p>
        <button class="btn-primary" onclick="renderOrders()">Try Again</button>
      </div>`;
  }
}

// ─────────────────────────────────────────────
//  ADMIN PANEL
// ─────────────────────────────────────────────
async function renderAdmin() {
  updateAdminActions();
  const div = document.getElementById('adminContent');
  if (!div) return;

  if (!adminAuthenticated) {
    div.innerHTML = `
      <div class="empty-state">
        <h3>Admin access is locked</h3>
        <p>Enter the admin password to manage orders, products and inventory.</p>
        <button class="btn-primary" onclick="requestAdminAccess()">Unlock Admin</button>
      </div>
    `;
    return;
  }

  div.innerHTML = `
    <div class="empty-state">
      <h3>Loading admin dashboard...</h3>
      <p>Fetching orders and inventory from the backend.</p>
    </div>`;

  try {
    const [orders, catalog] = await Promise.all([
      fetchAdminOrders(),
      fetchAdminCatalog(),
    ]);

    const access = normalizeAdminAccess(catalog.access || adminAccess);
    setAdminAccess(access);
    const isStoreAdmin = access.role === 'store';
    const stores = catalog.stores || [];
    const scopedSummary = catalog.summary || {
      totalStores: 0,
      totalProducts: 0,
      lowStockProducts: 0,
      outOfStockProducts: 0,
      inventoryValue: 0,
    };
    const globalSummary = catalog.globalSummary || scopedSummary;
    const products = stores.flatMap(storeEntry =>
      (storeEntry.menu || []).map(product => ({
        ...product,
        storeId: storeEntry.id,
        storeName: storeEntry.name,
      }))
    );
    const lowStockProducts = products
      .filter(product => Number(product.stock || 0) <= Number(product.reorderLevel || 8))
      .sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0));
    const inventoryPreview = [...products]
      .sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0))
      .slice(0, 24);

    const pending   = orders.filter(o=>o.status==='Pending').length;
    const confirmed = orders.filter(o=>o.status==='Confirmed').length;
    const delivered = orders.filter(o=>o.status==='Delivered').length;
    const revenue   = orders.reduce((s,o)=>s+o.total,0);
    const storeInsights = stores.map(storeEntry => {
      const storeProducts = storeEntry.menu || [];
      const lowStockCount = storeProducts.filter(product => Number(product.stock || 0) <= Number(product.reorderLevel || 8)).length;
      const outOfStockCount = storeProducts.filter(product => Number(product.stock || 0) <= 0).length;
      const inventoryValue = storeProducts.reduce((sum, product) => {
        return sum + (Number(product.stock || 0) * Number(product.price || 0));
      }, 0);

      return {
        id: storeEntry.id,
        name: storeEntry.name,
        productCount: storeProducts.length,
        lowStockCount,
        outOfStockCount,
        inventoryValue,
      };
    });
    if (!stores.some(storeEntry => storeEntry.id === Number(adminSelectedStoreId))) {
      adminSelectedStoreId = stores[0]?.id || 0;
    }
    const validTabs = isStoreAdmin
      ? ['overview', 'add-grocery', 'orders']
      : ['overview', 'add-grocery', 'add-store', 'orders'];
    if (!validTabs.includes(adminPanelTab)) {
      adminPanelTab = 'overview';
    }
    const selectedStoreInsight = storeInsights.find(storeEntry => storeEntry.id === Number(adminSelectedStoreId)) || null;
    const statsSummary = isStoreAdmin ? scopedSummary : globalSummary;
    const categoryOptions = ADMIN_PRODUCT_CATEGORIES
      .map(category => `<option value="${category}">${category.replace(/^\w/, char => char.toUpperCase())}</option>`)
      .join('');
    const storeCategoryOptions = ADMIN_PRODUCT_CATEGORIES
      .map(category => `<option value="${category}"${category === 'essentials' ? ' selected' : ''}>${category.replace(/^\w/, char => char.toUpperCase())}</option>`)
      .join('');
    const createdStoreBanner = !isStoreAdmin && adminCreatedStoreMeta
      ? `
      <div class="admin-role-banner super">
        <strong>Store Added: ${adminCreatedStoreMeta.name}</strong>
        <span>Store ID ${adminCreatedStoreMeta.id} is ready. Manager password: ${adminCreatedStoreMeta.managerPassword}</span>
      </div>`
      : '';
    const storeTabButtons = storeInsights.map(storeEntry => `
      <button
        type="button"
        class="admin-store-tab ${storeEntry.id === Number(adminSelectedStoreId) ? 'active' : ''}"
        data-admin-store-tab="${storeEntry.id}"
        onclick="setAdminStoreTab(${storeEntry.id})"
      >
        <span class="admin-store-tab-name">${storeEntry.name}</span>
        <span class="admin-store-tab-meta">${storeEntry.productCount} products · ${storeEntry.lowStockCount} low stock</span>
      </button>
    `).join('');
    const storeInsightPanels = storeInsights.map(storeEntry => `
      <div class="admin-store-panel ${storeEntry.id === Number(adminSelectedStoreId) ? 'active' : ''}" data-admin-store-panel="${storeEntry.id}">
        <div class="admin-store-metrics">
          <article class="admin-store-metric">
            <strong>${storeEntry.productCount}</strong>
            <span>Products</span>
          </article>
          <article class="admin-store-metric">
            <strong>${storeEntry.lowStockCount}</strong>
            <span>Low Stock</span>
          </article>
          <article class="admin-store-metric">
            <strong>${storeEntry.outOfStockCount}</strong>
            <span>Out of Stock</span>
          </article>
          <article class="admin-store-metric">
            <strong>₹${Math.round(storeEntry.inventoryValue)}</strong>
            <span>Inventory Value</span>
          </article>
        </div>
      </div>
    `).join('');

    div.innerHTML = `
      <div class="stats-grid">
        <div class="stat-box">
          <div class="stat-box-num" style="font-size:1.2rem">${isStoreAdmin ? 'Store Manager' : 'Super Admin'}</div>
          <div class="stat-box-label">${isStoreAdmin ? (access.storeName || 'Assigned Store') : 'Central Control Center'}</div>
        </div>
        <div class="stat-box"><div class="stat-box-num">${orders.length}</div><div class="stat-box-label">Total Orders</div></div>
        <div class="stat-box"><div class="stat-box-num" style="color:#b85c00">${pending}</div><div class="stat-box-label">Pending</div></div>
        <div class="stat-box"><div class="stat-box-num" style="color:var(--green)">${confirmed}</div><div class="stat-box-label">Confirmed</div></div>
        <div class="stat-box"><div class="stat-box-num" style="color:#1a5fa8">${delivered}</div><div class="stat-box-label">Delivered</div></div>
        <div class="stat-box"><div class="stat-box-num">₹${revenue}</div><div class="stat-box-label">Revenue</div></div>
        <div class="stat-box"><div class="stat-box-num">${statsSummary.totalProducts}</div><div class="stat-box-label">Products</div></div>
        <div class="stat-box"><div class="stat-box-num" style="color:#b85c00">${statsSummary.lowStockProducts}</div><div class="stat-box-label">Low Stock</div></div>
        <div class="stat-box"><div class="stat-box-num" style="color:#b23b3b">${statsSummary.outOfStockProducts}</div><div class="stat-box-label">Out of Stock</div></div>
        <div class="stat-box"><div class="stat-box-num">₹${statsSummary.inventoryValue}</div><div class="stat-box-label">Inventory Value</div></div>
      </div>

      <div class="admin-role-banner ${isStoreAdmin ? 'store' : 'super'}">
        <strong>${isStoreAdmin ? `Store-only access: ${access.storeName || 'Assigned store'}` : 'Super admin center: all stores visible'}</strong>
        <span>${isStoreAdmin
          ? 'You can manage inventory and orders only for your store.'
          : 'Store managers can log in using Store<StoreId>@QB (for example: Store401@QB).'}
        </span>
      </div>
      ${createdStoreBanner}

      <div class="admin-tabs" role="tablist" aria-label="Admin Sections">
        <button type="button" class="admin-tab-btn" data-admin-tab="overview" onclick="setAdminPanelTab('overview')">
          Inventory Overview
        </button>
        <button type="button" class="admin-tab-btn" data-admin-tab="add-grocery" onclick="setAdminPanelTab('add-grocery')">
          Add Grocery By Shop
        </button>
        ${isStoreAdmin ? '' : `
        <button type="button" class="admin-tab-btn" data-admin-tab="add-store" onclick="setAdminPanelTab('add-store')">
          Add New Store
        </button>`}
        <button type="button" class="admin-tab-btn" data-admin-tab="orders" onclick="setAdminPanelTab('orders')">
          Order Operations
        </button>
      </div>

      <section class="admin-tab-panel" data-admin-panel="overview">
        <div class="page-heading"><h2>Low Stock Alerts</h2></div>
        ${!lowStockProducts.length
          ? `<div class="empty-state"><h3>Inventory is healthy</h3><p>No low-stock products right now.</p></div>`
          : `<div class="admin-orders-grid">
              ${lowStockProducts.slice(0, 10).map(product => `
                <div class="admin-order-card">
                  <div class="aoc-id">${product.storeName}</div>
                  <div class="aoc-customer">${product.name}</div>
                  <div class="aoc-detail">Stock: <strong>${product.stock}</strong> · Reorder: ${product.reorderLevel}</div>
                  <div class="aoc-detail">Price: ₹${product.price}</div>
                  <div class="aoc-footer">
                    <span class="status-pill ${product.stock <= 0 ? 's-Cancelled' : 's-Pending'}">${product.stock <= 0 ? 'Out of stock' : 'Low stock'}</span>
                    <div class="aoc-actions">
                      <button class="aoc-btn confirm" onclick="adminAdjustStock(${product.id}, 10)">+10</button>
                      <button class="aoc-btn deliver" onclick="adminAdjustStock(${product.id}, 25)">+25</button>
                      <button class="aoc-btn cancel" onclick="adminAdjustStock(${product.id}, -1)">-1</button>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>`
        }

        <div class="page-heading" style="margin-top:24px"><h2>Inventory (Fast Actions)</h2></div>
        ${!inventoryPreview.length
          ? `<div class="empty-state"><h3>No products found</h3><p>Add products to start grocery operations.</p></div>`
          : `<div class="admin-orders-grid">
              ${inventoryPreview.map(product => `
                <div class="admin-order-card">
                  <div class="aoc-id">${product.storeName}</div>
                  <div class="aoc-customer">${product.name}</div>
                  <div class="aoc-detail">₹${product.price} · ${product.unit || 'unit'} · SKU ${product.sku || 'N/A'}</div>
                  <div class="aoc-detail">Stock ${product.stock} / Reorder ${product.reorderLevel}</div>
                  <div class="aoc-footer">
                    <span class="status-pill ${product.stock <= product.reorderLevel ? 's-Pending' : 's-Delivered'}">${product.stock <= product.reorderLevel ? 'Attention' : 'Healthy'}</span>
                    <div class="aoc-actions">
                      <button class="aoc-btn confirm" onclick="adminAdjustStock(${product.id}, 5)">+5</button>
                      <button class="aoc-btn deliver" onclick="adminAdjustStock(${product.id}, 20)">+20</button>
                      <button class="aoc-btn cancel" onclick="adminAdjustStock(${product.id}, -1)">-1</button>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>`
        }
      </section>

      <section class="admin-tab-panel" data-admin-panel="add-grocery">
        ${!stores.length
          ? `<div class="empty-state"><h3>No shops available</h3><p>Add catalog stores first, then you can create groceries for each shop.</p></div>`
          : `
            <div class="admin-add-shell">
              <div class="admin-add-header">
                <div>
                  <p class="admin-tab-kicker">Store-specific product creation</p>
                  <h3>Add Grocery To Different Shops</h3>
                  <p>Pick a shop tab, fill in product details, and publish directly into that store inventory.</p>
                </div>
                <div class="admin-add-spotlight">Selected Shop: <strong id="adminActiveStoreName">${selectedStoreInsight?.name || 'Store'}</strong></div>
              </div>

              <div class="admin-store-tabs" role="tablist" aria-label="Select a grocery shop">
                ${storeTabButtons}
              </div>
              ${storeInsightPanels}

              <div class="admin-add-card">
                <div class="admin-add-card-head">
                  <h4>New Grocery Product</h4>
                  <p>${isStoreAdmin ? 'Create products for your assigned store only.' : 'Create for the selected store, or broadcast to all stores.'}</p>
                </div>
                <div class="admin-add-card-body">
                  <input id="adminProductStore" type="hidden" value="${selectedStoreInsight?.id || ''}"/>
                  ${!isStoreAdmin && stores.length > 1
                    ? `<div class="admin-check-row">
                        <label class="admin-check-pill admin-check-promo">
                          <input id="adminProductAllStores" type="checkbox"/>
                          <span>Add this product to all stores</span>
                        </label>
                      </div>`
                    : ''
                  }
                  <div class="form-row">
                    <div class="form-group">
                      <label>Category *</label>
                      <select id="adminProductCategory">${categoryOptions}</select>
                    </div>
                    <div class="form-group">
                      <label>Name *</label>
                      <input id="adminProductName" type="text" placeholder="Whole Wheat Pasta (500 g)"/>
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label>Price (₹) *</label>
                      <input id="adminProductPrice" type="number" min="1" placeholder="149"/>
                    </div>
                    <div class="form-group">
                      <label>Unit</label>
                      <input id="adminProductUnit" type="text" placeholder="pack / kg / ltr"/>
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label>Opening Stock</label>
                      <input id="adminProductStock" type="number" min="0" placeholder="30"/>
                    </div>
                    <div class="form-group">
                      <label>Reorder Level</label>
                      <input id="adminProductReorder" type="number" min="1" placeholder="8"/>
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label>SKU</label>
                      <input id="adminProductSku" type="text" placeholder="Optional custom SKU"/>
                    </div>
                    <div class="form-group">
                      <label>Image URL</label>
                      <input id="adminProductImage" type="url" placeholder="https://images.unsplash.com/..."/>
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Description</label>
                    <input id="adminProductDesc" type="text" placeholder="Shelf-stable, premium grocery product"/>
                  </div>
                  <div class="admin-check-row">
                    <label class="admin-check-pill">
                      <input id="adminProductVeg" type="checkbox" checked/>
                      <span>Veg Product</span>
                    </label>
                    <label class="admin-check-pill">
                      <input id="adminProductBestseller" type="checkbox"/>
                      <span>Mark as Bestseller</span>
                    </label>
                  </div>
                  <button class="btn-primary admin-add-submit" type="button" onclick="adminCreateProductFromForm()">Add Product</button>
                </div>
              </div>
            </div>
          `}
      </section>

      <section class="admin-tab-panel" data-admin-panel="add-store">
        ${isStoreAdmin
          ? `<div class="empty-state"><h3>Super admin only</h3><p>Store managers cannot create new stores.</p></div>`
          : `
            <div class="admin-add-shell">
              <div class="admin-add-header">
                <div>
                  <p class="admin-tab-kicker">Network Expansion</p>
                  <h3>Add A New Grocery Store</h3>
                  <p>Create a store, auto-generate manager access, then start adding products.</p>
                </div>
                <div class="admin-add-spotlight">Store Manager Login: <strong>Store&lt;StoreId&gt;@QB</strong></div>
              </div>

              <div class="admin-add-card">
                <div class="admin-add-card-head">
                  <h4>Store Profile</h4>
                  <p>Fill the essentials below. Remaining fields are optional.</p>
                </div>
                <div class="admin-add-card-body">
                  <div class="form-row">
                    <div class="form-group">
                      <label>Store Name *</label>
                      <input id="adminStoreName" type="text" placeholder="GreenMart Sector 45"/>
                    </div>
                    <div class="form-group">
                      <label>Address</label>
                      <input id="adminStoreAddress" type="text" placeholder="Sector 45, Chandigarh"/>
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label>Category</label>
                      <select id="adminStoreCategory">${storeCategoryOptions}</select>
                    </div>
                    <div class="form-group">
                      <label>Cuisine / Focus</label>
                      <input id="adminStoreCuisine" type="text" placeholder="Daily Grocery Essentials"/>
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label>Delivery Time (min)</label>
                      <input id="adminStoreDeliveryTime" type="number" min="10" max="90" placeholder="30"/>
                    </div>
                    <div class="form-group">
                      <label>Store Rating (0-5)</label>
                      <input id="adminStoreRating" type="number" min="0" max="5" step="0.1" placeholder="4.5"/>
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label>Minimum Order (Rs)</label>
                      <input id="adminStoreMinOrder" type="number" min="0" placeholder="199"/>
                    </div>
                    <div class="form-group">
                      <label>Average Basket (Rs)</label>
                      <input id="adminStoreAvgCost" type="number" min="0" placeholder="500"/>
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label>Promo Line</label>
                      <input id="adminStorePromo" type="text" placeholder="Fresh grocery picks available daily"/>
                    </div>
                    <div class="form-group">
                      <label>Image URL</label>
                      <input id="adminStoreImage" type="url" placeholder="https://images.unsplash.com/..."/>
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label>Tags (comma separated)</label>
                      <input id="adminStoreTags" type="text" placeholder="New Store, Express Delivery"/>
                    </div>
                    <div class="form-group">
                      <label>Manager Password (optional)</label>
                      <input id="adminStoreManagerPassword" type="text" placeholder="Auto: Store&lt;StoreId&gt;@QB"/>
                    </div>
                  </div>
                  <button class="btn-primary admin-add-submit" type="button" onclick="adminCreateStoreFromForm()">Create Store</button>
                </div>
              </div>
            </div>
          `}
      </section>

      <section class="admin-tab-panel" data-admin-panel="orders">
        <div class="page-heading"><h2>Order Operations</h2></div>
        ${!orders.length
          ? `<div class="empty-state"><h3>No orders yet</h3><p>Incoming orders will appear here.</p></div>`
          : `<div class="admin-orders-grid">
              ${orders.map(o => `
                <div class="admin-order-card">
                  <div class="aoc-id">#${o.orderId} · ${formatOrderDateTime(o)}</div>
                  <div class="aoc-customer">${o.customer.name}</div>
                  <div class="aoc-detail">📞 ${o.customer.phone}</div>
                  <div class="aoc-detail">📍 ${o.customer.address}</div>
                  <div class="aoc-items">${o.items.map(i=>`${i.name} ×${i.qty}`).join(', ')}</div>
                  <div class="aoc-footer">
                    <div>
                      <span class="status-pill s-${o.status}">${o.status}</span>
                      <span class="aoc-total" style="margin-left:10px">₹${o.total}</span>
                    </div>
                    <div class="aoc-actions">
                      <button class="aoc-btn confirm"  onclick="updateStatus('${o.orderId}','Confirmed')">Confirm</button>
                      <button class="aoc-btn deliver"  onclick="updateStatus('${o.orderId}','Delivered')">Delivered</button>
                      <button class="aoc-btn cancel"   onclick="updateStatus('${o.orderId}','Cancelled')">Cancel</button>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>`
        }
      </section>
    `;
    setAdminPanelTab(adminPanelTab, { silent: true });
    if (adminSelectedStoreId) setAdminStoreTab(adminSelectedStoreId, { silent: true });
  } catch (error) {
    handleSessionExpiry(error, { admin: true });
    if (error?.status === 401) {
      div.innerHTML = `
        <div class="empty-state">
          <h3>Admin access is locked</h3>
          <p>Your admin session expired. Unlock the dashboard again to continue.</p>
          <button class="btn-primary" onclick="requestAdminAccess()">Unlock Admin</button>
        </div>
      `;
      toast('Admin session expired. Unlock the dashboard again.', 'info');
      return;
    }

    div.innerHTML = `
      <div class="empty-state">
        <h3>Dashboard is unavailable</h3>
        <p>${error.message}</p>
        <button class="btn-primary" onclick="renderAdmin()">Try Again</button>
      </div>`;
  }
}

function setAdminPanelTab(tab, options = {}) {
  const validTabs = new Set(['overview', 'add-grocery', 'add-store', 'orders']);
  const nextTab = String(tab || '').trim();
  if (!validTabs.has(nextTab)) return;

  adminPanelTab = nextTab;

  const buttons = document.querySelectorAll('#adminContent [data-admin-tab]');
  const panels = document.querySelectorAll('#adminContent [data-admin-panel]');

  buttons.forEach(button => {
    const active = button.dataset.adminTab === adminPanelTab;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', active ? 'true' : 'false');
  });

  panels.forEach(panel => {
    panel.classList.toggle('active', panel.dataset.adminPanel === adminPanelTab);
  });

  if (!options.silent) {
    const activePanel = document.querySelector(`#adminContent [data-admin-panel="${adminPanelTab}"]`);
    if (activePanel) {
      activePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

function setAdminStoreTab(storeId, options = {}) {
  const nextStoreId = Number(storeId) || 0;
  if (!nextStoreId) return;

  const storeButtons = [...document.querySelectorAll('#adminContent [data-admin-store-tab]')];
  const selectedButton = storeButtons.find(button => Number(button.dataset.adminStoreTab) === nextStoreId);
  if (!selectedButton) return;

  adminSelectedStoreId = nextStoreId;

  storeButtons.forEach(button => {
    button.classList.toggle('active', Number(button.dataset.adminStoreTab) === adminSelectedStoreId);
  });

  document.querySelectorAll('#adminContent [data-admin-store-panel]').forEach(panel => {
    panel.classList.toggle('active', Number(panel.dataset.adminStorePanel) === adminSelectedStoreId);
  });

  const storeField = document.getElementById('adminProductStore');
  if (storeField) storeField.value = String(adminSelectedStoreId);

  const activeStoreName = document.getElementById('adminActiveStoreName');
  const selectedStoreName = selectedButton.querySelector('.admin-store-tab-name')?.textContent?.trim();
  if (activeStoreName && selectedStoreName) activeStoreName.textContent = selectedStoreName;

  if (!options.silent) {
    const addFormTop = document.querySelector('.admin-add-card');
    if (addFormTop) {
      addFormTop.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
}

async function adminAdjustStock(productId, delta) {
  try {
    await updateAdminProductStock(productId, delta);
    await loadRestaurantsForLocation(activeLocation, { toastOnFail: false });
    await renderAdmin();
    toast(`Inventory updated`, 'success');
  } catch (error) {
    handleSessionExpiry(error, { admin: true });
    if (error?.status === 401) {
      renderAdmin();
      return;
    }
    toast(error.message, 'error');
  }
}

async function adminCreateProductFromForm() {
  const storeField = document.getElementById('adminProductStore');
  const categoryField = document.getElementById('adminProductCategory');
  const nameField = document.getElementById('adminProductName');
  const priceField = document.getElementById('adminProductPrice');
  const unitField = document.getElementById('adminProductUnit');
  const stockField = document.getElementById('adminProductStock');
  const reorderField = document.getElementById('adminProductReorder');
  const skuField = document.getElementById('adminProductSku');
  const imageField = document.getElementById('adminProductImage');
  const descField = document.getElementById('adminProductDesc');
  const vegField = document.getElementById('adminProductVeg');
  const bestsellerField = document.getElementById('adminProductBestseller');
  const allStoresField = document.getElementById('adminProductAllStores');

  if (!storeField || !categoryField || !nameField || !priceField || !stockField || !reorderField || !descField) {
    return;
  }

  const access = normalizeAdminAccess(adminAccess);
  const applyToAll = Boolean(allStoresField?.checked) && access.role !== 'store';
  const payload = {
    storeId: Number(storeField.value),
    applyToAll,
    category: categoryField.value,
    name: nameField.value.trim(),
    price: Number(priceField.value),
    unit: unitField?.value.trim() || '',
    stock: Number(stockField.value),
    reorderLevel: Number(reorderField.value),
    sku: skuField?.value.trim() || '',
    img: imageField?.value.trim() || '',
    desc: descField.value.trim(),
    veg: vegField ? vegField.checked : true,
    bestseller: bestsellerField ? bestsellerField.checked : false,
  };

  const requiresStore = !payload.applyToAll;
  if (!payload.name || !Number.isFinite(payload.price) || payload.price <= 0 || (requiresStore && !payload.storeId)) {
    toast('Store, name and valid price are required', 'error');
    return;
  }

  try {
    await createAdminProduct(payload);
    [nameField, priceField, unitField, stockField, reorderField, skuField, imageField, descField]
      .filter(Boolean)
      .forEach(field => {
        field.value = '';
      });
    if (vegField) vegField.checked = true;
    if (bestsellerField) bestsellerField.checked = false;
    if (allStoresField) allStoresField.checked = false;

    await loadRestaurantsForLocation(activeLocation, { toastOnFail: false });
    adminPanelTab = 'add-grocery';
    await renderAdmin();
    toast(payload.applyToAll ? 'Product added to all stores' : 'Product added successfully', 'success');
  } catch (error) {
    handleSessionExpiry(error, { admin: true });
    if (error?.status === 401) {
      renderAdmin();
      return;
    }
    toast(error.message, 'error');
  }
}

async function adminCreateStoreFromForm() {
  const access = normalizeAdminAccess(adminAccess);
  if (access.role === 'store') {
    toast('Only super admin can create new stores', 'error');
    return;
  }

  const nameField = document.getElementById('adminStoreName');
  const addressField = document.getElementById('adminStoreAddress');
  const categoryField = document.getElementById('adminStoreCategory');
  const cuisineField = document.getElementById('adminStoreCuisine');
  const deliveryField = document.getElementById('adminStoreDeliveryTime');
  const ratingField = document.getElementById('adminStoreRating');
  const minOrderField = document.getElementById('adminStoreMinOrder');
  const avgCostField = document.getElementById('adminStoreAvgCost');
  const promoField = document.getElementById('adminStorePromo');
  const tagsField = document.getElementById('adminStoreTags');
  const imageField = document.getElementById('adminStoreImage');
  const managerPasswordField = document.getElementById('adminStoreManagerPassword');

  if (!nameField || !categoryField) return;

  const name = nameField.value.trim();
  if (!name) {
    toast('Store name is required', 'error');
    nameField.focus();
    return;
  }

  const numericValue = (field, { min = null, max = null, integer = false } = {}) => {
    if (!field) return undefined;
    const raw = String(field.value || '').trim();
    if (!raw) return undefined;
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return NaN;
    let value = integer ? Math.round(parsed) : parsed;
    if (min !== null) value = Math.max(min, value);
    if (max !== null) value = Math.min(max, value);
    return value;
  };

  const rating = numericValue(ratingField, { min: 0, max: 5 });
  const deliveryTime = numericValue(deliveryField, { min: 10, max: 90, integer: true });
  const minOrder = numericValue(minOrderField, { min: 0, integer: true });
  const avgCost = numericValue(avgCostField, { min: 0, integer: true });
  if ([rating, deliveryTime, minOrder, avgCost].some(value => Number.isNaN(value))) {
    toast('Please enter valid numeric values for store settings', 'error');
    return;
  }

  const tags = (tagsField?.value || '')
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean);

  const payload = {
    name,
    address: addressField?.value.trim() || '',
    category: categoryField.value || 'essentials',
    cuisine: cuisineField?.value.trim() || '',
    promo: promoField?.value.trim() || '',
    img: imageField?.value.trim() || '',
    managerPassword: managerPasswordField?.value.trim() || '',
  };
  if (tags.length) payload.tags = tags;
  if (rating !== undefined) payload.rating = rating;
  if (deliveryTime !== undefined) payload.deliveryTime = deliveryTime;
  if (minOrder !== undefined) payload.minOrder = minOrder;
  if (avgCost !== undefined) payload.avgCost = avgCost;

  try {
    const data = await createAdminStore(payload);
    const createdStore = data?.store || {};
    adminSelectedStoreId = Number(createdStore.id) || adminSelectedStoreId;
    adminCreatedStoreMeta = {
      id: Number(createdStore.id) || 0,
      name: createdStore.name || name,
      managerPassword: data?.managerPassword || `Store${Number(createdStore.id) || 0}@QB`,
    };

    [nameField, addressField, cuisineField, deliveryField, ratingField, minOrderField, avgCostField, promoField, tagsField, imageField, managerPasswordField]
      .filter(Boolean)
      .forEach(field => {
        field.value = '';
      });
    categoryField.value = 'essentials';

    await loadRestaurantsForLocation(activeLocation, { toastOnFail: false });
    adminPanelTab = 'add-store';
    await renderAdmin();
    toast(`Store created successfully. Manager password: ${adminCreatedStoreMeta.managerPassword}`, 'success');
  } catch (error) {
    handleSessionExpiry(error, { admin: true });
    if (error?.status === 401) {
      renderAdmin();
      return;
    }
    toast(error.message, 'error');
  }
}

async function updateStatus(orderId, status) {
  try {
    const data = await apiRequest(`/api/admin/orders/${encodeURIComponent(orderId)}/status`, {
      method: 'PATCH',
      admin: true,
      body: { status },
    });

    const updatedOrder = data?.order || null;
    if (updatedOrder?.orderId) {
      adminOrdersCache = adminOrdersCache.map(order => order.orderId === updatedOrder.orderId ? { ...order, ...updatedOrder } : order);
      ordersCache = ordersCache.map(order => order.orderId === updatedOrder.orderId ? { ...order, ...updatedOrder } : order);
    }

    try {
      await loadRestaurantsForLocation(activeLocation, { toastOnFail: false });
    } catch {
      // Ignore catalog refresh issues; order status UI should still refresh.
    }

    await renderAdmin();
    if (currentPage === 'orders') await renderOrders({ silent: true });
    if (currentPage === 'tracking' && trackingOrderId === orderId) await renderTrackingPage(orderId);

    toast(`Order ${orderId} → ${status}`, 'success');
  } catch (error) {
    handleSessionExpiry(error, { admin: true });
    if (error?.status === 401) {
      renderAdmin();
      return;
    }

    toast(error.message, 'error');
  }
}

async function reorderItems(orderId) {
  let order;

  try {
    order = (await fetchCurrentUserOrders()).find(item => item.orderId === orderId);
  } catch (error) {
    handleSessionExpiry(error, { auth: true });
    if (error?.status === 401) {
      showPage('home', { remember: false });
      toast('Sign in again to reorder your items.', 'info');
      return;
    }

    toast(error.message, 'error');
    return;
  }

  if (!order) {
    toast('Order not found', 'error');
    return;
  }

  const cartRestaurant = getCartRestaurant();
  if (cart.length && cartRestaurant && cartRestaurant.id !== order.restId) {
    const replaceCart = window.confirm(
      `Your cart has items from ${cartRestaurant.name}. Replace them with the reorder from ${order.restName}?`
    );
    if (!replaceCart) return;
  }

  const unavailableItems = [];
  const limitedItems = [];
  const nextCart = [];

  order.items.forEach(item => {
    const restId = item.restId || order.restId;
    const storeEntry = restaurants.find(entry => entry.id === restId);
    const liveProduct = storeEntry?.menu?.find(entry => entry.id === item.id);
    const liveStock = Number(liveProduct?.stock || 0);

    if (!liveProduct || liveStock <= 0) {
      unavailableItems.push(item.name);
      return;
    }

    const qty = Math.min(item.qty, liveStock);
    if (qty < item.qty) limitedItems.push(`${item.name} (${qty}/${item.qty})`);

    nextCart.push({
      id: liveProduct.id,
      restId,
      name: liveProduct.name,
      price: liveProduct.price,
      img: liveProduct.img,
      qty,
      stock: liveStock,
      unit: liveProduct.unit || '',
    });
  });

  if (!nextCart.length) {
    toast('Reorder unavailable because all items are out of stock', 'error');
    return;
  }

  cart = nextCart;

  clearAppliedCoupon();
  saveCart();
  updateCartCount();
  showPage('cart');
  if (unavailableItems.length) {
    toast(`Skipped unavailable items: ${unavailableItems.slice(0, 2).join(', ')}`, 'info');
  } else if (limitedItems.length) {
    toast(`Adjusted quantity for: ${limitedItems.slice(0, 2).join(', ')}`, 'info');
  } else {
    toast(`Reordered items from ${order.restName}`, 'success');
  }
}

function requestAdminAccess() {
  if (adminAuthenticated) {
    showPage('admin');
    return;
  }
  openAdminModal();
}

function getAdminLoginStoreOptions() {
  const seen = new Set();
  const baseList = [
    ...(adminCatalogCache?.stores || []),
    ...restaurants,
    ...demoRestaurants,
  ];

  return baseList
    .map(entry => ({ id: Number(entry?.id) || 0, name: normalizeLocalText(entry?.name, 120) }))
    .filter(entry => entry.id && entry.name)
    .filter(entry => {
      if (seen.has(entry.id)) return false;
      seen.add(entry.id);
      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

function renderAdminAccessStoreOptions() {
  const select = document.getElementById('adminStoreSelect');
  if (!select) return;

  const options = getAdminLoginStoreOptions();
  const desiredStoreId = Number(adminAccess?.storeId || adminSelectedStoreId || options[0]?.id || 0);

  select.innerHTML = options
    .map(entry => `<option value="${entry.id}">${entry.name} (ID: ${entry.id})</option>`)
    .join('');
  if (desiredStoreId && options.some(entry => entry.id === desiredStoreId)) {
    select.value = String(desiredStoreId);
  }
}

function handleAdminAccessTypeChange() {
  const accessTypeField = document.getElementById('adminAccessType');
  const storePickerWrap = document.getElementById('adminStorePickerWrap');
  const passwordInput = document.getElementById('adminPasswordInput');
  const accessNote = document.getElementById('adminAccessNote');
  const accessType = accessTypeField?.value === 'store' ? 'store' : 'super';

  if (storePickerWrap) {
    storePickerWrap.style.display = accessType === 'store' ? 'block' : 'none';
  }
  if (passwordInput) {
    passwordInput.placeholder = accessType === 'store' ? 'Enter store password' : 'Enter super admin password';
  }
  if (accessNote) {
    accessNote.textContent = accessType === 'store'
      ? 'Store managers can access only their own orders and inventory. Default password format: Store<StoreId>@QB.'
      : 'Super admin can monitor and manage all store activity.';
  }
}

function openAdminModal() {
  const modal = document.getElementById('adminAuthModal');
  const input = document.getElementById('adminPasswordInput');
  const accessTypeField = document.getElementById('adminAccessType');
  if (!modal || !input) return;

  closeLocationDrop();
  input.value = '';
  if (accessTypeField) {
    accessTypeField.value = isStoreAdminAccess() ? 'store' : 'super';
  }
  renderAdminAccessStoreOptions();
  handleAdminAccessTypeChange();
  modal.classList.add('open');
  window.setTimeout(() => input.focus(), 30);
}

function closeAdminModal() {
  const modal = document.getElementById('adminAuthModal');
  const input = document.getElementById('adminPasswordInput');
  const accessTypeField = document.getElementById('adminAccessType');
  if (modal) modal.classList.remove('open');
  if (input) input.value = '';
  if (accessTypeField) accessTypeField.value = 'super';
}

function handleAdminPasswordKey(event) {
  if (event.key === 'Enter') verifyAdminPassword();
}

async function verifyAdminPassword() {
  const input = document.getElementById('adminPasswordInput');
  const accessTypeField = document.getElementById('adminAccessType');
  const storeField = document.getElementById('adminStoreSelect');
  if (!input) return;

  const accessType = accessTypeField?.value === 'store' ? 'store' : 'super';
  const storeId = Number(storeField?.value) || 0;

  if (!input.value.trim()) {
    toast(accessType === 'store' ? 'Enter the store password' : 'Enter the admin password', 'error');
    input.focus();
    return;
  }
  if (accessType === 'store' && !storeId) {
    toast('Choose a valid grocery store', 'error');
    return;
  }

  try {
    const data = await apiRequest('/api/admin/login', {
      method: 'POST',
      body: {
        accessType,
        storeId: accessType === 'store' ? storeId : undefined,
        password: input.value,
      },
    });

    setAdminSession(data.token, data.access || null);
    if (data.access?.storeId) adminSelectedStoreId = Number(data.access.storeId);
    updateAdminActions();
    closeAdminModal();
    toast(
      accessType === 'store'
        ? `Store access granted${data.access?.storeName ? `: ${data.access.storeName}` : ''}`
        : 'Super admin access granted',
      'success'
    );
    showPage('admin');
  } catch (error) {
    toast(error.message, 'error');
    input.select();
  }
}

async function logoutAdmin() {
  try {
    if (getAdminToken()) {
      await apiRequest('/api/admin/logout', {
        method: 'POST',
        admin: true,
      });
    }
  } catch (error) {
    handleSessionExpiry(error, { admin: true });
  }

  clearAdminSession();
  updateAdminActions();
  if (currentPage === 'admin') showPage('home', { remember: false });
  toast('Admin logged out', 'info');
}

// ─────────────────────────────────────────────
//  SEARCH
// ─────────────────────────────────────────────
function handleSearch(val) {
  searchQuery = val.trimStart();
  if (currentPage !== 'home') showPage('home', { scrollToTop: false });
  if (searchDebounceTimer) window.clearTimeout(searchDebounceTimer);
  searchDebounceTimer = window.setTimeout(() => {
    renderHomePage({ scrollToSection: Boolean(searchQuery.trim()) });
  }, 80);
}

// ─────────────────────────────────────────────
//  TOAST
// ─────────────────────────────────────────────
function toast(msg, type='success') {
  const wrap = document.getElementById('toastWrap');
  const el   = document.createElement('div');
  el.className = `toast-item ${type}`;
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(30px)';
    el.style.transition = 'all 0.3s';
    setTimeout(() => el.remove(), 300);
  }, 2800);
}

// ─────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────
window.onload = async function() {
  updateBackendModePill();

  if (window.location.protocol === 'file:') {
    toast('Run `npm start` and open http://127.0.0.1:3000 to use the real backend.', 'info');
  }

  await restoreUserSession();
  setRestaurants([], 'catalog');
  updateLocationLabel();
  renderLocationOptions();
  updateCartCount();
  updateAuthUI();
  updateAdminActions();
  if (adminAuthenticated) {
    try {
      await fetchAdminAccess();
    } catch (error) {
      handleSessionExpiry(error, { admin: true });
    }
    updateAdminActions();
  }
  renderHomePage();
  document.getElementById('homePage').classList.add('active');
  loadRestaurantsForLocation(activeLocation, { toastOnFail: false });

  document.addEventListener('click', event => {
    const locationWrap = document.querySelector('.nav-location-wrap');
    const checkoutModal = document.getElementById('checkoutModal');
    const adminModal = document.getElementById('adminAuthModal');
    const authModal = document.getElementById('authModal');

    if (locationWrap && !locationWrap.contains(event.target)) closeLocationDrop();
    if (event.target === checkoutModal) closeModal();
    if (event.target === adminModal) closeAdminModal();
    if (event.target === authModal) closeAuthModal();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeLocationDrop();
      closeModal();
      closeAdminModal();
      closeAuthModal();
    }
  });
};
