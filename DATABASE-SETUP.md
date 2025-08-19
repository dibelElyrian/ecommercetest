# TRIOGEL Database Integration Guide

## ??? **Supabase Database Setup for TRIOGEL**

Your TRIOGEL marketplace now has advanced database integration! Here's how to set it up:

---

## **Step 1: Create Supabase Account & Project**

1. **Go to [supabase.com](https://supabase.com)**
2. **Sign up/Login** with GitHub (recommended)
3. **Create a new project:**
   - Project name: `triogel-marketplace`
   - Database password: Create a strong password
   - Region: Choose closest to your users (e.g., Southeast Asia)

---

## **Step 2: Set Up Database Tables**

In your Supabase dashboard, go to **SQL Editor** and run these commands:

### **Orders Table**
```sql
CREATE TABLE triogel_orders (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(50) UNIQUE NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_game_username VARCHAR(100) NOT NULL,
  customer_whatsapp VARCHAR(20),
  customer_region VARCHAR(100),
  payment_method VARCHAR(50) NOT NULL,
  customer_notes TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  discord_sent BOOLEAN DEFAULT false,
  admin_notes TEXT
);

-- Add indexes for better performance
CREATE INDEX idx_orders_status ON triogel_orders(status);
CREATE INDEX idx_orders_email ON triogel_orders(customer_email);
CREATE INDEX idx_orders_created ON triogel_orders(created_at DESC);
```

### **Order Items Table**
```sql
CREATE TABLE triogel_order_items (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(50) REFERENCES triogel_orders(order_id),
  item_id INTEGER NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  item_game VARCHAR(20) NOT NULL,
  item_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL
);

CREATE INDEX idx_order_items_order ON triogel_order_items(order_id);
```

### **Customers Table**
```sql
CREATE TABLE triogel_customers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  game_username VARCHAR(100),
  whatsapp VARCHAR(20),
  preferred_region VARCHAR(100),
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0.00,
  first_order_date TIMESTAMP,
  last_order_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_email ON triogel_customers(email);
```

---

## **Step 3: Configure Netlify Environment Variables**

In your Netlify dashboard:

1. **Go to Site Settings** ? **Environment Variables**
2. **Add these variables:**

| Key | Value | Description |
|-----|-------|-------------|
| `SUPABASE_URL` | `https://your-project.supabase.co` | Your project URL |
| `SUPABASE_ANON_KEY` | `eyJ...` | Your anon/public API key |
| `DISCORD_WEBHOOK_URL` | `https://discord.com/api/webhooks/...` | Your existing Discord webhook |

**Where to find Supabase credentials:**
- Go to **Settings** ? **API** in your Supabase dashboard
- Copy the **Project URL** and **anon public** key

---

## **Step 4: Test Database Integration**

After deploying your updated functions, test with browser console:

```javascript
async function testDatabaseIntegration() {
  const testOrder = {
    orderId: 'DB-TEST-' + Date.now(),
    timestamp: new Date().toISOString(),
    customer: {
      gameUsername: 'DatabaseTester',
      email: 'dbtest@triogel.com',
      whatsappNumber: '+1234567890',
      serverRegion: 'Southeast Asia'
    },
    paymentMethod: 'paypal',
    customerNotes: 'Testing database integration',
    items: [{
      id: 3,
      name: 'Starlight Pass (Season)',
      game: 'ml',
      price: 12.99,
      quantity: 1
    }],
    total: 12.99
  };

  const response = await fetch('/.netlify/functions/process-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testOrder)
  });
  
  const result = await response.json();
  console.log('Database test result:', result);
  
  if (result.databaseSaved) {
    console.log('? Database integration working!');
  } else {
    console.log('? Database not configured or failed');
  }
}

testDatabaseIntegration();
```

---

## **Step 5: What You Get**

### **?? Order Management**
- All orders automatically saved to database
- Discord notifications still work
- Customer information tracked
- Order status management
- Sales analytics ready

### **?? Data Tracking**
- **Orders:** ID, customer, items, status, timestamps
- **Customers:** Purchase history, contact info, spending
- **Items:** Sales tracking per game/item
- **Revenue:** Total sales, pending orders

### **?? Real-time Updates**
- Orders update instantly in database
- Customer records automatically maintained
- Full audit trail of all transactions

---

## **Step 6: Next Features to Add**

With database ready, you can now add:

1. **Admin Panel** - View and manage orders
2. **Order Status Updates** - Mark as processing/completed
3. **Customer Lookup** - Search by email/order ID
4. **Sales Reports** - Revenue analytics
5. **Inventory Tracking** - Stock management

---

## **?? Troubleshooting**

### **Database Not Saving?**
1. Check Netlify environment variables are set correctly
2. Verify Supabase URL and API key
3. Check Netlify function logs for database errors
4. Ensure tables are created in Supabase

### **Discord Still Works, DB Doesn't?**
- This is by design! Discord notifications continue even if database fails
- Check Supabase dashboard for connection issues
- Verify table names match exactly

### **Need Help?**
- Check Supabase logs in dashboard
- Use Netlify function logs for debugging
- Test database queries in Supabase SQL editor

---

**?? Your TRIOGEL marketplace now has enterprise-level order management!**

Deploy these changes to GitHub and test the database integration. You'll have full order tracking alongside your existing Discord notifications.