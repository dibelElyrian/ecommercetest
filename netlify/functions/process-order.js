const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const orderData = JSON.parse(event.body);
    console.log('📦 Processing LilyBlock Online Shop order:', orderData.orderId);

    // Environment variables for integrations
    const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
    const GCASH_NUMBER = process.env.GCASH_NUMBER;
    const GCASH_NAME = process.env.GCASH_NAME;

    // Initialize Supabase client
    let supabase = null;
    if (SUPABASE_URL && SUPABASE_KEY) {
      supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    }

    if (!DISCORD_WEBHOOK_URL) {
      console.warn('⚠️ Discord webhook URL not configured');
    }

    if (!supabase) {
      console.warn('⚠️ Supabase database not configured');
    } else {
      console.log('✅ Supabase client initialized');
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

        const phpAmount = orderData.total.toFixed(2);

        if (GCASH_NUMBER && GCASH_NAME) {
          paymentResult = {
            success: true,
            payment_type: 'manual_gcash',
            reference: paymentReference,
            amount_php: phpAmount,
            amount_usd: orderData.total.toFixed(2),
            gcash_number: GCASH_NUMBER,
            gcash_name: GCASH_NAME,
            contact_method: 'email',
            instructions: `Send ₱${phpAmount} to GCash ${GCASH_NUMBER} (${GCASH_NAME}) with reference: ${paymentReference}. Email payment screenshot to the email address provided in your order confirmation.`
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

    // SUPABASE DATABASE INTEGRATION - Save order
    let databaseSaved = false;
    let orderDbId = null;

    if (supabase) {
      try {
        console.log('💾 Saving order to Supabase database...');
        // Insert main order record
        const { data: orderResult, error: orderError } = await supabase
          .from('orders')
          .insert({
            order_id: orderData.orderId,
            customer_email: orderData.email,
            customer_game_username: orderData.gameUsername,
            customer_whatsapp: orderData.whatsappNumber || null,
            customer_region: orderData.serverRegion || null,
            payment_method: orderData.paymentMethod,
            customer_notes: orderData.customerNotes || null,
            total_amount: orderData.total,
            status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            currency: orderData.currency || 'PHP',
            payment_reference: paymentResult?.reference || null
          })
          .select()
          .single();

        if (orderError) {
          console.error('❌ Error creating order:', orderError);
          throw orderError;
        }

        orderDbId = orderResult.orderId;
        console.log('✅ Order saved to database with ID:', orderDbId);

        // Insert order items
        const orderItems = orderData.items.map(item => ({
          order_id: orderData.orderId,
          item_id: item.id,
          item_name: item.name,
          item_game: item.game,
          item_price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) {
          console.error('❌ Error creating order items:', itemsError);
          // Try to rollback the order if items insertion failed
          await supabase
            .from('orders')
            .delete()
            .eq('id', orderDbId);
          throw itemsError;
        }

        // Atomic decrement of item stock after order items are inserted
        for (const item of orderData.items) {
          const { error: stockError } = await supabase
            .rpc('decrement_stock', { item_id: item.id, qty: item.quantity });

          if (stockError) {
            console.error(`❌ Error decrementing stock for item ${item.id}:`, stockError);
            // Optionally: handle rollback or notify admin
          }
        }

        console.log('✅ Order items saved to database');
        databaseSaved = true;

      } catch (dbError) {
        console.error('💥 Database error:', dbError);
        databaseSaved = false;
        // Continue processing even if database save fails
        console.log('⚠️ Continuing without database save...');
      }
    }

    // Create rich Discord embed message
    const discordMessage = {
      content: `**:bell: NEW LilyBlock Online Shop ORDER RECEIVED!**`,
      embeds: [{
        title: ':shopping_cart: New Gaming Item Order',
        description: `A new order has been placed on LilyBlock Online Shop virtual items marketplace!`,
        color: 0x667eea,
        fields: [
          {
            name: ':clipboard: Order Information',
            value: `**Order ID:** ${orderData.orderId}\n**Database ID:** ${orderDbId || 'N/A'}\n**Total Amount:** ₱${orderData.total.toFixed(2)}\n**Date:** ${new Date(orderData.timestamp).toLocaleString()}`,
            inline: false
          },
          {
            name: ':bust_in_silhouette: Customer Details',
            value: `**Email:** ${orderData.email}\n**Game Username:** ${orderData.gameUsername}\n**Region:** ${orderData.serverRegion || 'Not specified'}`,
            inline: true
          },
          {
            name: ':credit_card: Payment & Contact',
            value: `**Payment Method:** ${orderData.paymentMethod.toUpperCase()}\n**WhatsApp:** ${orderData.whatsappNumber || 'Not provided'}\n**Status:** ${paymentResult?.success ? ':moneybag: GCash Instructions Sent' : ':hourglass: Pending'}`,
            inline: true
          },
          {
            name: ':shopping_bags: Items Ordered',
            value: itemsList,
            inline: false
          }
        ],
        footer: {
          text: 'LilyBlock Online Shop Gaming Marketplace • Database: ' + (databaseSaved ? 'Saved ✅' : 'Failed ❌')
        },
          timestamp: new Date().toISOString()
      }]
    };

    // Add GCash payment instructions if manual GCash
    if (orderData.paymentMethod === 'gcash' && paymentResult) {
      if (paymentResult.success) {
        discordMessage.embeds[0].fields.push({
          name: ':money_with_wings: GCash Payment Instructions',
          value: `**Amount:** ₱${paymentResult.amount_php}\n**GCash Number:** ${paymentResult.gcash_number}\n**Account Name:** ${paymentResult.gcash_name}\n**Reference:** ${paymentResult.reference}\n\n:warning: **Customer should:**\n• Send exact amount to GCash number\n• Include reference in payment message\n• Email screenshot to: ${orderData.email}\n• Reply to their order confirmation email with payment proof`,
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

    // Send to Discord only if databaseSaved is true and webhook URL is configured
    let discordSent = false;
    if (DISCORD_WEBHOOK_URL && databaseSaved) {
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
      dbId: orderDbId,
      total: orderData.total,
      customerEmail: orderData.email,
      itemCount: orderData.items.length,
      databaseSaved: databaseSaved,
      discordSent: discordSent,
      paymentMethod: orderData.paymentMethod,
      paymentSuccess: paymentResult?.success
    });

    // Return error response if database was not saved
    if (!databaseSaved) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Order failed to save to database',
          orderId: orderData.orderId,
          orderDbId: orderDbId,
          discordSent: false,
          databaseSaved: false,
          paymentResult: paymentResult,
          integrations: {
            discord: !!DISCORD_WEBHOOK_URL,
            database: false,
            manual_gcash: !!GCASH_NUMBER
          }
        })
      };
    }

    // Return success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Order processed successfully',
        orderId: orderData.orderId,
        orderDbId: orderDbId,
        discordSent: discordSent,
        databaseSaved: databaseSaved,
        paymentResult: {
          ...paymentResult,
          contact_method: 'email'
        },
        integrations: {
          discord: !!DISCORD_WEBHOOK_URL,
          database: databaseSaved,
          manual_gcash: !!GCASH_NUMBER
        }
      })
    };

  } catch (error) {
    console.error('💥 Error processing LilyBlock Online Shop order:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to process order',
        details: error.message,
        orderId: event.body ? JSON.parse(event.body).orderId : 'unknown'
      })
    };
  }
};