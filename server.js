const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs/promises');
const crypto = require('node:crypto');

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '127.0.0.1';
const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');
const APP_USER_AGENT = process.env.QB_APP_USER_AGENT || 'QuickBiteLiveDemo/1.0 (local project app)';
const ADMIN_PASSWORD = process.env.QB_ADMIN_PASSWORD || 'QuickBite@2026';
const NOMINATIM_SEARCH_URL = process.env.QB_NOMINATIM_SEARCH_URL || 'https://nominatim.openstreetmap.org/search';
const OVERPASS_API_URL = process.env.QB_OVERPASS_API_URL || 'https://overpass-api.de/api/interpreter';
const OVERPASS_FALLBACK_URLS = [
  OVERPASS_API_URL,
  'https://overpass.private.coffee/api/interpreter',
];
const USER_SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 12;
const LIVE_RESTAURANT_CACHE_TTL_MS = 1000 * 60 * 15;
const KV_STORE_KEY = 'quickbite:store:v1';
const IS_VERCEL_RUNTIME = Boolean(process.env.VERCEL);

let kvClient = null;
try {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    kvClient = require('@vercel/kv').kv;
  }
} catch (error) {
  console.warn('Vercel KV is not available; using file or volatile store fallback.');
}

let volatileStore = null;

const couponCatalog = {
  FIRST50: {
    code: 'FIRST50',
    type: 'flat',
    value: 50,
    minTotal: 249,
  },
  SAVE20: {
    code: 'SAVE20',
    type: 'percent',
    value: 20,
    maxDiscount: 120,
    minTotal: 299,
  },
  FREEDEL: {
    code: 'FREEDEL',
    type: 'delivery',
    minTotal: 199,
  },
};

