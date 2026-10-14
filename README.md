<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0F172A,100:2563EB&height=200&section=header&text=WebApp%20Project%20RK%20Jewellers&fontSize=45&fontColor=FFFFFF&animation=fadeIn&fontAlignY=35" alt="Learning Resources Banner"/>
</p>

# Live Website link: https://rk-jewelers-phi.vercel.app/

RK Jewellery Web App
A responsive jewellery storefront and owner dashboard for a Bangladesh-based shop. Customers browse products, submit inquiries, place orders, and track order status. Owners manage inventory, orders, messages, market rates, and sales analytics. The interface supports English and Bangla, with prices in Bangladeshi Taka (BDT).
Main Features
- Storefront: Search, category/metal filters, featured and price sorting, product image galleries, and jewellery specifications.
- Checkout: Single-product orders with size/length, optional engraving, delivery details, special requirements, and Cash on Delivery.
- Customer support: Product/general inquiries, order-number tracking, and a floating WhatsApp contact button.
- Owner dashboard: Add, edit, and delete products; update prices, stock quantities, and availability; manage orders and reply to inquiries.
- Rates and analytics: Editable gold/silver rates per gram and vhori, order-value charts, order counts, and inventory valuation.
- Alerts: Saved in-app alerts, audio chimes, and browser notifications when permission is granted.
Tech Stack
React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Motion, and browser localStorage. A standalone Three.js jewellery viewer is included but is not connected to the current storefront.
Setup
Extract the project ZIP, then run inside the project folder:
cd Project-Jewellery-Web-App-main
bun install
bun run dev
Open http://localhost:3000. Bun uses the included bun.lock; alternatively, use Node.js/npm with npm install and npm run dev.
The current app does not require API credentials. .env.example contains Gemini/hosting placeholders, but no Gemini API calls or backend endpoints are implemented.
Command	Purpose
bun run dev	Start the development server on port 3000
bun run lint	Run TypeScript checks
bun run build	Build the app into dist/
bun run preview	Preview the production build locally


Full Project Workflow
1. Initialize: Load products, orders, inquiries, rates, language, and owner session from browser storage. First use seeds five sample products and preset rates; orders and inquiries start empty.
2. Browse: Choose English/Bangla, inspect rates, search/filter/sort the catalogue, and open a product to view images and specifications.
3. Ask or order: Submit a product/general inquiry, contact the shop through WhatsApp, or open checkout for one product with quantity one.
4. Submit checkout: Enter contact and shipping details, choose size/length, add optional customization, and submit the COD order. The app saves a pending order, generates an order number, and records an alert.
5. Owner access: Open the owner portal and enter an email from AUTHORIZED_OWNER_EMAILS in src/services/storage.ts.
6. Manage fulfilment: Review orders and update their status through pending → confirmed → in-crafting → shipped → delivered. Manage stock separately; placing an order does not automatically reduce inventory.
7. Handle inquiries: New messages are saved with status new; owner replies are appended to the conversation and change the status to replied.
8. Maintain and track: Owners update listings, market rates, and the WhatsApp number, review analytics/alerts, or reload sample products. Customers return to the storefront and search their order number to see its saved status.

# Project Structure
Path	Responsibility
src/App.tsx	Storefront, filters, tracking, and owner-view switching
src/components/	Product, checkout, inquiry, dashboard, chart, and viewer interfaces
src/services/storage.ts	Product/order/inquiry persistence and owner access
src/services/marketRates.ts	Rate storage, updates, weight conversion, and BDT formatting
src/services/pushNotification.ts, audioAlert.ts	Local alerts and notification sounds
src/i18n/translations.ts	English and Bangla interface text


Current Implementation Notes
- This is a browser-based demo: no backend/database or shared customer-owner data across devices. Clearing browser storage removes saved data.
- Owner access checks a client-side email allowlist without a password or email verification.
- Checkout records COD orders; it does not process online payments. Market rates are presets/manual updates, not a live BAJUS feed.
- Notifications run locally, with no remote push service. Uploaded images are stored as data URLs and count toward browser storage limits.
