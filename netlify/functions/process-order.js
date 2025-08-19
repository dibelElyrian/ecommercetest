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

  try {
    const orderData = JSON.parse(event.body);
    console.log('📦 Processing TRIOGEL order:', orderData.orderId);
    
    // Environment variables for integrations
    const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
    const GCASH_NUMBER = process.env.GCASH_NUMBER; // Your personal GCash number
    const GCASH_NAME = process.env.GCASH_NAME; // Your GCash account name
    const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '+639171234567'; // Support WhatsApp
    
    if (!DISCORD_WEBHOOK_URL) {
      console.warn('⚠️ Discord webhook URL not configured');
    }
    
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.warn('⚠️ Supabase database not configured');
    }

    if (!GCASH_NUMBER) {
      console.warn('⚠️ GCash number not configured - manual GCash payments disabled');
    }

    // Handle Manual GCash Processing
    let paymentResult = null;
    if (orderData.paymentMethod === 'gcash') {
      try {
        console.log('💳 Setting up manual GCash payment...');
        
        // Generate unique payment reference
        const paymentReference = `TRIO-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
        
        // Convert USD to PHP (approximate rate: 1 USD = 55 PHP)
        const phpAmount = orderData.total.toFixed(2); // Prices are already in PHP now
        
        if (GCASH_NUMBER && GCASH_NAME) {
          paymentResult = {
            success: true,
            payment_type: 'manual_gcash',
            reference: paymentReference,
            amount_php: phpAmount,
            amount_usd: orderData.total.toFixed(2),
            gcash_number: GCASH_NUMBER,
            gcash_name: GCASH_NAME,
            whatsapp_number: WHATSAPP_NUMBER,
            instructions: `Send ₱${phpAmount} to GCash ${GCASH_NUMBER} (${GCASH_NAME}) with reference: ${paymentReference}`
          };
          console.log('✅ Manual GCash payment setup created');
        } else {
          paymentResult = {
            success: false,
            error: 'GCash account details not configured'
          };
        }
      } catch (error) {
        console.error('💥 GCash setup error:', error);
        paymentResult = {
          success: false,
          error: error.message
        };
      }
    }

    // Game name mapping for display
    const gameNames = {
      'ml': 'Mobile Legends: Bang Bang',
      'roblox': 'Roblox'
    };

    // Format items list for Discord
    const itemsList = orderData.items.map(item => {
      const gameName = gameNames[item.game] || item.game;
      return `**${item.name}** (${gameName})\nQuantity: ${item.quantity} | Price: ₱${(item.price * item.quantity).toFixed(2)}`;
    }).join('\n\n');

    // Create rich Discord embed message
    const discordMessage = {
      content: `**:bell: NEW TRIOGEL ORDER RECEIVED!**`,
      embeds: [{
        title: ':shopping_cart: New Gaming Item Order',
        description: `A new order has been placed on TRIOGEL virtual items marketplace!`,
        color: 0x667eea,
        fields: [
          {
            name: ':clipboard: Order Information',
            value: `**Order ID:** ${orderData.orderId}\n**Total Amount:** ₱${orderData.total.toFixed(2)} (${paymentResult?.amount_php ? '₱' + paymentResult.amount_php : 'N/A'})\n**Date:** ${new Date(orderData.timestamp).toLocaleString()}`,
            inline: false
          },
          {
            name: ':bust_in_silhouette: Customer Details',
            value: `**Email:** ${orderData.customer.email}\n**Game Username:** ${orderData.customer.gameUsername}\n**Region:** ${orderData.customer.serverRegion || 'Not specified'}`,
            inline: true
          },
          {
            name: ':credit_card: Payment & Contact',
            value: `**Payment Method:** ${orderData.paymentMethod.toUpperCase()}\n**WhatsApp:** ${orderData.customer.whatsappNumber || 'Not provided'}\n**Status:** ${paymentResult?.success ? ':moneybag: GCash Instructions Sent' : ':hourglass: Pending'}`,
            inline: true
          },
          {
            name: ':shopping_bags: Items Ordered',
            value: itemsList,
            inline: false
          }
        ],
        footer: {
          text: 'TRIOGEL Gaming Marketplace • Database: ' + (SUPABASE_URL ? 'Connected' : 'Local')
        },
        timestamp: orderData.timestamp
      }]
    };

    // Add GCash payment instructions if manual GCash
    if (orderData.paymentMethod === 'gcash' && paymentResult) {
      if (paymentResult.success) {
        discordMessage.embeds[0].fields.push({
          name: ':money_with_wings: GCash Payment Instructions',
          value: `**Amount:** ₱${paymentResult.amount_php}\n**GCash Number:** ${paymentResult.gcash_number}\n**Account Name:** ${paymentResult.gcash_name}\n**Reference:** ${paymentResult.reference}\n**WhatsApp:** ${paymentResult.whatsapp_number}\n\n:warning: **Customer should:**\n• Send exact amount to GCash number\n• Include reference in payment message\n• Send screenshot to WhatsApp for verification`,
          inline: false
        });
      } else {
        discordMessage.embeds[0].fields.push({
          name: ':x: Payment Setup Error',
          value: `GCash payment setup failed: ${paymentResult.error}`,
          inline: false
        });
      }
    }

    // Add special instructions if provided
    if (orderData.customerNotes && orderData.customerNotes.trim()) {
      discordMessage.embeds[0].fields.push({
        name: ':memo: Special Instructions',
        value: orderData.customerNotes,
        inline: false
      });
    }

    // DATABASE INTEGRATION - Save order to Supabase
    let databaseSaved = false;
    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        console.log('💾 Saving order to database...');
        
        // Prepare order data for database
        const orderRecord = {
          order_id: orderData.orderId,
          customer_email: orderData.customer.email,
          customer_game_username: orderData.customer.gameUsername,
          customer_whatsapp: orderData.customer.whatsappNumber || null,
          customer_region: orderData.customer.serverRegion || null,
          payment_method: orderData.paymentMethod,
          customer_notes: orderData.customerNotes || null,
          total_amount: orderData.total,
          status: paymentResult?.success ? 'awaiting_payment' : 'pending',
          discord_sent: true,
          created_at: orderData.timestamp,
          payment_reference: paymentResult?.reference || null,
          payment_amount_php: paymentResult?.amount_php || null,
          payment_gcash_number: paymentResult?.gcash_number || null
        };

        // Save main order record
        const orderResponse = await fetch(`${SUPABASE_URL}/rest/v1/triogel_orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(orderRecord)
        });

        if (orderResponse.ok) {
          console.log('✅ Order saved to database');
          databaseSaved = true;

          // Save order items
          const orderItems = orderData.items.map(item => ({
            order_id: orderData.orderId,
            item_id: item.id,
            item_name: item.name,
            item_game: item.game,
            item_price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity
          }));

          await fetch(`${SUPABASE_URL}/rest/v1/triogel_order_items`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_KEY,
              'Authorization': `Bearer ${SUPABASE_KEY}`
            },
            body: JSON.stringify(orderItems)
          });

          console.log('✅ Order items saved to database');

          // Update customer record (optional)
          const customerRecord = {
            email: orderData.customer.email,
            game_username: orderData.customer.gameUsername,
            whatsapp: orderData.customer.whatsappNumber || null,
            preferred_region: orderData.customer.serverRegion || null,
            last_order_date: orderData.timestamp
          };

          // Try to upsert customer record
          await fetch(`${SUPABASE_URL}/rest/v1/triogel_customers`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_KEY,
              'Authorization': `Bearer ${SUPABASE_KEY}`,
              'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify({
              ...customerRecord,
              total_orders: 1,
              total_spent: orderData.total,
              first_order_date: orderData.timestamp
            })
          });

          console.log('✅ Customer record updated');
        } else {
          const dbError = await orderResponse.text();
          console.error('❌ Database save failed:', dbError);
        }
      } catch (dbError) {
        console.error('💥 Database error (continuing with Discord):', dbError);
      }
    }

    // Send to Discord if webhook URL is configured
    let discordSent = false;
    if (DISCORD_WEBHOOK_URL) {
      try {
        console.log('📡 Sending Discord notification...');
        
        const discordResponse = await fetch(DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(discordMessage)
        });

        if (!discordResponse.ok) {
          const errorText = await discordResponse.text();
          console.error('❌ Discord webhook failed:', discordResponse.status, errorText);
        } else {
          console.log('✅ Discord notification sent successfully');
          discordSent = true;
        }
      } catch (discordError) {
        console.error('💥 Discord notification error:', discordError);
      }
    }

    // Log successful processing
    console.log('💾 Order processed:', {
      orderId: orderData.orderId,
      total: orderData.total,
      customerEmail: orderData.customer.email,
      itemCount: orderData.items.length,
      databaseSaved: databaseSaved,
      discordSent: discordSent,
      paymentMethod: orderData.paymentMethod,
      paymentSuccess: paymentResult?.success
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
            discordSent: discordSent,
            databaseSaved: databaseSaved,
            paymentResult: paymentResult,
            integrations: {
                discord: !!DISCORD_WEBHOOK_URL,
                database: !!SUPABASE_URL,
                manual_gcash: !!GCASH_NUMBER
            }
        })
    };

  } catch (error) {
    console.error('💥 Error processing TRIOGEL order:', error);
    
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