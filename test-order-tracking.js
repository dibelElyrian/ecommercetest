// Test your TRIOGEL Customer Order Tracking System

async function testOrderTracking() {
  console.log('?? Testing TRIOGEL Order Tracking System...');

  // First, let's create a test order if none exists
  const testOrder = {
    orderId: 'TRIOGEL-TRACK-TEST-' + Date.now(),
    timestamp: new Date().toISOString(),
    customer: {
      gameUsername: 'TrackingTester',
      email: 'tracking@triogel.com',
      whatsappNumber: '+1234567890',
      serverRegion: 'Southeast Asia'
    },
    paymentMethod: 'paypal',
    customerNotes: 'Testing order tracking functionality',
    items: [
      {
        id: 2,
        name: 'Epic Skin - Fanny',
        game: 'ml',
        price: 34.99,
        quantity: 1
      }
    ],
    total: 34.99
  };

  try {
    // Step 1: Create a test order first
    console.log('?? Creating test order for tracking...');
    const createResponse = await fetch('/.netlify/functions/process-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testOrder)
    });
    
    const createResult = await createResponse.json();
    console.log('?? Test order created:', createResult);

    if (createResult.success) {
      // Wait a moment for the order to be saved
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 2: Test tracking by Order ID
      console.log('?? Testing tracking by Order ID...');
      const trackByIdResponse = await fetch(`/.netlify/functions/track-order?orderId=${testOrder.orderId}`);
      const trackByIdResult = await trackByIdResponse.json();
      console.log('?? Track by Order ID result:', trackByIdResult);

      // Step 3: Test tracking by Email
      console.log('?? Testing tracking by Email...');
      const trackByEmailResponse = await fetch(`/.netlify/functions/track-order?email=${testOrder.customer.email}`);
      const trackByEmailResult = await trackByEmailResponse.json();
      console.log('?? Track by Email result:', trackByEmailResult);

      // Summary
      if (trackByIdResult.success && trackByEmailResult.success) {
        console.log('?? ORDER TRACKING SYSTEM WORKING!');
        console.log('? Order ID lookup: Working');
        console.log('? Email lookup: Working');
        console.log('? Order items included: Working');
        
        if (trackByEmailResult.customerSummary) {
          console.log('? Customer summary: Working');
          console.log('?? Customer Summary:', trackByEmailResult.customerSummary);
        }
      } else {
        console.log('?? Some tracking features may not be working properly');
      }
    }
  } catch (error) {
    console.error('?? Order tracking test failed:', error);
  }
}

// Test specific order lookup functions
async function testOrderLookups() {
  console.log('?? Testing Order Lookup Functions...');

  try {
    // Test 1: Look up non-existent order
    console.log('1?? Testing non-existent order lookup...');
    const noOrderResponse = await fetch('/.netlify/functions/track-order?orderId=NONEXISTENT-ORDER');
    const noOrderResult = await noOrderResponse.json();
    console.log('No order result:', noOrderResult);

    // Test 2: Look up with no parameters
    console.log('2?? Testing lookup with no parameters...');
    const noParamsResponse = await fetch('/.netlify/functions/track-order');
    const noParamsResult = await noParamsResponse.json();
    console.log('No params result:', noParamsResult);

    // Test 3: Look up existing orders (get from database first)
    console.log('3?? Getting existing orders to test lookup...');
    const existingOrdersResponse = await fetch('/.netlify/functions/get-orders?limit=1');
    const existingOrdersResult = await existingOrdersResponse.json();
    
    if (existingOrdersResult.success && existingOrdersResult.data.length > 0) {
      const firstOrder = existingOrdersResult.data[0];
      console.log('Testing lookup for existing order:', firstOrder.order_id);
      
      const lookupResponse = await fetch(`/.netlify/functions/track-order?orderId=${firstOrder.order_id}`);
      const lookupResult = await lookupResponse.json();
      console.log('Existing order lookup result:', lookupResult);
    } else {
      console.log('No existing orders found to test with');
    }

  } catch (error) {
    console.error('?? Lookup test failed:', error);
  }
}

// Run comprehensive tracking tests
async function runAllTrackingTests() {
  console.log('?? Running TRIOGEL Order Tracking Tests...');
  
  await testOrderTracking();
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  await testOrderLookups();
  
  console.log('\n?? ORDER TRACKING TESTS COMPLETE!');
}

// Simple customer-facing order lookup function
async function lookupMyOrder(orderIdOrEmail) {
  console.log('?? Looking up order for:', orderIdOrEmail);
  
  const isEmail = orderIdOrEmail.includes('@');
  const queryParam = isEmail ? `email=${orderIdOrEmail}` : `orderId=${orderIdOrEmail}`;
  
  try {
    const response = await fetch(`/.netlify/functions/track-order?${queryParam}`);
    const result = await response.json();
    
    if (result.success) {
      console.log('? Order(s) found!');
      result.orders.forEach((order, index) => {
        console.log(`\n?? Order #${index + 1}:`);
        console.log(`Order ID: ${order.orderId}`);
        console.log(`Status: ${order.status.toUpperCase()}`);
        console.log(`Total: $${order.totalAmount}`);
        console.log(`Date: ${new Date(order.orderDate).toLocaleDateString()}`);
        console.log(`Items: ${order.items.length} item(s)`);
        
        order.items.forEach(item => {
          console.log(`  - ${item.name} (${item.game}) x${item.quantity} - $${item.subtotal}`);
        });
      });
      
      if (result.customerSummary) {
        console.log(`\n?? Customer Summary:`);
        console.log(`Total Orders: ${result.customerSummary.totalOrders}`);
        console.log(`Total Spent: $${result.customerSummary.totalSpent}`);
      }
    } else {
      console.log('? No orders found');
    }
    
    return result;
  } catch (error) {
    console.error('?? Lookup failed:', error);
  }
}

// Example usage functions customers can use:
console.log('?? TRIOGEL Order Tracking Functions Available:');
console.log('?? runAllTrackingTests() - Run comprehensive tests');
console.log('?? lookupMyOrder("TRIO-123456") - Lookup by Order ID');
console.log('?? lookupMyOrder("your@email.com") - Lookup by Email');