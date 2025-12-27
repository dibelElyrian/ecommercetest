# LilyBlock Online Shop

A production-ready, serverless ecommerce site for in-game items (Mobile Legends, Roblox, etc.). Built for simplicity and maintainability using vanilla HTML/JS, Netlify Functions, and Supabase.

## 🛠 Tech Stack

- **Frontend:** HTML5, Modular CSS, Vanilla JavaScript
- **Backend:** Netlify Functions (Node.js)
- **Database:** Supabase (PostgreSQL)
- **Hosting:** Netlify

## 📂 Project Structure

```text
ecommercesite/
├── index.html                # Single Page Application entry point
├── assets/
│   ├── css/                  # Modular styles (main.css, mobile-overrides.css, etc.)
│   ├── js/                   # Logic: main.js (UI/Cart), auth.js (User), admin-utils.js
│   └── img/                  # Static assets
├── netlify/
│   └── functions/            # Serverless API endpoints (Auth, Orders, Items)
├── supabase-schemas.md       # Database schema documentation
└── localrun.bat              # Local development script
```

## 🚀 Core Workflows

### Frontend
- **UI:** `index.html` composes the view. Styles are split into modules in `assets/css/` (e.g., `item.css`, `modal.css`).
- **Logic:** `main.js` handles the shopping cart, product rendering, and UI interactions.
- **Auth:** `auth.js` manages user sessions and admin checks.

### Backend (API)
- **Public:** `get-items.js` (fetch products), `process-order.js` (checkout), `track-order.js`.
- **Admin:** `admin-api.js` (CRUD operations), `update-order-status.js`.
- **Auth:** `user-auth.js` and `admin-auth.js` handle secure authentication via Supabase.

## 💻 Development Guide

1.  **Styling:** Edit specific files in `assets/css/`. `mobile-overrides.css` handles responsive adjustments.
2.  **Features:**
    -   **New Product Logic:** Update `main.js` (frontend) and `admin-api.js` (backend).
    -   **Checkout Flow:** Update `process-order.js`.
3.  **Testing:** Use `localrun.bat` to serve locally.

## ✅ Quick Checklist
- [ ] **Products:** Load correctly with filters.
- [ ] **Cart:** Add/Remove items, Currency conversion.
- [ ] **Auth:** Login/Register flows (User & Admin).
- [ ] **Mobile:** Check responsive layout and touch targets.
