// Test Discord Notification Function for TRIOGEL
// This function will process orders and send Discord notifications

console.log('?? TRIOGEL Discord Function Loaded');

async function testDiscordNotification() {
  const testOrderData = {
    orderId: 'TEST-' + Date.now(),
    timestamp: new Date().toISOString(),
    customer: {
      gameUsername: 'TestPlayer123',
      email: 'test@triogel.com',
      whatsappNumber: '+1234567890',
      serverRegion: 'Southeast Asia'
    },
    paymentMethod: 'PayPal',
    customerNotes: 'Test order for Discord integration',
    items: [
      {
        id: 1,
        name: 'Epic Skin - Fanny',
        game: 'ml',
        price: 34.99,
        quantity: 1
      }
    ],
    total: 34.99
  };

  try {
    const response = await fetch('/.netlify/functions/process-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testOrderData)
    });

    console.log('Test response status:', response.status);
    const result = await response.json();
    console.log('Test result:', result);
    
    if (response.ok) {
      console.log('? Discord notification test successful!');
      alert('? Discord notification test successful! Check your Discord channel.');
    } else {
      console.error('? Test failed:', result);
      alert('? Test failed. Check console for details.');
    }
  } catch (error) {
    console.error('? Test error:', error);
    alert('? Test error: ' + error.message);
  }
}

// Add test button to page when DOM loads
document.addEventListener('DOMContentLoaded', function() {
  // Create test button
  const testButton = document.createElement('button');
  testButton.innerHTML = '?? Test Discord Notification';
  testButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    background: linear-gradient(45deg, #ff6b35, #f7931e);
    color: white;
    border: none;
    padding: 15px 25px;
    border-radius: 50px;
    cursor: pointer;
    font-weight: 700;
    font-size: 14px;
    z-index: 9999;
    box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
    transition: all 0.3s ease;
  `;
  
  testButton.addEventListener('mouseover', () => {
    testButton.style.transform = 'translateY(-3px)';
    testButton.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.4)';
  });
  
  testButton.addEventListener('mouseout', () => {
    testButton.style.transform = 'translateY(0)';
    testButton.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.3)';
  });
  
  testButton.onclick = testDiscordNotification;
  
  document.body.appendChild(testButton);
  
  console.log('?? Test button added - click to test Discord notifications');
});