[empty file]
# LilyBlock Online Shop – Ecommerce Site

This is a simple, production-ready ecommerce website for selling in-game items (Mobile Legends, Roblox, etc.), built for easy solo development and maintainability.

## Project Structure

```
ecommercesite/
│
├── index.html                # Main entry point, all UI sections and modals
├── assets/
│   ├── css/
│   │   └── main.css          # All site and mobile styles (media queries at bottom)
│   ├── js/
│   │   ├── main.js           # Main frontend logic: item display, cart, filters, modals
│   │   ├── auth.js           # User authentication (login, register, session, admin check)
│   │   └── admin-utils.js    # Admin panel utilities (contact, notifications)
│   └── img/                  # Site images, icons, favicon
│
├── netlify/
│   └── functions/
│       ├── get-items.js          # Public: fetch items from Supabase
│       ├── process-order.js      # Public: handle checkout, payment, order creation
│       ├── track-order.js        # Public: order tracking
│       ├── get-orders.js         # User: fetch order history
│       ├── user-auth.js          # User: login/register/auth
│       ├── admin-auth.js         # Admin: verify admin status
│       ├── admin-api.js          # Admin: CRUD for items/orders/users/analytics
│       ├── update-order-status.js # Admin: update order status
│       └── package.json          # Netlify function dependencies
│
├── supabase-schemas.md       # Database schema reference (items, orders, users)
├── package.json              # Project dependencies (frontend only)
├── netlify.toml              # Netlify deployment config
├── localrun.bat              # Local dev server script
├── .github/copilot-instructions.md # Copilot usage instructions
└── README.md                 # This file
```

## Core Flow

**Frontend (HTML/JS/CSS):**
- `index.html` contains all UI sections, modals, and navigation (desktop & mobile).
- `main.js` handles:
	- Fetching/displaying items (`get-items.js`)
	- Cart logic, checkout, order summary
	- Filter buttons (desktop/mobile)
	- Modal open/close logic
	- Currency selector (with live rates)
	- User dropdown, profile, order history
- `auth.js` manages:
	- Login/register forms
	- Session management
	- Admin verification (calls `admin-auth.js`)
- `admin-utils.js` provides admin panel helpers.

**Backend (Netlify Functions):**
- All API endpoints are in `netlify/functions/` and use Supabase for data.
- Public endpoints: `get-items.js`, `process-order.js`, `track-order.js`
- User endpoints: `user-auth.js`, `get-orders.js`
- Admin endpoints: `admin-auth.js`, `admin-api.js`, `update-order-status.js`
- All endpoints return JSON and handle CORS.

**Database:**
- Supabase tables: `items`, `orders`, `users`
- See `supabase-schemas.md` for schema details.

## How to Track/Change Features

- **Frontend UI:** Edit `index.html` for structure, `main.css` for styles, and `main.js` for logic.
- **Mobile Design:** All mobile-specific styles are at the bottom of `main.css` under `@media (max-width: 768px)`.
- **Cart/Checkout:** Logic in `main.js`, backend in `process-order.js`.
- **Authentication:** Forms in `index.html`, logic in `auth.js`, backend in `user-auth.js`.
- **Admin Panel:** UI in `index.html`, logic in `main.js`/`admin-utils.js`, backend in `admin-api.js`.
- **API/Database:** All Netlify functions in `netlify/functions/`, Supabase config via environment variables.

## How Copilot Should Work Here

- Always check all files in the workspace before making changes.
- Respect the separation of concerns: HTML for structure, CSS for styles, JS for logic.
- For new features, provide full code blocks for HTML, CSS, and JS as needed.
- For fixes, rewrite the complete affected section/file.
- Use the README and folder structure to find the right files for any feature or bug.

## Manual Test Checklist

- [ ] Product listing loads and filters work (desktop/mobile)
- [ ] Cart add/remove/checkout works
- [ ] Currency selector updates prices
- [ ] Login/register/auth flows work
- [ ] Order history and tracking work
- [ ] Admin panel functions (CRUD, analytics) work for admins
- [ ] All modals open/close correctly
- [ ] Mobile navigation/buttons are touch-friendly
- [ ] No secrets or sensitive data exposed in frontend
- [ ] Inputs are validated/sanitized before sending to backend

---

This README is designed for fast onboarding and for Copilot to easily track, change, and understand the flow of the website. Update this file whenever you add new features or change the structure.