const DEFAULT_GROCERY_STORES = [
  {
    id: 301,
    name: 'FreshBasket Market',
    cuisine: 'Fruits, Vegetables, Dairy',
    rating: 4.8,
    deliveryTime: 18,
    minOrder: 199,
    avgCost: 620,
    category: 'fruits',
    promo: 'Free delivery above ₹399',
    tags: ['Top Rated', 'Express'],
    img: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80&auto=format&fit=crop',
    address: 'Sector 22, Chandigarh',
    menu: [
      { id: 30101, name: 'Banana (6 pcs)', desc: 'Farm-fresh Cavendish bananas, naturally ripened.', price: 48, img: 'https://images.unsplash.com/photo-1574226516831-e1dff420e8f8?w=400&q=80&auto=format', veg: true, bestseller: true, stock: 120, reorderLevel: 20, category: 'fruits', unit: 'pack', sku: 'FBR-BAN-6' },
      { id: 30102, name: 'Apple Royal Gala (1 kg)', desc: 'Sweet and crispy apples, handpicked quality.', price: 169, img: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&q=80&auto=format', veg: true, bestseller: true, stock: 64, reorderLevel: 14, category: 'fruits', unit: 'kg', sku: 'FBR-APP-1K' },
      { id: 30103, name: 'Tomato (1 kg)', desc: 'Fresh red tomatoes for curries, salads and cooking.', price: 44, img: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 90, reorderLevel: 18, category: 'vegetables', unit: 'kg', sku: 'FBR-TOM-1K' },
      { id: 30104, name: 'Onion (1 kg)', desc: 'Everyday premium onions with longer shelf life.', price: 39, img: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 95, reorderLevel: 20, category: 'vegetables', unit: 'kg', sku: 'FBR-ONI-1K' },
      { id: 30105, name: 'A2 Cow Milk (1 L)', desc: 'Pasteurized full-cream milk from trusted dairy farms.', price: 72, img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80&auto=format', veg: true, bestseller: true, stock: 52, reorderLevel: 12, category: 'dairy', unit: 'ltr', sku: 'FBR-MLK-1L' },
      { id: 30106, name: 'Paneer Fresh (200 g)', desc: 'Soft cottage cheese block ideal for curries and snacks.', price: 95, img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 44, reorderLevel: 10, category: 'dairy', unit: 'pack', sku: 'FBR-PNR-200' },
      { id: 30107, name: 'Brown Bread (400 g)', desc: 'Whole wheat sliced bread baked every morning.', price: 48, img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 36, reorderLevel: 8, category: 'bakery', unit: 'pack', sku: 'FBR-BRD-400' },
      { id: 30108, name: 'Muesli Crunch (500 g)', desc: 'Oats, nuts and dried fruit breakfast cereal mix.', price: 229, img: 'https://images.unsplash.com/photo-1514996937319-344454492b37?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 27, reorderLevel: 8, category: 'snacks', unit: 'pack', sku: 'FBR-MSL-500' },
    ],
  },
  {
    id: 302,
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
      { id: 30201, name: 'Basmati Rice (5 kg)', desc: 'Long-grain aromatic basmati rice for daily meals.', price: 489, img: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&q=80&auto=format', veg: true, bestseller: true, stock: 30, reorderLevel: 6, category: 'essentials', unit: 'bag', sku: 'DNH-RIC-5K' },
      { id: 30202, name: 'Atta Chakki Fresh (10 kg)', desc: 'Stone-ground whole wheat flour for rotis and parathas.', price: 445, img: 'https://images.unsplash.com/photo-1586444248879-4f2df6f8f52a?w=400&q=80&auto=format', veg: true, bestseller: true, stock: 26, reorderLevel: 5, category: 'essentials', unit: 'bag', sku: 'DNH-ATT-10K' },
      { id: 30203, name: 'Toor Dal (1 kg)', desc: 'Unpolished premium toor dal, fast-cooking quality.', price: 154, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 47, reorderLevel: 10, category: 'essentials', unit: 'kg', sku: 'DNH-TDL-1K' },
      { id: 30204, name: 'Sunflower Oil (1 L)', desc: 'Refined sunflower oil suitable for everyday frying.', price: 162, img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 42, reorderLevel: 10, category: 'essentials', unit: 'ltr', sku: 'DNH-OIL-1L' },
      { id: 30205, name: 'Salted Chips (150 g)', desc: 'Classic crunchy potato chips family snack pack.', price: 45, img: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 80, reorderLevel: 20, category: 'snacks', unit: 'pack', sku: 'DNH-CHP-150' },
      { id: 30206, name: 'Orange Juice (1 L)', desc: 'Refreshing fruit drink with vitamin C boost.', price: 109, img: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 38, reorderLevel: 10, category: 'beverages', unit: 'ltr', sku: 'DNH-JCE-1L' },
      { id: 30207, name: 'Soft Drink Cola (2 L)', desc: 'Chilled party bottle for gatherings and weekends.', price: 99, img: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 50, reorderLevel: 12, category: 'beverages', unit: 'bottle', sku: 'DNH-COL-2L' },
      { id: 30208, name: 'Dishwash Gel (750 ml)', desc: 'Lemon fresh dishwashing gel tough on grease.', price: 139, img: 'https://images.unsplash.com/photo-1583947582886-f40ec95dd752?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 22, reorderLevel: 8, category: 'household', unit: 'bottle', sku: 'DNH-DWG-750' },
    ],
  },
  {
    id: 303,
    name: 'Organic Nest',
    cuisine: 'Organic Produce, Dairy, Wellness',
    rating: 4.7,
    deliveryTime: 26,
    minOrder: 299,
    avgCost: 910,
    category: 'organic',
    promo: 'Fresh organic picks daily',
    tags: ['Organic', 'Farm Direct'],
    img: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80&auto=format&fit=crop',
    address: 'Sector 9, Panchkula',
    menu: [
      { id: 30301, name: 'Organic Spinach (250 g)', desc: 'Pesticide-free spinach leaves, washed and packed.', price: 52, img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 34, reorderLevel: 10, category: 'vegetables', unit: 'pack', sku: 'ORG-SPN-250' },
      { id: 30302, name: 'Avocado Hass (2 pcs)', desc: 'Creamy ripe avocados sourced from certified farms.', price: 199, img: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&q=80&auto=format', veg: true, bestseller: true, stock: 24, reorderLevel: 8, category: 'fruits', unit: 'pack', sku: 'ORG-AVC-2P' },
      { id: 30303, name: 'Organic Eggs (12 pcs)', desc: 'Free-range eggs, protein-rich and naturally fed.', price: 148, img: 'https://images.unsplash.com/photo-1498654200943-1088dd4438ae?w=400&q=80&auto=format', veg: false, bestseller: true, stock: 32, reorderLevel: 8, category: 'dairy', unit: 'tray', sku: 'ORG-EGG-12' },
      { id: 30304, name: 'Greek Yogurt (400 g)', desc: 'Thick probiotic yogurt, no added preservatives.', price: 124, img: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 29, reorderLevel: 7, category: 'dairy', unit: 'tub', sku: 'ORG-YGT-400' },
      { id: 30305, name: 'Cold Pressed Peanut Oil (1 L)', desc: 'Wood-pressed peanut oil with natural aroma.', price: 329, img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 18, reorderLevel: 6, category: 'essentials', unit: 'ltr', sku: 'ORG-OIL-1L' },
      { id: 30306, name: 'Granola Honey Nuts (400 g)', desc: 'Baked granola with almonds, seeds and wild honey.', price: 285, img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 21, reorderLevel: 6, category: 'snacks', unit: 'pack', sku: 'ORG-GRL-400' },
      { id: 30307, name: 'Herbal Green Tea (25 bags)', desc: 'Antioxidant-rich blend for daily wellness.', price: 179, img: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 40, reorderLevel: 12, category: 'beverages', unit: 'box', sku: 'ORG-TEA-25' },
      { id: 30308, name: 'Bamboo Tissue Roll (4 pack)', desc: 'Eco-friendly soft tissue rolls from bamboo pulp.', price: 149, img: 'https://images.unsplash.com/photo-1583947582886-f40ec95dd752?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 28, reorderLevel: 8, category: 'household', unit: 'pack', sku: 'ORG-TIS-4P' },
    ],
  },
  {
    id: 304,
    name: 'CitySaver Grocery',
    cuisine: 'Budget Essentials, Home Care',
    rating: 4.5,
    deliveryTime: 20,
    minOrder: 149,
    avgCost: 540,
    category: 'household',
    promo: 'Everyday low prices',
    tags: ['Value Deals', 'Fast Delivery'],
    img: 'https://images.unsplash.com/photo-1604719312566-8912e9c8a213?w=800&q=80&auto=format&fit=crop',
    address: 'Dwarka, Delhi',
    menu: [
      { id: 30401, name: 'Sugar (1 kg)', desc: 'Refined sulphur-free sugar for kitchen essentials.', price: 52, img: 'https://images.unsplash.com/photo-1588158829875-c0c8f93230f9?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 76, reorderLevel: 16, category: 'essentials', unit: 'kg', sku: 'CSV-SUG-1K' },
      { id: 30402, name: 'Tea Premium Dust (500 g)', desc: 'Strong blend tea leaves for daily kadak chai.', price: 198, img: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80&auto=format', veg: true, bestseller: true, stock: 33, reorderLevel: 8, category: 'beverages', unit: 'pack', sku: 'CSV-TEA-500' },
      { id: 30403, name: 'Instant Noodles (12 pack)', desc: 'Quick snack multipack in classic masala flavor.', price: 175, img: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&q=80&auto=format', veg: true, bestseller: true, stock: 39, reorderLevel: 10, category: 'snacks', unit: 'box', sku: 'CSV-NDL-12' },
      { id: 30404, name: 'Toilet Cleaner (1 L)', desc: 'Powerful bathroom cleaner with germ protection.', price: 118, img: 'https://images.unsplash.com/photo-1583947582886-f40ec95dd752?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 26, reorderLevel: 8, category: 'household', unit: 'bottle', sku: 'CSV-TCL-1L' },
      { id: 30405, name: 'Laundry Liquid (2 L)', desc: 'Front and top load compatible liquid detergent.', price: 289, img: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 18, reorderLevel: 6, category: 'household', unit: 'bottle', sku: 'CSV-LDR-2L' },
      { id: 30406, name: 'Bath Soap (4 pack)', desc: 'Moisturizing family soap bars with mild fragrance.', price: 130, img: 'https://images.unsplash.com/photo-1604719312566-8912e9c8a213?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 44, reorderLevel: 12, category: 'household', unit: 'pack', sku: 'CSV-SOP-4P' },
      { id: 30407, name: 'Mineral Water (1 L x 6)', desc: 'Pack of purified mineral water bottles.', price: 120, img: 'https://images.unsplash.com/photo-1564419433125-847251f7c93e?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 41, reorderLevel: 12, category: 'beverages', unit: 'pack', sku: 'CSV-WAT-6P' },
      { id: 30408, name: 'Poha Thick (1 kg)', desc: 'Premium thick poha for breakfast and snacks.', price: 84, img: 'https://images.unsplash.com/photo-1615485291234-9fbc6f6361ec?w=400&q=80&auto=format', veg: true, bestseller: false, stock: 57, reorderLevel: 14, category: 'essentials', unit: 'kg', sku: 'CSV-POH-1K' },
    ],
  },
];

const PRODUCT_CATEGORIES = new Set([
  'fruits',
  'vegetables',
  'dairy',
  'bakery',
  'snacks',
  'beverages',
  'household',
  'essentials',
  'organic',
]);

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
};

const liveRestaurantCache = new Map();
const liveCategoryMedia = {
  burger: {
    card: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=700&q=80&auto=format&fit=crop',
    menu: [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80&auto=format',
      'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&q=80&auto=format',
      'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&q=80&auto=format',
      'https://images.unsplash.com/photo-1630431341973-02e1b662ec35?w=400&q=80&auto=format',
    ],
  },
  pizza: {
    card: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=700&q=80&auto=format&fit=crop',
    menu: [
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80&auto=format',
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80&auto=format',
      'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&q=80&auto=format',
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80&auto=format',
    ],
  },
  biryani: {
    card: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=700&q=80&auto=format&fit=crop',
    menu: [
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80&auto=format',
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80&auto=format',
      'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80&auto=format',
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80&auto=format',
    ],
  },
  chinese: {
    card: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=700&q=80&auto=format&fit=crop',
    menu: [
      'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&q=80&auto=format',
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80&auto=format',
      'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&q=80&auto=format',
      'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&q=80&auto=format',
    ],
  },
  sushi: {
    card: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=700&q=80&auto=format&fit=crop',
    menu: [
      'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&q=80&auto=format',
      'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=400&q=80&auto=format',
      'https://images.unsplash.com/photo-1617196034302-a7ac2e88bc1c?w=400&q=80&auto=format',
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80&auto=format',
    ],
  },
  salad: {
    card: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&q=80&auto=format&fit=crop',
    menu: [
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80&auto=format',
      'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&q=80&auto=format',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80&auto=format',
      'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80&auto=format',
    ],
  },
  dessert: {
    card: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=700&q=80&auto=format&fit=crop',
    menu: [
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80&auto=format',
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80&auto=format',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80&auto=format',
      'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=400&q=80&auto=format',
    ],
  },
  coffee: {
    card: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&q=80&auto=format&fit=crop',
    menu: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80&auto=format',
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&q=80&auto=format',
      'https://images.unsplash.com/photo-1464306076886-da185f6a9d05?w=400&q=80&auto=format',
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=80&auto=format',
    ],
  },
};

const liveMenuTemplates = {
  burger: [
    { name: 'Signature Burger', desc: 'House favourite burger stack with crisp fries', price: 229, veg: false, bestseller: true },
    { name: 'Grilled Veg Burger', desc: 'Veg patty with lettuce, tomato and smoky sauce', price: 189, veg: true, bestseller: false },
    { name: 'Loaded Fries', desc: 'Fries topped with cheese sauce and herbs', price: 139, veg: true, bestseller: false },
    { name: 'Shake Combo', desc: 'Classic burger combo with a chilled shake', price: 259, veg: false, bestseller: true },
  ],
  pizza: [
    { name: 'House Pizza', desc: 'Stone-baked pizza with mozzarella and chef toppings', price: 299, veg: false, bestseller: true },
    { name: 'Veg Supreme Pizza', desc: 'Loaded pizza with peppers, olives and sweet corn', price: 269, veg: true, bestseller: false },
    { name: 'Garlic Bread', desc: 'Toasted garlic bread served with dip', price: 149, veg: true, bestseller: false },
    { name: 'Pasta Bowl', desc: 'Creamy pasta bowl finished with herbs', price: 239, veg: true, bestseller: true },
  ],
  biryani: [
    { name: 'Special Biryani', desc: 'Slow-cooked rice dish layered with aromatic spices', price: 319, veg: false, bestseller: true },
    { name: 'Veg Dum Biryani', desc: 'Saffron rice with vegetables, mint and fried onions', price: 279, veg: true, bestseller: false },
    { name: 'Kebab Platter', desc: 'Char-grilled kebabs with chutney and salad', price: 249, veg: false, bestseller: false },
    { name: 'Raita Combo', desc: 'Biryani combo served with raita and salan', price: 339, veg: false, bestseller: true },
  ],
  chinese: [
    { name: 'Street Noodles', desc: 'Wok-tossed noodles with vegetables and sauces', price: 199, veg: true, bestseller: true },
    { name: 'Chilli Chicken', desc: 'Spicy chicken tossed with peppers and onion', price: 239, veg: false, bestseller: true },
    { name: 'Fried Rice', desc: 'Classic fried rice with spring onion garnish', price: 189, veg: true, bestseller: false },
    { name: 'Dim Sum Basket', desc: 'Steamed dumplings served with dipping sauce', price: 219, veg: true, bestseller: false },
  ],
  sushi: [
    { name: 'Chef Sushi Roll', desc: 'Fresh sushi roll finished with sesame and pickles', price: 349, veg: false, bestseller: true },
    { name: 'Veg Maki Roll', desc: 'Avocado and cucumber maki with soy dip', price: 299, veg: true, bestseller: false },
    { name: 'Ramen Bowl', desc: 'Comforting ramen bowl with rich broth', price: 329, veg: false, bestseller: true },
    { name: 'Tempura Platter', desc: 'Light and crisp tempura served hot', price: 289, veg: false, bestseller: false },
  ],
  salad: [
    { name: 'Power Bowl', desc: 'Fresh bowl with grains, greens and dressing', price: 249, veg: true, bestseller: true },
    { name: 'Protein Wrap', desc: 'Loaded wrap packed with crunchy salad filling', price: 219, veg: false, bestseller: false },
    { name: 'Garden Salad', desc: 'Simple seasonal salad with lemon dressing', price: 189, veg: true, bestseller: false },
    { name: 'Smoothie Pairing', desc: 'Healthy bowl paired with a fruit smoothie', price: 269, veg: true, bestseller: true },
  ],
  dessert: [
    { name: 'Dessert Box', desc: 'A sweet house special packed with textures', price: 209, veg: true, bestseller: true },
    { name: 'Waffle Stack', desc: 'Warm waffles topped with sauce and fruit', price: 219, veg: true, bestseller: false },
    { name: 'Ice Cream Cup', desc: 'Creamy ice cream with toppings of the day', price: 149, veg: true, bestseller: false },
    { name: 'Celebration Sundae', desc: 'Layered sundae for your dessert cravings', price: 239, veg: true, bestseller: true },
  ],
  coffee: [
    { name: 'Cafe Latte', desc: 'Smooth espresso with steamed milk and foam', price: 159, veg: true, bestseller: true },
    { name: 'Cold Coffee', desc: 'Chilled blended coffee with creamy finish', price: 169, veg: true, bestseller: false },
    { name: 'Club Sandwich', desc: 'Cafe-style sandwich toasted to order', price: 199, veg: false, bestseller: false },
    { name: 'Dessert Slice', desc: 'Freshly plated dessert slice from the display', price: 179, veg: true, bestseller: true },
  ],
};

function createDefaultCatalogStores() {
  return DEFAULT_GROCERY_STORES.map(store => ({
    ...store,
    tags: Array.isArray(store.tags) ? [...store.tags] : [],
    menu: (store.menu || []).map(item => ({
      ...item,
      tags: Array.isArray(item.tags) ? [...item.tags] : [],
    })),
  }));
}

function buildStoreManagerDefaultPassword(storeId) {
  return `Store${Number(storeId) || 0}@QB`;
}

function createStoreManagerAccount(storeId, now = Date.now()) {
  const normalizedStoreId = toWholeNumber(storeId, 0);
  const passwordMeta = hashPassword(buildStoreManagerDefaultPassword(normalizedStoreId));

  return {
    storeId: normalizedStoreId,
    passwordHash: passwordMeta.hash,
    passwordSalt: passwordMeta.salt,
    createdAt: now,
    updatedAt: now,
  };
}

function migrateStoreShape(existing) {
  const store = existing && typeof existing === 'object' ? { ...existing } : {};

  if (!Array.isArray(store.users)) store.users = [];
  if (!Array.isArray(store.orders)) store.orders = [];
  if (!Array.isArray(store.sessions)) store.sessions = [];
  if (!Array.isArray(store.adminSessions)) store.adminSessions = [];
  if (!Array.isArray(store.catalogStores)) store.catalogStores = createDefaultCatalogStores();

  store.catalogStores = store.catalogStores
    .map(candidate => sanitizeCatalogStore(candidate))
    .filter(Boolean);

  if (!store.catalogStores.length) {
    store.catalogStores = createDefaultCatalogStores();
  }

  const validStoreIds = new Set(store.catalogStores.map(entry => entry.id));
  if (!Array.isArray(store.storeManagers)) store.storeManagers = [];

  const now = Date.now();
  const managerByStoreId = new Map();

  store.storeManagers.forEach(account => {
    const storeId = toWholeNumber(account?.storeId, 0);
    if (!storeId || !validStoreIds.has(storeId)) return;

    const passwordHash = normalizeText(account?.passwordHash, 200);
    const passwordSalt = normalizeText(account?.passwordSalt, 100);
    if (!passwordHash || !passwordSalt) return;

    managerByStoreId.set(storeId, {
      storeId,
      passwordHash,
      passwordSalt,
      createdAt: toWholeNumber(account?.createdAt, now) || now,
      updatedAt: toWholeNumber(account?.updatedAt, now) || now,
    });
  });

  store.catalogStores.forEach(storeEntry => {
    if (!managerByStoreId.has(storeEntry.id)) {
      managerByStoreId.set(storeEntry.id, createStoreManagerAccount(storeEntry.id, now));
    }
  });

  store.storeManagers = [...managerByStoreId.values()].sort((a, b) => a.storeId - b.storeId);

  store.adminSessions = (store.adminSessions || [])
    .map(session => {
      const token = normalizeText(session?.token, 120);
      if (!token) return null;

      const role = session?.role === 'store' ? 'store' : 'super';
      const storeId = role === 'store' ? toWholeNumber(session?.storeId, 0) : null;
      if (role === 'store' && (!storeId || !validStoreIds.has(storeId))) return null;

      return {
        token,
        role,
        storeId,
        createdAt: toWholeNumber(session?.createdAt, now) || now,
        expiresAt: toWholeNumber(session?.expiresAt, now) || now,
      };
    })
    .filter(Boolean);

  return store;
}

async function ensureVolatileStore() {
  if (volatileStore) return;

  try {
    const seeded = JSON.parse(await fs.readFile(STORE_PATH, 'utf8'));
    volatileStore = migrateStoreShape(seeded);
  } catch {
    volatileStore = migrateStoreShape(null);
  }
}

async function readStoreFromKV() {
  if (!kvClient) return null;
  const stored = await kvClient.get(KV_STORE_KEY);
  if (!stored || typeof stored !== 'object') return null;
  return migrateStoreShape(stored);
}

async function writeStoreToKV(store) {
  if (!kvClient) return;
  await kvClient.set(KV_STORE_KEY, store);
}

async function ensureStoreFile() {
  if (kvClient) {
    const stored = await readStoreFromKV();
    if (!stored) {
      await writeStoreToKV(migrateStoreShape(null));
    }
    return;
  }

  if (IS_VERCEL_RUNTIME) {
    await ensureVolatileStore();
    return;
  }

  await fs.mkdir(DATA_DIR, { recursive: true });

  let existing = null;
  let requiresWrite = false;

  try {
    existing = JSON.parse(await fs.readFile(STORE_PATH, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn('Store file was unreadable. Rebuilding with safe defaults.');
    }
    existing = null;
    requiresWrite = true;
  }

  const migrated = migrateStoreShape(existing);
  if (requiresWrite || JSON.stringify(existing) !== JSON.stringify(migrated)) {
    await fs.writeFile(STORE_PATH, JSON.stringify(migrated, null, 2));
  }
}

async function readStore() {
  if (kvClient) {
    const stored = await readStoreFromKV();
    if (stored) return stored;

    const fresh = migrateStoreShape(null);
    await writeStoreToKV(fresh);
    return fresh;
  }

  if (IS_VERCEL_RUNTIME) {
    await ensureVolatileStore();
    return migrateStoreShape(volatileStore);
  }

  const raw = await fs.readFile(STORE_PATH, 'utf8');
  return migrateStoreShape(JSON.parse(raw));
}

async function writeStore(store) {
  const nextStore = migrateStoreShape(store);

  if (kvClient) {
    await writeStoreToKV(nextStore);
    return;
  }

  if (IS_VERCEL_RUNTIME) {
    volatileStore = nextStore;
    return;
  }

  await fs.writeFile(STORE_PATH, JSON.stringify(nextStore, null, 2));
}

let storeInitializationPromise = null;
function ensureStoreInitialized() {
  if (!storeInitializationPromise) {
    storeInitializationPromise = ensureStoreFile().catch(error => {
      storeInitializationPromise = null;
      throw error;
    });
  }
  return storeInitializationPromise;
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(payload));
}

function sendNoContent(res) {
  res.writeHead(204);
  res.end();
}

function sendError(res, statusCode, message) {
  sendJson(res, statusCode, { message });
}

function applyCors(req, res) {
  const origin = req.headers.origin;

  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, PATCH, OPTIONS');
  res.setHeader('Access-Control-Max-Age', '86400');
}

async function readJsonBody(req) {
  let raw = '';

  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 1_000_000) {
      throw new Error('Request body is too large');
    }
  }

  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch {
    const error = new Error('Invalid JSON body');
    error.statusCode = 400;
    throw error;
  }
}

function normalizeText(value, maxLength = 160) {
  return String(value || '').trim().slice(0, maxLength);
}

function normalizeEmail(value) {
  return normalizeText(value, 120).toLowerCase();
}

function normalizePhone(value) {
  return normalizeText(value, 20);
}

function normalizeCategory(value) {
  const category = normalizeText(value, 40).toLowerCase().replace(/\s+/g, '_');
  return PRODUCT_CATEGORIES.has(category) ? category : 'essentials';
}

function toWholeNumber(value, fallback = 0) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(0, Math.round(number));
}

function sanitizeCatalogProduct(product, storeId) {
  const id = toWholeNumber(product?.id, 0);
  const name = normalizeText(product?.name, 120);
  if (!id || !name) return null;

  return {
    id,
    restId: toWholeNumber(product?.restId || storeId, storeId),
    name,
    desc: normalizeText(product?.desc, 220),
    price: toWholeNumber(product?.price, 0),
    img: normalizeText(product?.img, 500),
    veg: Boolean(product?.veg),
    bestseller: Boolean(product?.bestseller),
    stock: toWholeNumber(product?.stock, 0),
    reorderLevel: Math.max(1, toWholeNumber(product?.reorderLevel, 8)),
    category: normalizeCategory(product?.category),
    unit: normalizeText(product?.unit || 'unit', 24) || 'unit',
    sku: normalizeText(product?.sku || `SKU-${id}`, 40).toUpperCase(),
    tags: Array.isArray(product?.tags)
      ? product.tags.map(tag => normalizeText(tag, 30)).filter(Boolean)
      : [],
  };
}

function sanitizeCatalogStore(store) {
  const id = toWholeNumber(store?.id, 0);
  const name = normalizeText(store?.name, 120);
  if (!id || !name) return null;

  return {
    id,
    name,
    cuisine: normalizeText(store?.cuisine, 120),
    rating: Math.min(5, Math.max(0, Number(store?.rating) || 0)),
    deliveryTime: Math.max(10, Math.min(90, toWholeNumber(store?.deliveryTime, 30))),
    minOrder: toWholeNumber(store?.minOrder, 0),
    avgCost: toWholeNumber(store?.avgCost, 0),
    category: normalizeCategory(store?.category || 'essentials'),
    promo: normalizeText(store?.promo, 90),
    tags: Array.isArray(store?.tags)
      ? store.tags.map(tag => normalizeText(tag, 30)).filter(Boolean)
      : [],
    img: normalizeText(store?.img, 500),
    address: normalizeText(store?.address, 180),
    menu: Array.isArray(store?.menu)
      ? store.menu.map(item => sanitizeCatalogProduct(item, id)).filter(Boolean)
      : [],
  };
}

function getCatalogStoreById(storeData, storeId) {
  return (storeData.catalogStores || []).find(entry => entry.id === Number(storeId)) || null;
}

function findCatalogProductById(storeData, productId) {
  for (const storeEntry of storeData.catalogStores || []) {
    const product = (storeEntry.menu || []).find(item => item.id === Number(productId));
    if (product) return { store: storeEntry, product };
  }
  return null;
}

function sanitizeCatalogStores(stores = []) {
  return stores
    .map(entry => sanitizeCatalogStore(entry))
    .filter(Boolean);
}

function buildInventorySummary(stores = []) {
  let totalProducts = 0;
  let lowStockProducts = 0;
  let outOfStockProducts = 0;
  let inventoryValue = 0;

  stores.forEach(storeEntry => {
    (storeEntry.menu || []).forEach(product => {
      totalProducts += 1;
      if (product.stock <= 0) outOfStockProducts += 1;
      if (product.stock <= product.reorderLevel) lowStockProducts += 1;
      inventoryValue += product.stock * product.price;
    });
  });

  return {
    totalStores: stores.length,
    totalProducts,
    lowStockProducts,
    outOfStockProducts,
    inventoryValue,
  };
}

function buildInventoryDemand(items = []) {
  const demand = new Map();

  items.forEach(item => {
    const storeId = toWholeNumber(item.restId, 0);
    const productId = toWholeNumber(item.id, 0);
    const qty = toWholeNumber(item.qty, 0);
    if (!storeId || !productId || !qty) return;

    const key = `${storeId}:${productId}`;
    const existingQty = demand.get(key)?.qty || 0;
    demand.set(key, {
      key,
      storeId,
      productId,
      qty: existingQty + qty,
    });
  });

  return [...demand.values()];
}

function checkInventoryDemand(storeData, demand = []) {
  for (const line of demand) {
    const storeEntry = getCatalogStoreById(storeData, line.storeId);
    if (!storeEntry) {
      return { ok: false, message: 'Selected grocery store is unavailable right now.' };
    }

    const product = (storeEntry.menu || []).find(item => item.id === line.productId);
    if (!product) {
      return { ok: false, message: `Some products are no longer available at ${storeEntry.name}.` };
    }

    if (product.stock < line.qty) {
      return {
        ok: false,
        message: `${product.name} has only ${product.stock} left in stock.`,
      };
    }
  }

  return { ok: true };
}

function applyInventoryDemand(storeData, demand = [], direction = 'deduct') {
  const multiplier = direction === 'add' ? 1 : -1;

  demand.forEach(line => {
    const storeEntry = getCatalogStoreById(storeData, line.storeId);
    if (!storeEntry) return;
    const product = (storeEntry.menu || []).find(item => item.id === line.productId);
    if (!product) return;
    product.stock = Math.max(0, product.stock + (line.qty * multiplier));
  });
}

function buildOrderItemsFromCatalog(storeData, incomingItems = [], fallbackStoreId = 0) {
  const orderItems = [];

  for (const rawItem of incomingItems) {
    const itemStoreId = toWholeNumber(rawItem.restId, toWholeNumber(fallbackStoreId, 0));
    const storeEntry = getCatalogStoreById(storeData, itemStoreId);
    if (!storeEntry) {
      return { error: 'Selected grocery store is unavailable right now.' };
    }

    const productId = toWholeNumber(rawItem.id, 0);
    const qty = toWholeNumber(rawItem.qty, 0);
    if (!productId || !qty) continue;

    const product = (storeEntry.menu || []).find(item => item.id === productId);
    if (!product) {
      return { error: `${rawItem.name || 'A product'} is no longer available in ${storeEntry.name}.` };
    }

    orderItems.push({
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

  if (!orderItems.length) {
    return { error: 'Your cart is empty' };
  }

  return { items: orderItems };
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address || '',
    favourites: Array.isArray(user.favourites) ? user.favourites : [],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

function verifyPassword(password, user) {
  const derived = crypto.scryptSync(password, user.passwordSalt, 64).toString('hex');
  const a = Buffer.from(derived, 'hex');
  const b = Buffer.from(user.passwordHash, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function getBearerToken(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return '';
  return header.slice(7).trim();
}

function getStatusRank(status) {
  const ranks = {
    Pending: 0,
    Confirmed: 1,
    Delivered: 2,
    Cancelled: 3,
  };
  return ranks[status] ?? -1;
}

function pruneExpiredSessions(store) {
  const now = Date.now();
  store.sessions = store.sessions.filter(session => session.expiresAt > now);
  store.adminSessions = store.adminSessions.filter(session => session.expiresAt > now);
}

function syncOrderStatuses(store) {
  let changed = false;
  const now = Date.now();

  store.orders.forEach(order => {
    if (order.status === 'Cancelled' || order.status === 'Delivered') return;

    const etaMinutes = order.etaMinutes || 30;
    const elapsedRatio = Math.max(0, (now - (order.createdAt || now)) / (etaMinutes * 60 * 1000));
    const targetStatus = elapsedRatio >= 1 ? 'Delivered' : elapsedRatio >= 0.35 ? 'Confirmed' : 'Pending';

    if (getStatusRank(targetStatus) > getStatusRank(order.status)) {
      order.status = targetStatus;
      changed = true;
    }
  });

  return changed;
}

function getUserFromStore(store, req) {
  const token = getBearerToken(req);
  if (!token) return null;

  const session = store.sessions.find(item => item.token === token && item.expiresAt > Date.now());
  if (!session) return null;

  return store.users.find(user => user.id === session.userId) || null;
}

function getAdminSession(store, req) {
  const token = getBearerToken(req);
  if (!token) return null;

  const session = store.adminSessions.find(item => item.token === token && item.expiresAt > Date.now());
  if (!session) return null;

  if (session.role === 'store') {
    return {
      ...session,
      role: 'store',
      storeId: toWholeNumber(session.storeId, 0) || null,
    };
  }

  return {
    ...session,
    role: 'super',
    storeId: null,
  };
}

function getAdminAccess(store, req) {
  const session = getAdminSession(store, req);
  if (!session) return null;

  if (session.role === 'store') {
    const storeEntry = getCatalogStoreById(store, session.storeId);
    if (!storeEntry) return null;

    return {
      role: 'store',
      storeId: storeEntry.id,
      storeName: storeEntry.name,
      session,
    };
  }

  return {
    role: 'super',
    storeId: null,
    storeName: '',
    session,
  };
}

function toAdminAccessPayload(access) {
  return {
    role: access.role === 'store' ? 'store' : 'super',
    storeId: access.role === 'store' ? Number(access.storeId) : null,
    storeName: access.role === 'store' ? String(access.storeName || '') : '',
    canManageAllStores: access.role !== 'store',
    defaultStorePasswordPattern: 'Store<StoreId>@QB',
  };
}

function isStoreAllowedForAccess(access, storeId) {
  if (access.role !== 'store') return true;
  return Number(access.storeId) === Number(storeId);
}

function scopeStoresForAccess(stores = [], access) {
  if (access.role !== 'store') return stores;
  return stores.filter(storeEntry => Number(storeEntry.id) === Number(access.storeId));
}

function scopeOrdersForAccess(orders = [], access) {
  if (access.role !== 'store') return orders;
  return orders.filter(order => Number(order.restId) === Number(access.storeId));
}

function calculateCartTotals(items, couponCode = '') {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
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

function normalizeOrderItems(items, restId) {
  if (!Array.isArray(items)) return [];

  return items
    .map(item => ({
      id: toWholeNumber(item.id, 0),
      restId: toWholeNumber(item.restId, toWholeNumber(restId, 0)),
      qty: toWholeNumber(item.qty, 0),
    }))
    .filter(item => item.id && item.qty > 0);
}

function simpleHash(input) {
  let hash = 0;

  for (const char of String(input)) {
    hash = ((hash << 5) - hash) + char.charCodeAt(0);
    hash |= 0;
  }

  return Math.abs(hash);
}

function toPositiveNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const earthRadiusKm = 6371;
  const toRadians = degrees => degrees * (Math.PI / 180);
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function sanitizeUrl(value) {
  const url = normalizeText(value, 400);
  if (!url) return '';
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function titleCase(value) {
  return String(value || '')
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function normalizeCuisineLabel(rawCuisine, amenity) {
  const values = String(rawCuisine || '')
    .split(/[;,]+/)
    .map(value => titleCase(value.trim()))
    .filter(Boolean);

  if (values.length) return values.slice(0, 3).join(', ');
  return titleCase(amenity === 'cafe' ? 'Cafe' : amenity.replace(/_/g, ' '));
}

function formatAmenityLabel(amenity) {
  const labels = {
    bar: 'Bar',
    cafe: 'Cafe',
    fast_food: 'Fast Food',
    food_court: 'Food Court',
    pub: 'Pub',
    restaurant: 'Restaurant',
  };

  return labels[amenity] || titleCase(amenity);
}

function inferCategoryFromPlace({ cuisine, amenity, name }) {
  const haystack = `${cuisine || ''} ${amenity || ''} ${name || ''}`.toLowerCase();

  if (/burger|smash|patty/.test(haystack)) return 'burger';
  if (/pizza|pizzeria|italian/.test(haystack)) return 'pizza';
  if (/biryani|mughlai|kebab|indian|tandoor/.test(haystack)) return 'biryani';
  if (/chinese|thai|asian|noodle|dimsum|dumpling|wok/.test(haystack)) return 'chinese';
  if (/sushi|ramen|japanese/.test(haystack)) return 'sushi';
  if (/salad|healthy|vegan|wrap|bowl/.test(haystack)) return 'salad';
  if (/dessert|ice cream|bakery|sweet|waffle|cake/.test(haystack)) return 'dessert';
  if (/cafe|coffee|tea|espresso/.test(haystack)) return 'coffee';
  if (amenity === 'cafe') return 'coffee';
  if (amenity === 'fast_food') return 'burger';
  if (amenity === 'bar' || amenity === 'pub') return 'coffee';

  return 'all';
}

function buildAddressFromTags(tags = {}) {
  const parts = [
    [tags['addr:housenumber'], tags['addr:street']].filter(Boolean).join(' ').trim(),
    tags['addr:suburb'] || tags['addr:neighbourhood'],
    tags['addr:city'] || tags['addr:town'] || tags['addr:village'],
    tags['addr:state'],
  ].filter(Boolean);

  return parts.join(', ');
}

function buildAddressFromNominatimAddress(address = {}) {
  const parts = [
    [address.house_number, address.road].filter(Boolean).join(' ').trim(),
    address.suburb || address.neighbourhood || address.city_district,
    address.city || address.town || address.village,
    address.state,
  ].filter(Boolean);

  return parts.join(', ');
}

function getBoundingBoxFromNominatim(place) {
  const values = Array.isArray(place?.boundingbox) ? place.boundingbox.map(Number) : [];
  const lat = Number(place?.lat);
  const lon = Number(place?.lon);
  let south = clamp(values[0] ?? (lat - 0.05), -90, 90);
  let north = clamp(values[1] ?? (lat + 0.05), -90, 90);
  let west = clamp(values[2] ?? (lon - 0.05), -180, 180);
  let east = clamp(values[3] ?? (lon + 0.05), -180, 180);

  const maxLatSpan = 0.18;
  const maxLonSpan = 0.18;

  if ((north - south) > maxLatSpan) {
    south = clamp(lat - (maxLatSpan / 2), -90, 90);
    north = clamp(lat + (maxLatSpan / 2), -90, 90);
  }
  if ((east - west) > maxLonSpan) {
    west = clamp(lon - (maxLonSpan / 2), -180, 180);
    east = clamp(lon + (maxLonSpan / 2), -180, 180);
  }

  const latPadding = Math.max(0.02, (north - south) * 0.08);
  const lonPadding = Math.max(0.02, (east - west) * 0.08);

  return {
    south: clamp(south - latPadding, -90, 90),
    north: clamp(north + latPadding, -90, 90),
    west: clamp(west - lonPadding, -180, 180),
    east: clamp(east + lonPadding, -180, 180),
  };
}

function createLiveMenu(category, restaurantName) {
  const templates = liveMenuTemplates[category] || liveMenuTemplates.burger;
  const media = liveCategoryMedia[category] || liveCategoryMedia.burger;

  return templates.map((template, index) => ({
    id: 800000 + (simpleHash(`${restaurantName}:${template.name}:${index}`) % 100000),
    name: template.name,
    desc: `${template.desc} Inspired by ${restaurantName}.`,
    price: template.price,
    img: media.menu[index % media.menu.length],
    veg: template.veg,
    bestseller: template.bestseller,
  }));
}

function toLiveRestaurant(element, locationMeta) {
  const tags = element.tags || {};
  const amenity = tags.amenity || 'restaurant';
  const lat = toPositiveNumber(element.lat ?? element.center?.lat, Number(locationMeta.lat));
  const lon = toPositiveNumber(element.lon ?? element.center?.lon, Number(locationMeta.lon));
  const cuisine = normalizeCuisineLabel(tags.cuisine, amenity);
  const category = inferCategoryFromPlace({
    cuisine: tags.cuisine,
    amenity,
    name: tags.name,
  });
  const media = liveCategoryMedia[category] || liveCategoryMedia.burger;
  const name = normalizeText(tags.name || tags.brand || `${formatAmenityLabel(amenity)} Spot`, 120);
  const distanceKm = haversineKm(Number(locationMeta.lat), Number(locationMeta.lon), lat, lon);
  const phone = normalizeText(tags.phone || tags['contact:phone'], 80);
  const website = sanitizeUrl(tags.website || tags['contact:website']);
  const address = buildAddressFromTags(tags) || locationMeta.label;
  const shortAddress = [tags['addr:street'], tags['addr:suburb'] || tags['addr:city'] || tags['addr:town']]
    .filter(Boolean)
    .join(', ') || address;
  const distanceLabel = distanceKm < 1
    ? `${Math.max(100, Math.round(distanceKm * 1000))} m away`
    : `${distanceKm.toFixed(1)} km away`;
  const websiteHost = website ? (() => {
    try {
      return new URL(website).hostname.replace(/^www\./, '');
    } catch {
      return website;
    }
  })() : '';

  return {
    id: 100000 + (simpleHash(`${element.type}:${element.id}`) % 900000),
    name,
    cuisine,
    rating: 0,
    deliveryTime: clamp(Math.round(18 + distanceKm * 7), 18, 65),
    minOrder: category === 'sushi' ? 349 : category === 'dessert' || category === 'coffee' ? 149 : 199,
    avgCost: category === 'sushi' ? 750 : category === 'pizza' ? 480 : category === 'dessert' ? 280 : 360,
    category,
    promo: 'Live nearby place',
    tags: [
      'Live',
      formatAmenityLabel(amenity),
      website ? `Web: ${websiteHost}` : phone ? 'Phone listed' : 'OSM place',
    ].filter(Boolean),
    img: media.card,
    liveSource: 'osm',
    liveAmenity: amenity,
    liveAmenityLabel: formatAmenityLabel(amenity),
    distanceKm: Number(distanceKm.toFixed(2)),
    distanceLabel,
    address,
    shortAddress,
    phone,
    website,
    osmUrl: `https://www.openstreetmap.org/${element.type}/${element.id}`,
    menuDisclaimer: 'Live restaurant details come from OpenStreetMap. Menu items below are generated by QuickBite so the ordering demo still works.',
    menu: createLiveMenu(category, name),
  };
}

function toLiveRestaurantFromSearchPlace(place, locationMeta) {
  const amenity = place.type || 'restaurant';
  const cuisine = normalizeCuisineLabel(place.extratags?.cuisine || '', amenity);
  const category = inferCategoryFromPlace({
    cuisine: place.extratags?.cuisine || '',
    amenity,
    name: place.name,
  });
  const media = liveCategoryMedia[category] || liveCategoryMedia.burger;
  const name = normalizeText(place.name || place.address?.amenity || 'Restaurant', 120);
  const distanceKm = haversineKm(Number(locationMeta.lat), Number(locationMeta.lon), Number(place.lat), Number(place.lon));
  const website = sanitizeUrl(place.extratags?.website || place.extratags?.['contact:website']);
  const phone = normalizeText(place.extratags?.phone || place.extratags?.['contact:phone'], 80);
  const address = buildAddressFromNominatimAddress(place.address) || normalizeText(place.display_name, 180) || locationMeta.label;
  const shortAddress = [place.address?.road, place.address?.suburb || place.address?.city || place.address?.town]
    .filter(Boolean)
    .join(', ') || address;
  const distanceLabel = distanceKm < 1
    ? `${Math.max(100, Math.round(distanceKm * 1000))} m away`
    : `${distanceKm.toFixed(1)} km away`;

  return {
    id: 100000 + (simpleHash(`${place.osm_type}:${place.osm_id}`) % 900000),
    name,
    cuisine,
    rating: 0,
    deliveryTime: clamp(Math.round(18 + distanceKm * 7), 18, 65),
    minOrder: category === 'sushi' ? 349 : category === 'dessert' || category === 'coffee' ? 149 : 199,
    avgCost: category === 'sushi' ? 750 : category === 'pizza' ? 480 : category === 'dessert' ? 280 : 360,
    category,
    promo: 'Live nearby place',
    tags: [
      'Live',
      formatAmenityLabel(amenity),
      website ? 'Website listed' : phone ? 'Phone listed' : 'Map listing',
    ],
    img: media.card,
    liveSource: 'osm',
    liveAmenity: amenity,
    liveAmenityLabel: formatAmenityLabel(amenity),
    distanceKm: Number(distanceKm.toFixed(2)),
    distanceLabel,
    address,
    shortAddress,
    phone,
    website,
    osmUrl: `https://www.openstreetmap.org/${place.osm_type}/${place.osm_id}`,
    menuDisclaimer: 'Live restaurant details come from OpenStreetMap. Menu items below are generated by QuickBite so the ordering demo still works.',
    menu: createLiveMenu(category, name),
  };
}

function getRestaurantSearchRadius(bounds, locationMeta) {
  const latSpanKm = haversineKm(bounds.south, locationMeta.lon, bounds.north, locationMeta.lon);
  const lonSpanKm = haversineKm(locationMeta.lat, bounds.west, locationMeta.lat, bounds.east);
  const smallerSpanKm = Math.min(latSpanKm, lonSpanKm);
  return clamp(Math.round((smallerSpanKm * 1000) / 2), 2500, 7000);
}

function buildOverpassRestaurantQuery(bounds, locationMeta) {
  const radiusMeters = getRestaurantSearchRadius(bounds, locationMeta);
  return [
    '[out:json][timeout:18];',
    '(',
    `  node["amenity"~"restaurant|fast_food|cafe|food_court"](around:${radiusMeters},${locationMeta.lat},${locationMeta.lon});`,
    `  way["amenity"~"restaurant|fast_food|cafe|food_court"](around:${radiusMeters},${locationMeta.lat},${locationMeta.lon});`,
    `  relation["amenity"~"restaurant|fast_food|cafe|food_court"](around:${radiusMeters},${locationMeta.lat},${locationMeta.lon});`,
    ');',
    'out center tags;',
  ].join('\n');
}

async function fetchJsonFromUrl(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'User-Agent': APP_USER_AGENT,
      Accept: 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Upstream request failed with status ${response.status}`);
  }

  return response.json();
}

async function fetchJsonWithFallback(urls, options = {}) {
  const errors = [];

  for (const url of urls) {
    try {
      return await fetchJsonFromUrl(url, options);
    } catch (error) {
      errors.push(`${url} -> ${error.message}`);
    }
  }

  throw new Error(errors.join(' | '));
}

async function searchLocationPlace(location) {
  const params = new URLSearchParams({
    q: location,
    format: 'jsonv2',
    limit: '1',
    addressdetails: '1',
  });

  const results = await fetchJsonFromUrl(`${NOMINATIM_SEARCH_URL}?${params.toString()}`);
  return Array.isArray(results) ? results[0] : null;
}

async function searchRestaurantPlaces(location, place) {
  const locationParts = String(location)
    .split(',')
    .map(value => value.trim())
    .filter(Boolean);
  const city = locationParts[0] || place.address?.city || place.address?.town || place.address?.village || '';
  const country = locationParts[locationParts.length - 1] || place.address?.country || '';

  const params = new URLSearchParams({
    city,
    country,
    amenity: 'restaurant',
    format: 'jsonv2',
    limit: '24',
    addressdetails: '1',
    extratags: '1',
  });

  const results = await fetchJsonFromUrl(`${NOMINATIM_SEARCH_URL}?${params.toString()}`);
  return Array.isArray(results) ? results : [];
}

async function fetchLiveRestaurants(location) {
  const cacheKey = normalizeText(location, 120).toLowerCase();
  const cached = liveRestaurantCache.get(cacheKey);
  if (cached && (Date.now() - cached.cachedAt) < LIVE_RESTAURANT_CACHE_TTL_MS) {
    return cached.payload;
  }

  const place = await searchLocationPlace(location);
  if (!place) {
    throw new Error(`Could not find the selected location: ${location}`);
  }

  const locationMeta = {
    label: normalizeText(place.display_name, 180),
    lat: Number(place.lat),
    lon: Number(place.lon),
  };
  const restaurantPlaces = await searchRestaurantPlaces(location, place);
  const nominatimRestaurants = restaurantPlaces
    .filter(result => result.osm_id && result.name)
    .map(result => toLiveRestaurantFromSearchPlace(result, locationMeta))
    .sort((a, b) => a.distanceKm - b.distanceKm || a.name.localeCompare(b.name));

  if (nominatimRestaurants.length) {
    const payload = {
      location: locationMeta.label,
      restaurants: nominatimRestaurants,
      source: 'OpenStreetMap',
      attribution: 'Data © OpenStreetMap contributors',
      fetchedAt: Date.now(),
    };

    liveRestaurantCache.set(cacheKey, {
      cachedAt: Date.now(),
      payload,
    });

    return payload;
  }

  const bounds = getBoundingBoxFromNominatim(place);
  const overpassQuery = buildOverpassRestaurantQuery(bounds, locationMeta);
  const overpassResponse = await fetchJsonWithFallback(OVERPASS_FALLBACK_URLS, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8',
    },
    body: overpassQuery,
  });

  const elements = Array.isArray(overpassResponse?.elements) ? overpassResponse.elements : [];
  const deduped = new Map();

  elements.forEach(element => {
    if (!element?.tags?.name) return;
    const restaurant = toLiveRestaurant(element, locationMeta);
    const dedupeKey = `${restaurant.name.toLowerCase()}|${restaurant.address.toLowerCase()}`;

    if (!deduped.has(dedupeKey) || restaurant.distanceKm < deduped.get(dedupeKey).distanceKm) {
      deduped.set(dedupeKey, restaurant);
    }
  });

  const restaurants = [...deduped.values()]
    .sort((a, b) => a.distanceKm - b.distanceKm || a.name.localeCompare(b.name))
    .slice(0, 24);

  const payload = {
    location: locationMeta.label,
    restaurants,
    source: 'OpenStreetMap',
    attribution: 'Data © OpenStreetMap contributors',
    fetchedAt: Date.now(),
  };

  liveRestaurantCache.set(cacheKey, {
    cachedAt: Date.now(),
    payload,
  });

  return payload;
}

async function handleSignup(req, res) {
  const body = await readJsonBody(req);
  const name = normalizeText(body.name, 80);
  const email = normalizeEmail(body.email);
  const phone = normalizePhone(body.phone);
  const password = String(body.password || '');

  if (!name || !email || !phone || !password) {
    return sendError(res, 400, 'Please fill all signup fields');
  }
  if (!/^\d{10}$/.test(phone)) {
    return sendError(res, 400, 'Enter a valid 10-digit phone number');
  }
  if (password.length < 6) {
    return sendError(res, 400, 'Password must be at least 6 characters');
  }

  const store = await readStore();
  pruneExpiredSessions(store);

  if (store.users.some(user => user.email === email)) {
    return sendError(res, 409, 'An account with this email already exists');
  }

  const now = Date.now();
  const passwordMeta = hashPassword(password);
  const user = {
    id: crypto.randomUUID(),
    name,
    email,
    phone,
    address: '',
    favourites: [],
    passwordHash: passwordMeta.hash,
    passwordSalt: passwordMeta.salt,
    createdAt: now,
    updatedAt: now,
  };

  const token = generateToken();
  store.users.push(user);
  store.sessions.push({
    token,
    userId: user.id,
    createdAt: now,
    expiresAt: now + USER_SESSION_TTL_MS,
  });

  await writeStore(store);
  sendJson(res, 201, { token, user: sanitizeUser(user) });
}

async function handleLogin(req, res) {
  const body = await readJsonBody(req);
  const email = normalizeEmail(body.email);
  const password = String(body.password || '');

  if (!email || !password) {
    return sendError(res, 400, 'Enter email and password');
  }

  const store = await readStore();
  pruneExpiredSessions(store);
  const user = store.users.find(item => item.email === email);

  if (!user || !verifyPassword(password, user)) {
    return sendError(res, 401, 'Account not found or password is incorrect');
  }

  const token = generateToken();
  const now = Date.now();
  store.sessions.push({
    token,
    userId: user.id,
    createdAt: now,
    expiresAt: now + USER_SESSION_TTL_MS,
  });

  await writeStore(store);
  sendJson(res, 200, { token, user: sanitizeUser(user) });
}

async function handleGetCurrentUser(req, res) {
  const store = await readStore();
  pruneExpiredSessions(store);
  const user = getUserFromStore(store, req);

  if (!user) {
    return sendError(res, 401, 'Your session has expired. Please sign in again.');
  }

  await writeStore(store);
  sendJson(res, 200, { user: sanitizeUser(user) });
}

async function handleLogout(req, res) {
  const token = getBearerToken(req);
  const store = await readStore();
  pruneExpiredSessions(store);

  if (token) {
    store.sessions = store.sessions.filter(session => session.token !== token);
    await writeStore(store);
  }

  sendNoContent(res);
}

async function handleProfileUpdate(req, res) {
  const body = await readJsonBody(req);
  const store = await readStore();
  pruneExpiredSessions(store);
  const user = getUserFromStore(store, req);

  if (!user) {
    return sendError(res, 401, 'Your session has expired. Please sign in again.');
  }

  if (body.name !== undefined) {
    const name = normalizeText(body.name, 80);
    if (!name) return sendError(res, 400, 'Name cannot be empty');
    user.name = name;
  }

  if (body.phone !== undefined) {
    const phone = normalizePhone(body.phone);
    if (!/^\d{10}$/.test(phone)) return sendError(res, 400, 'Enter a valid 10-digit phone number');
    user.phone = phone;
  }

  if (body.address !== undefined) {
    user.address = normalizeText(body.address, 240);
  }

  if (body.favourites !== undefined) {
    if (!Array.isArray(body.favourites)) {
      return sendError(res, 400, 'Favourites must be an array');
    }

    user.favourites = [...new Set(
      body.favourites
        .map(value => Number(value))
        .filter(value => Number.isInteger(value) && value > 0)
    )];
  }

  user.updatedAt = Date.now();
  await writeStore(store);
  sendJson(res, 200, { user: sanitizeUser(user) });
}

async function handleGetCatalog(req, res, url) {
  const store = await readStore();
  const location = normalizeText(url.searchParams.get('location'), 120);
  const stores = sanitizeCatalogStores(store.catalogStores || []);

  sendJson(res, 200, {
    location: location || 'All service zones',
    source: 'QuickBite Grocery Catalog',
    fetchedAt: Date.now(),
    stores,
    summary: buildInventorySummary(stores),
  });
}

async function handleGetAdminCatalog(req, res) {
  const store = await readStore();
  pruneExpiredSessions(store);

  const access = getAdminAccess(store, req);
  if (!access) {
    return sendError(res, 401, 'Admin session expired. Please unlock the dashboard again.');
  }

  const allStores = sanitizeCatalogStores(store.catalogStores || []);
  const scopedStores = scopeStoresForAccess(allStores, access);
  const summary = buildInventorySummary(scopedStores);
  const globalSummary = buildInventorySummary(allStores);

  sendJson(res, 200, {
    stores: scopedStores,
    summary,
    globalSummary,
    access: toAdminAccessPayload(access),
  });
}

async function handleGetAdminMe(req, res) {
  const store = await readStore();
  pruneExpiredSessions(store);

  const access = getAdminAccess(store, req);
  if (!access) {
    return sendError(res, 401, 'Admin session expired. Please unlock the dashboard again.');
  }

  sendJson(res, 200, { access: toAdminAccessPayload(access) });
}

async function handleAdminCreateProduct(req, res) {
  const body = await readJsonBody(req);
  const store = await readStore();
  pruneExpiredSessions(store);

  const access = getAdminAccess(store, req);
  if (!access) {
    return sendError(res, 401, 'Admin session expired. Please unlock the dashboard again.');
  }

  const name = normalizeText(body.name, 120);
  if (!name) {
    return sendError(res, 400, 'Product name is required');
  }

  const applyToAll = Boolean(body.applyToAll);
  if (access.role === 'store' && body.storeId !== undefined) {
    const requestedStoreId = toWholeNumber(body.storeId, 0);
    if (requestedStoreId && requestedStoreId !== Number(access.storeId)) {
      return sendError(res, 403, 'Store managers can only add products to their assigned store.');
    }
  }
  const targetStores = (() => {
    if (access.role !== 'store' && applyToAll) {
      return store.catalogStores || [];
    }

    const targetStoreId = access.role === 'store'
      ? Number(access.storeId)
      : toWholeNumber(body.storeId, 0);
    const targetStore = getCatalogStoreById(store, targetStoreId);
    return targetStore ? [targetStore] : [];
  })();

  if (!targetStores.length) {
    return sendError(res, 400, 'Choose a valid grocery store');
  }

  if (access.role === 'store' && targetStores.some(entry => !isStoreAllowedForAccess(access, entry.id))) {
    return sendError(res, 403, 'Store managers can only add products to their assigned store.');
  }

  let nextProductId = (store.catalogStores || [])
    .flatMap(entry => entry.menu || [])
    .reduce((max, item) => Math.max(max, toWholeNumber(item.id, 0)), 30000);
  const createdProducts = [];

  targetStores.forEach(storeEntry => {
    nextProductId += 1;
    const product = sanitizeCatalogProduct({
      id: nextProductId,
      restId: storeEntry.id,
      name,
      desc: normalizeText(body.desc, 220),
      price: toWholeNumber(body.price, 0),
      img: normalizeText(body.img, 500),
      veg: body.veg !== false,
      bestseller: Boolean(body.bestseller),
      stock: toWholeNumber(body.stock, 0),
      reorderLevel: Math.max(1, toWholeNumber(body.reorderLevel, 8)),
      category: normalizeCategory(body.category),
      unit: normalizeText(body.unit || 'unit', 24),
      sku: normalizeText(body.sku || `${storeEntry.name.slice(0, 3).toUpperCase()}-${nextProductId}`, 40),
    }, storeEntry.id);

    if (!product || product.price <= 0) return;
    storeEntry.menu.unshift(product);
    createdProducts.push(product);
  });

  if (!createdProducts.length) {
    return sendError(res, 400, 'Enter valid product details and price');
  }

  await writeStore(store);

  const scopedSummary = buildInventorySummary(scopeStoresForAccess(store.catalogStores || [], access));
  sendJson(res, 201, {
    product: createdProducts[0],
    products: createdProducts,
    createdCount: createdProducts.length,
    storeId: createdProducts[0]?.restId || null,
    storeIds: [...new Set(createdProducts.map(entry => Number(entry.restId)))],
    scope: createdProducts.length > 1 ? 'all-stores' : 'single-store',
    summary: scopedSummary,
    access: toAdminAccessPayload(access),
  });
}

async function handleAdminUpdateProduct(req, res, productId) {
  const body = await readJsonBody(req);
  const store = await readStore();
  pruneExpiredSessions(store);

  const access = getAdminAccess(store, req);
  if (!access) {
    return sendError(res, 401, 'Admin session expired. Please unlock the dashboard again.');
  }

  const found = findCatalogProductById(store, productId);
  if (!found) {
    return sendError(res, 404, 'Product not found');
  }
  if (!isStoreAllowedForAccess(access, found.store.id)) {
    return sendError(res, 403, 'Store managers can only manage products in their assigned store.');
  }

  const updates = {};
  if (body.name !== undefined) updates.name = normalizeText(body.name, 120);
  if (body.desc !== undefined) updates.desc = normalizeText(body.desc, 220);
  if (body.price !== undefined) updates.price = toWholeNumber(body.price, 0);
  if (body.img !== undefined) updates.img = normalizeText(body.img, 500);
  if (body.veg !== undefined) updates.veg = Boolean(body.veg);
  if (body.bestseller !== undefined) updates.bestseller = Boolean(body.bestseller);
  if (body.reorderLevel !== undefined) updates.reorderLevel = Math.max(1, toWholeNumber(body.reorderLevel, 1));
  if (body.category !== undefined) updates.category = normalizeCategory(body.category);
  if (body.unit !== undefined) updates.unit = normalizeText(body.unit, 24) || found.product.unit || 'unit';
  if (body.sku !== undefined) updates.sku = normalizeText(body.sku, 40).toUpperCase();

  if (updates.name !== undefined && !updates.name) {
    return sendError(res, 400, 'Product name cannot be empty');
  }
  if (updates.price !== undefined && updates.price <= 0) {
    return sendError(res, 400, 'Price must be greater than zero');
  }

  Object.assign(found.product, updates);
  await writeStore(store);

  const scopedSummary = buildInventorySummary(scopeStoresForAccess(store.catalogStores || [], access));
  sendJson(res, 200, {
    product: found.product,
    storeId: found.store.id,
    summary: scopedSummary,
    access: toAdminAccessPayload(access),
  });
}

async function handleAdminStockUpdate(req, res, productId) {
  const body = await readJsonBody(req);
  const store = await readStore();
  pruneExpiredSessions(store);

  const access = getAdminAccess(store, req);
  if (!access) {
    return sendError(res, 401, 'Admin session expired. Please unlock the dashboard again.');
  }

  const found = findCatalogProductById(store, productId);
  if (!found) {
    return sendError(res, 404, 'Product not found');
  }
  if (!isStoreAllowedForAccess(access, found.store.id)) {
    return sendError(res, 403, 'Store managers can only manage products in their assigned store.');
  }

  const delta = Number(body.delta);
  const nextStockAbsolute = body.stock !== undefined ? toWholeNumber(body.stock, found.product.stock) : null;
  const nextStock = Number.isFinite(nextStockAbsolute)
    ? nextStockAbsolute
    : Number.isFinite(delta)
      ? Math.max(0, found.product.stock + Math.round(delta))
      : null;

  if (!Number.isFinite(nextStock)) {
    return sendError(res, 400, 'Provide either `delta` or `stock` to update inventory');
  }

  found.product.stock = nextStock;
  await writeStore(store);

  const scopedSummary = buildInventorySummary(scopeStoresForAccess(store.catalogStores || [], access));
  sendJson(res, 200, {
    product: found.product,
    storeId: found.store.id,
    summary: scopedSummary,
    access: toAdminAccessPayload(access),
  });
}

async function handleCreateOrder(req, res) {
  const body = await readJsonBody(req);
  const store = await readStore();
  pruneExpiredSessions(store);
  const user = getUserFromStore(store, req);

  if (!user) {
    return sendError(res, 401, 'Your session has expired. Please sign in again.');
  }

  const customer = body.customer || {};
  const name = normalizeText(customer.name, 80);
  const phone = normalizePhone(customer.phone);
  const address = normalizeText(customer.address, 240);
  const note = normalizeText(customer.note, 160);
  const payment = normalizeText(body.payment, 40);
  const restId = toWholeNumber(body.restId, 0);
  const restImg = normalizeText(body.restImg, 500);
  const etaMinutes = Math.min(90, Math.max(10, Number(body.etaMinutes) || 30));
  const incomingItems = normalizeOrderItems(body.items, restId);

  if (!name || !phone || !address) {
    return sendError(res, 400, 'Please fill all required fields');
  }
  if (!/^\d{10}$/.test(phone)) {
    return sendError(res, 400, 'Enter a valid 10-digit phone number');
  }
  if (!incomingItems.length) {
    return sendError(res, 400, 'Your cart is empty');
  }
  if (!payment) {
    return sendError(res, 400, 'Choose a payment method');
  }

  const builtOrderItems = buildOrderItemsFromCatalog(store, incomingItems, restId);
  if (builtOrderItems.error) {
    return sendError(res, 400, builtOrderItems.error);
  }

  const items = builtOrderItems.items;
  const demand = buildInventoryDemand(items);
  const stockCheck = checkInventoryDemand(store, demand);
  if (!stockCheck.ok) {
    return sendError(res, 409, stockCheck.message);
  }

  applyInventoryDemand(store, demand, 'deduct');

  const primaryStore = getCatalogStoreById(store, items[0]?.restId || restId);
  const finalRestId = primaryStore?.id || restId || items[0]?.restId || 0;
  const restName = normalizeText(body.restName, 120) || primaryStore?.name || 'QuickBite Grocery';
  const finalStoreImage = restImg || primaryStore?.img || '';
  const totals = calculateCartTotals(items, body.couponCode);
  const createdAt = Date.now();
  const order = {
    orderId: `QB${createdAt}${crypto.randomInt(100, 1000)}`,
    restId: finalRestId,
    restName,
    restImg: finalStoreImage,
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
  store.orders.unshift(order);

  await writeStore(store);
  sendJson(res, 201, { order, user: sanitizeUser(user) });
}

async function handleGetMyOrders(req, res) {
  const store = await readStore();
  pruneExpiredSessions(store);
  const user = getUserFromStore(store, req);

  if (!user) {
    return sendError(res, 401, 'Your session has expired. Please sign in again.');
  }

  const changed = syncOrderStatuses(store);
  if (changed) await writeStore(store);

  const orders = store.orders
    .filter(order => order.userId === user.id)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  sendJson(res, 200, { orders });
}

async function handleAdminLogin(req, res) {
  const body = await readJsonBody(req);
  const accessType = normalizeText(body.accessType, 20).toLowerCase() === 'store' ? 'store' : 'super';
  const password = String(body.password || '');

  if (!password) {
    return sendError(res, 400, accessType === 'store' ? 'Enter the store password' : 'Enter the admin password');
  }

  const store = await readStore();
  pruneExpiredSessions(store);

  let role = 'super';
  let scopedStoreId = null;
  let scopedStoreName = '';

  if (accessType === 'store') {
    const storeId = toWholeNumber(body.storeId, 0);
    const storeEntry = getCatalogStoreById(store, storeId);
    if (!storeEntry) {
      return sendError(res, 400, 'Choose a valid grocery store');
    }

    const manager = (store.storeManagers || []).find(entry => Number(entry.storeId) === Number(storeId));
    if (!manager || !verifyPassword(password, manager)) {
      return sendError(res, 401, 'Incorrect store password');
    }

    role = 'store';
    scopedStoreId = storeEntry.id;
    scopedStoreName = storeEntry.name;
  } else if (password !== ADMIN_PASSWORD) {
    return sendError(res, 401, 'Incorrect admin password');
  }

  const token = generateToken();
  const now = Date.now();
  store.adminSessions.push({
    token,
    role,
    storeId: scopedStoreId,
    createdAt: now,
    expiresAt: now + ADMIN_SESSION_TTL_MS,
  });

  await writeStore(store);
  sendJson(res, 200, {
    token,
    access: toAdminAccessPayload({
      role,
      storeId: scopedStoreId,
      storeName: scopedStoreName,
    }),
  });
}

async function handleAdminLogout(req, res) {
  const token = getBearerToken(req);
  const store = await readStore();
  pruneExpiredSessions(store);

  if (token) {
    store.adminSessions = store.adminSessions.filter(session => session.token !== token);
    await writeStore(store);
  }

  sendNoContent(res);
}

async function handleGetAdminOrders(req, res) {
  const store = await readStore();
  pruneExpiredSessions(store);

  const access = getAdminAccess(store, req);
  if (!access) {
    return sendError(res, 401, 'Admin session expired. Please unlock the dashboard again.');
  }

  const changed = syncOrderStatuses(store);
  if (changed) await writeStore(store);

  const orders = scopeOrdersForAccess([...store.orders], access)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  sendJson(res, 200, { orders, access: toAdminAccessPayload(access) });
}

async function handleAdminStatusUpdate(req, res, orderId) {
  const body = await readJsonBody(req);
  const nextStatus = normalizeText(body.status, 40);
  const allowedStatuses = new Set(['Pending', 'Confirmed', 'Delivered', 'Cancelled']);

  if (!allowedStatuses.has(nextStatus)) {
    return sendError(res, 400, 'Invalid order status');
  }

  const store = await readStore();
  pruneExpiredSessions(store);

  const access = getAdminAccess(store, req);
  if (!access) {
    return sendError(res, 401, 'Admin session expired. Please unlock the dashboard again.');
  }

  const order = store.orders.find(item => item.orderId === orderId);
  if (!order) {
    return sendError(res, 404, 'Order not found');
  }
  if (!isStoreAllowedForAccess(access, order.restId)) {
    return sendError(res, 403, 'Store managers can only update orders from their assigned store.');
  }

  const wasCancelled = order.status === 'Cancelled';
  const willCancel = nextStatus === 'Cancelled';
  const demand = buildInventoryDemand(order.items || []);

  if (!wasCancelled && willCancel && demand.length) {
    applyInventoryDemand(store, demand, 'add');
    order.stockReverted = true;
  }

  if (wasCancelled && !willCancel && demand.length) {
    const stockCheck = checkInventoryDemand(store, demand);
    if (!stockCheck.ok) {
      return sendError(res, 409, `Cannot reopen this order: ${stockCheck.message}`);
    }

    applyInventoryDemand(store, demand, 'deduct');
    order.stockReverted = false;
  }

  order.status = nextStatus;
  await writeStore(store);
  sendJson(res, 200, { order, access: toAdminAccessPayload(access) });
}

async function handleGetLiveRestaurants(req, res, url) {
  const location = normalizeText(url.searchParams.get('location'), 120);

  if (!location) {
    return sendError(res, 400, 'Please provide a location');
  }

  try {
    const payload = await fetchLiveRestaurants(location);
    sendJson(res, 200, payload);
  } catch (error) {
    console.error('Failed to load live restaurants:', error);
    sendError(res, 502, 'Could not load live restaurants for that location right now');
  }
}

async function handleApiRequest(req, res, url) {
  const { pathname } = url;

  if (req.method === 'GET' && pathname === '/api/health') {
    return sendJson(res, 200, { ok: true });
  }
  if (req.method === 'GET' && pathname === '/api/restaurants') {
    return handleGetLiveRestaurants(req, res, url);
  }
  if (req.method === 'GET' && pathname === '/api/catalog') {
    return handleGetCatalog(req, res, url);
  }

  if (req.method === 'POST' && pathname === '/api/auth/signup') {
    return handleSignup(req, res);
  }
  if (req.method === 'POST' && pathname === '/api/auth/login') {
    return handleLogin(req, res);
  }
  if (req.method === 'GET' && pathname === '/api/auth/me') {
    return handleGetCurrentUser(req, res);
  }
  if (req.method === 'POST' && pathname === '/api/auth/logout') {
    return handleLogout(req, res);
  }
  if (req.method === 'PUT' && pathname === '/api/users/me/profile') {
    return handleProfileUpdate(req, res);
  }
  if (req.method === 'GET' && pathname === '/api/orders/me') {
    return handleGetMyOrders(req, res);
  }
  if (req.method === 'POST' && pathname === '/api/orders') {
    return handleCreateOrder(req, res);
  }
  if (req.method === 'POST' && pathname === '/api/admin/login') {
    return handleAdminLogin(req, res);
  }
  if (req.method === 'POST' && pathname === '/api/admin/logout') {
    return handleAdminLogout(req, res);
  }
  if (req.method === 'GET' && pathname === '/api/admin/me') {
    return handleGetAdminMe(req, res);
  }
  if (req.method === 'GET' && pathname === '/api/admin/orders') {
    return handleGetAdminOrders(req, res);
  }
  if (req.method === 'GET' && pathname === '/api/admin/catalog') {
    return handleGetAdminCatalog(req, res);
  }
  if (req.method === 'POST' && pathname === '/api/admin/products') {
    return handleAdminCreateProduct(req, res);
  }
  if (req.method === 'PATCH' && pathname.startsWith('/api/admin/products/') && pathname.endsWith('/stock')) {
    const productId = toWholeNumber(pathname.split('/')[4], 0);
    return handleAdminStockUpdate(req, res, productId);
  }
  if (req.method === 'PATCH' && pathname.startsWith('/api/admin/products/')) {
    const productId = toWholeNumber(pathname.split('/')[4], 0);
    return handleAdminUpdateProduct(req, res, productId);
  }
  if (req.method === 'PATCH' && pathname.startsWith('/api/admin/orders/') && pathname.endsWith('/status')) {
    const orderId = decodeURIComponent(pathname.split('/')[4] || '');
    return handleAdminStatusUpdate(req, res, orderId);
  }

  sendError(res, 404, 'API route not found');
}

async function serveStatic(req, res, url) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return sendError(res, 405, 'Method not allowed');
  }

  const pathname = url.pathname === '/' ? '/index.html' : url.pathname;
  const filePath = path.resolve(ROOT_DIR, `.${pathname}`);

  if (!filePath.startsWith(ROOT_DIR)) {
    return sendError(res, 403, 'Forbidden');
  }

  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    if (req.method === 'HEAD') {
      res.end();
      return;
    }
    res.end(data);
  } catch {
    if (!path.extname(pathname)) {
      const indexPath = path.join(ROOT_DIR, 'index.html');
      const data = await fs.readFile(indexPath);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
      return;
    }

    sendError(res, 404, 'File not found');
  }
}

async function requestHandler(req, res) {
  try {
    await ensureStoreInitialized();
    applyCors(req, res);

    if (req.method === 'OPTIONS') {
      sendNoContent(res);
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname.startsWith('/api/')) {
      await handleApiRequest(req, res, url);
      return;
    }

    await serveStatic(req, res, url);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = statusCode === 500 ? 'Internal server error' : error.message;
    console.error(error);
    if (!res.headersSent) {
      sendError(res, statusCode, message);
      return;
    }
    res.end();
  }
}

function createServer() {
  return http.createServer((req, res) => {
    requestHandler(req, res).catch(error => {
      console.error(error);
      if (!res.headersSent) {
        sendError(res, 500, 'Internal server error');
        return;
      }
      res.end();
    });
  });
}

async function startServer() {
  await ensureStoreInitialized();
  const server = createServer();

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(PORT, HOST, resolve);
  });

  console.log(`QuickBite server running at http://${HOST}:${PORT}`);
  return server;
}

if (require.main === module) {
  startServer().catch(error => {
    console.error('Failed to start QuickBite server:', error);
    process.exit(1);
  });
}

module.exports = {
  requestHandler,
  createServer,
  startServer,
};
