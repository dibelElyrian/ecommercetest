exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST'
      }
    };
  }

  try {
    const orderData = JSON.parse(event.body);
    console.log('?? Processing TRIOGEL order:', orderData.orderId);
    
    // Your Discord webhook URL - Get this from your Discord server
    const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
    
    if (!DISCORD_WEBHOOK_URL) {
      console.warn('?? Discord webhook URL not configured');
    }

    // Game name mapping for display
    const gameNames = {
      'ml': 'Mobile Legends: Bang Bang',
      'roblox': 'Roblox'
    };

    // Format items list for Discord (clean, no problematic emojis)
    const itemsList = orderData.items.map(item => {
      const gameName = gameNames[item.game] || item.game;
      return `**${item.name}** (${gameName})\nQuantity: ${item.quantity} | Price: $${(item.price * item.quantity).toFixed(2)}`;
    }).join('\n\n');

    // Create rich Discord embed message with clean formatting
    const discordMessage = {
      content: `**:bell: NEW TRIOGEL ORDER RECEIVED!**`,
      embeds: [{
        title: ':shopping_cart: New Gaming Item Order',
        description: `A new order has been placed on TRIOGEL marketplace!`,
        color: 0x667eea, // Purple color matching your site
        fields: [
          {
            name: ':clipboard: Order Information',
            value: `**Order ID:** ${orderData.orderId}\n**Total Amount:** $${orderData.total.toFixed(2)}\n**Date:** ${new Date(orderData.timestamp).toLocaleString()}`,
            inline: false
          },
          {
            name: ':bust_in_silhouette: Customer Details',
            value: `**Email:** ${orderData.customer.email}\n**Game Username:** ${orderData.customer.gameUsername}\n**Region:** ${orderData.customer.serverRegion || 'Not specified'}`,
            inline: true
          },
          {
            name: ':credit_card: Payment & Contact',
            value: `**Payment Method:** ${orderData.paymentMethod}\n**WhatsApp:** ${orderData.customer.whatsappNumber || 'Not provided'}\n**Status:** :hourglass: Pending`,
            inline: true
          },
          {
            name: ':shopping_bags: Items Ordered',
            value: itemsList,
            inline: false
          }
        ],
        footer: {
          text: 'TRIOGEL Gaming Marketplace'
        },
        timestamp: orderData.timestamp
      }]
    };

    // Add special instructions if provided
    if (orderData.customerNotes && orderData.customerNotes.trim()) {
      discordMessage.embeds[0].fields.push({
        name: ':memo: Special Instructions',
        value: orderData.customerNotes,
        inline: false
      });
    }

    // Send to Discord if webhook URL is configured
    if (DISCORD_WEBHOOK_URL) {
      console.log('?? Sending Discord notification...');
      
      const discordResponse = await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(discordMessage)
      });

      if (!discordResponse.ok) {
        const errorText = await discordResponse.text();
        console.error('? Discord webhook failed:', discordResponse.status, errorText);
        throw new Error(`Discord notification failed: ${discordResponse.status}`);
      }

      console.log('? Discord notification sent successfully');
    }

    // Store order data (you could also save to a database here)
    console.log('?? Order processed:', {
      orderId: orderData.orderId,
      total: orderData.total,
      customerEmail: orderData.customer.email,
      itemCount: orderData.items.length
    });

    // Return success response
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Order processed successfully',
        orderId: orderData.orderId,
        discordSent: !!DISCORD_WEBHOOK_URL
      })
    };

  } catch (error) {
    console.error('?? Error processing TRIOGEL order:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Failed to process order', 
        details: error.message,
        orderId: event.body ? JSON.parse(event.body).orderId : 'unknown'
      })
    };
  }
};