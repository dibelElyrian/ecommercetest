# TRIOGEL Database Setup Guide - Supabase Integration

## Overview
Your TRIOGEL marketplace now has full database integration with Supabase for order management, customer tracking, and analytics.

## Environment Variables Required

Add these to your Netlify environment variables:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
DISCORD_WEBHOOK_URL=your_discord_webhook_url
GCASH_NUMBER=your_gcash_number
GCASH_NAME=your_gcash_account_name
```

## Database Schema

### Tables Created in Supabase:

#### 1. triogel_orders
```sql
CREATE TABLE triogel_orders (
    id SERIAL PRIMARY KEY,
    order_id TEXT UNIQUE NOT NULL,
    customer_email TEXT NOT NULL,
    customer_game_username TEXT NOT NULL,
    customer_whatsapp TEXT,
    customer_region TEXT,
    payment_method TEXT NOT NULL,
    customer_notes TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending',
    discord_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    payment_reference TEXT,
    payment_amount_php DECIMAL(10,2),
    payment_gcash_number TEXT
);
```

#### 2. triogel_order_items
```sql
CREATE TABLE triogel_order_items (
    id SERIAL PRIMARY KEY,
    order_id TEXT REFERENCES triogel_orders(order_id),
    item_id INTEGER NOT NULL,
    item_name TEXT NOT NULL,
    item_game TEXT NOT NULL,
    item_price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 3. triogel_customers
```sql
CREATE TABLE triogel_customers (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    game_username TEXT,
    whatsapp TEXT,
    preferred_region TEXT,
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,
    first_order_date TIMESTAMP WITH TIME ZONE,
    last_order_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Setup Instructions

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy your project URL and anon key

### Step 2: Run Database Schema
1. Go to Supabase Dashboard ? SQL Editor
2. Run the table creation scripts above
3. Verify tables are created correctly

### Step 3: Configure Environment Variables
Add the Supabase credentials to your Netlify environment variables.

### Step 4: Test Database Integration
Your orders will now be automatically saved to Supabase while maintaining Discord notifications.

## Features You Get

- **Order Management**: All orders saved with full details
- **Customer Tracking**: Automatic customer profile creation
- **Order History**: Complete order tracking per customer
- **Analytics Ready**: Data structure ready for reporting
- **Backup**: Orders saved even if Discord fails

## Order Processing Flow

1. Customer places order ? Netlify function processes
2. Order saved to Supabase database
3. Discord notification sent
4. GCash payment instructions generated (if applicable)
5. Customer and order tracking updated

## Admin Queries

### View Recent Orders
```sql
SELECT 
    order_id,
    customer_email,
    total_amount,
    status,
    created_at
FROM triogel_orders 
ORDER BY created_at DESC 
LIMIT 10;
```

### Customer Summary
```sql
SELECT 
    email,
    total_orders,
    total_spent,
    last_order_date
FROM triogel_customers 
ORDER BY total_spent DESC;
```

### Order Details
```sql
SELECT 
    o.order_id,
    o.customer_email,
    o.total_amount,
    o.status,
    oi.item_name,
    oi.quantity,
    oi.subtotal
FROM triogel_orders o
JOIN triogel_order_items oi ON o.order_id = oi.order_id
WHERE o.order_id = 'TRIO-1234567890';
```

Your TRIOGEL marketplace now has enterprise-level order management!