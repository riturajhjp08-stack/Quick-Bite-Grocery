# QuickBite Grocery — Full Online Grocery Management System
### Full Stack Web Project

## Overview
QuickBite Grocery is a full online grocery ordering and management system built with HTML, CSS, vanilla JavaScript, and a Node.js backend.

The UI keeps the original QuickBite design style, while the product logic is now grocery-first:
- Multi-store grocery catalog
- Product inventory with stock levels
- Real user auth + persistent sessions
- Cart, coupons, checkout, order tracking, reorder
- Admin dashboard for both order operations and inventory management

## Tech Stack
- Frontend: HTML5, CSS3, Vanilla JavaScript
- Backend: Node.js HTTP server (`server.js`)
- Storage:
  - Local default: SQLite (`data/store.db`) with automatic JSON mirror (`data/store.json`)
  - Vercel: Vercel KV (`@vercel/kv`) recommended for persistence

### Storage Modes
- `Vercel KV` (if `KV_REST_API_URL` and `KV_REST_API_TOKEN` are set) is used as primary storage.
- Otherwise, local runtime uses `SQLite` as primary storage and keeps `data/store.json` synced as a readable backup/export.
- If SQLite is disabled or unavailable, backend falls back to JSON file storage.

Useful env vars:
- `QB_ENABLE_SQLITE=0` to force-disable SQLite and use JSON file only.
- `QB_SQLITE_PATH=/custom/path/quickbite.db` to change SQLite file path.

## Main Features

### Customer Side
- Grocery store discovery by location
- Category filters and fast search
- Product-level stock visibility
- Stock-safe cart and checkout
- Coupon system (`FIRST50`, `SAVE20`, `FREEDEL`)
- Order history, live progress, reorder

### Admin Side
- Password-protected admin login
- Order status operations (Pending, Confirmed, Delivered, Cancelled)
- Live inventory metrics (total products, low stock, out of stock, value)
- Low-stock alerts
- Quick stock adjust actions (+/-)
- Add new products from dashboard

## Run Locally
1. Open the project folder in terminal
2. Run:
   ```bash
   npm start
   ```
3. Open:
   - `http://localhost:3000`

If backend is unreachable, the app now auto-switches to a local demo backend mode in-browser, so ordering and admin inventory management still work with demo grocery data.

Backend entry file in project root:
- `backend.js` (loads `server.js`)

## Deploy To Vercel
This project is now Vercel-ready with:
- `api/index.js` as the serverless API entry
- `api/[...route].js` catch-all route for `/api/*`

### Steps
1. Push this folder to GitHub.
2. Import the repo in Vercel.
3. Set Environment Variables:
   - `QB_ADMIN_PASSWORD` (required, strong secret)
   - `KV_REST_API_URL` and `KV_REST_API_TOKEN` (recommended for persistent data)
4. Deploy.

### Important Notes
- Without Vercel KV, the app falls back to volatile in-memory storage on Vercel Functions (non-persistent across cold starts).
- Frontend and API use same-origin routes on deployed environments (`/api/...`).

### Admin Password
- `QuickBite@2026`

### Store Manager Passwords
- Each store can now log in separately as a **Store Manager**.
- Default pattern: `Store<StoreId>@QB`
- Example: for store ID `301`, password is `Store301@QB`
- Store managers can only:
  - View orders for their own store
  - Manage inventory for their own store
  - Add products to their own store

### Super Admin Center
- Super admin can monitor all store activity in one dashboard.
- Super admin can add products to:
  - A selected store, or
  - **All stores at once** from the Add Grocery tab.

## Project Structure
```text
QuickBite/
├── api/
│   ├── index.js
│   └── [...route].js
├── index.html
├── style.css
├── app.js
├── server.js
├── data/
│   ├── store.db
│   └── store.json
├── package.json
└── README.md
```
