# TRIOGEL Gaming Marketplace - Testing Discord Notifications

## ?? Quick Start Guide

Your TRIOGEL marketplace is now connected to GitHub and Netlify! Here's how to test Discord notifications:

### Step 1: Set Up Discord Webhook
1. Go to your Discord server
2. Right-click the channel where you want notifications
3. Go to **Edit Channel** ? **Integrations** ? **Webhooks**  
4. Click **Create Webhook**
5. Copy the webhook URL

### Step 2: Configure Netlify Environment Variable
1. Go to your Netlify dashboard
2. Select your TRIOGEL site
3. Go to **Site settings** ? **Environment variables**
4. Click **Add a variable**
5. Set:
   - **Key:** `DISCORD_WEBHOOK_URL`
   - **Value:** Your Discord webhook URL

### Step 3: Deploy Your Changes
Since GitHub is connected to Netlify, you just need to push to GitHub:

```bash
git add .
git commit -m "Add Discord notification function"
git push origin main
```

Netlify will automatically deploy your changes!

### Step 4: Test the System

#### Option A: Live Test on Website
1. Visit your live TRIOGEL site
2. Add items to cart
3. Complete checkout with test data
4. Check your Discord channel for notification

#### Option B: Browser Console Test
1. Open your website
2. Press F12 ? Console tab
3. Paste and run this test code:

```javascript
async function testDiscordNotification() {
  const testOrder = {
    orderId: 'TEST-' + Date.now(),
    timestamp: new Date().toISOString(),
    customer: {
      gameUsername: 'TestGamer123',
      email: 'test@example.com',
      whatsappNumber: '+1234567890',
      serverRegion: 'Southeast Asia'
    },
    paymentMethod: 'paypal',
    customerNotes: 'Discord test order',
    items: [{
      id: 1,
      name: 'Epic Skin - Fanny',
      game: 'ml',
      price: 34.99,
      quantity: 1
    }],
    total: 34.99
  };

  const response = await fetch('/.netlify/functions/process-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testOrder)
  });
  
  console.log('Status:', response.status);
  console.log('Result:', await response.json());
}

testDiscordNotification();
```

### Step 5: Check Results
- ? **Success:** You'll see a rich Discord embed with order details
- ? **Failed:** Check Netlify function logs for errors

## ?? Expected Discord Notification

Your Discord will receive a beautiful embed with:
- ?? Order ID and total amount
- ?? Customer details (email, username, region)
- ?? Payment method and WhatsApp
- ??? List of items ordered with prices
- ?? Special instructions (if any)
- ? Order timestamp

## ?? Troubleshooting

### Function Not Working?
1. Check Netlify deploy logs
2. Verify webhook URL is correct
3. Make sure Discord channel allows webhooks

### Still Getting Errors?
1. Check browser Network tab during checkout
2. Look at Netlify function logs
3. Verify environment variable is set

## ?? Your TRIOGEL Features

- ? Mobile Legends & Roblox items
- ?? Shopping cart system
- ?? Multiple payment methods
- ?? WhatsApp coordination
- ?? Discord notifications
- ?? Mobile responsive design

Happy testing! ??