const { createClient } = require('@supabase/supabase-js');
const cookie = require('cookie');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_MAILSENDER);

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

    // --- SECURITY & VALIDATION START ---
    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: 'Order must contain items' })
      };
    }

    if (!supabase) {
      console.warn('⚠️ Supabase database not configured - skipping server-side validation');
    } else {
      // 1. Fetch real item details from database
      const itemIds = orderData.items.map(i => i.id);
      const { data: dbItems, error: itemsError } = await supabase
        .from('items')
        .select('id, price, name, stock')
        .in('id', itemIds);

      if (itemsError) {
        console.error('Error fetching items for validation:', itemsError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ success: false, message: 'Server error validating items' })
        };
      }

      // 2. Recalculate total and validate quantities
      let calculatedTotal = 0;
      const validatedItems = [];

      for (const clientItem of orderData.items) {
        const dbItem = dbItems.find(i => i.id === clientItem.id);

        if (!dbItem) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ success: false, message: `Item ID ${clientItem.id} no longer exists` })
          };
        }

        if (!Number.isInteger(clientItem.quantity) || clientItem.quantity <= 0) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ success: false, message: `Invalid quantity for item: ${dbItem.name}` })
          };
        }

        // Optional: Check stock
        if (dbItem.stock !== null && dbItem.stock < clientItem.quantity) {
           return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ success: false, message: `Insufficient stock for: ${dbItem.name} (Available: ${dbItem.stock})` })
          };
        }

        // Use DB price for calculation
        calculatedTotal += Number(dbItem.price) * clientItem.quantity;

        validatedItems.push({
          ...clientItem,
          price: Number(dbItem.price), // Enforce DB price
          name: dbItem.name
        });
      }

      // 3. Override client data with validated data
      console.log(`💰 Price Check: Client Total=${orderData.total}, Server Total=${calculatedTotal}`);
      
      // Allow small floating point difference (e.g. currency conversion artifacts), but prefer server total
      orderData.total = calculatedTotal; 
      orderData.items = validatedItems;
    }
    // --- SECURITY & VALIDATION END ---

    let jwtToken = null;
    if (event.headers.cookie) {
        const cookies = cookie.parse(event.headers.cookie);
        jwtToken = cookies.jwt;
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

        const supabaseUser = jwtToken
            ? createClient(
                process.env.SUPABASE_URL,
                process.env.SUPABASE_ANON_KEY,
                { global: { headers: { Authorization: `Bearer ${jwtToken}` } } }
            )
              : supabase;

        const { data: orderResult, error: orderError } = await supabaseUser
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

        const { error: itemsError } = await supabaseUser
          .from('order_items')
          .insert(orderItems);

        if (itemsError) {
          console.error('❌ Error creating order items:', itemsError);
          // Try to rollback the order if items insertion failed
          await supabaseUser
            .from('orders')
            .delete()
            .eq('id', orderDbId);
          throw itemsError;
        }

        // Atomic decrement of item stock after order items are inserted
        for (const item of orderData.items) {
          const { error: stockError } = await supabaseUser
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

    // Send Email Confirmation (Resend)
    let emailSent = false;
    if (databaseSaved) {
      try {
        console.log('📧 Sending email confirmation...');
        
        // Determine recipient (Test Mode Strategy)
        // Matches user-auth.js implementation
        // TODO: PRODUCTION - Change this to use orderData.email once domain is verified
        const testRecipient = 'delivered@resend.dev'; 
        
        // Construct HTML Email
        const itemsHtml = orderData.items.map(item => 
          `<tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name} (${item.game})</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">x${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">₱${item.price.toFixed(2)}</td>
           </tr>`
        ).join('');

        const emailHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #667eea;">Order Confirmation</h1>
            <p>Thank you for your order at LilyBlock Online Shop!</p>
            <p><strong>Order ID:</strong> ${orderData.orderId}</p>
            <p><strong>Status:</strong> Pending Processing</p>
            
            <h3>Order Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f8f9fa;">
                  <th style="text-align: left; padding: 8px;">Item</th>
                  <th style="text-align: left; padding: 8px;">Qty</th>
                  <th style="text-align: left; padding: 8px;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 8px; text-align: right; font-weight: bold;">Total:</td>
                  <td style="padding: 8px; font-weight: bold;">₱${orderData.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            <div style="margin-top: 20px; padding: 15px; background: #f0f4f8; border-radius: 5px;">
              <p style="margin: 0;"><strong>Payment Method:</strong> ${orderData.paymentMethod.toUpperCase()}</p>
              ${orderData.paymentMethod === 'gcash' ? `<p style="margin: 5px 0 0;">Please complete your payment via GCash if you haven't already.</p>` : ''}
            </div>

            <p style="margin-top: 20px; font-size: 12px; color: #666;">
              This email was sent to ${orderData.email}. <br>
              (Test Mode: Actually sent to ${testRecipient})
            </p>
          </div>
        `;

        const { data: emailData, error: emailError } = await resend.emails.send({
          // TODO: PRODUCTION - Change 'from' to your verified domain email (e.g., 'orders@lilyblock.com')
          from: 'LilyBlock Shop <onboarding@resend.dev>',
          to: [testRecipient],
          subject: `Order Confirmation: ${orderData.orderId}`,
          html: emailHtml
        });

        if (emailError) {
          console.error('❌ Email sending failed:', emailError);
        } else {
          console.log('✅ Email sent successfully:', emailData.id);
          emailSent = true;
        }

      } catch (emailErr) {
        console.error('💥 Email logic error:', emailErr);
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
      emailSent: emailSent,
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
          emailSent: false,
          databaseSaved: false,
          paymentResult: paymentResult,
          integrations: {
            discord: !!DISCORD_WEBHOOK_URL,
            email: false,
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
        emailSent: emailSent,
        databaseSaved: databaseSaved,
        paymentResult: {
          ...paymentResult,
          contact_method: 'email'
        },
        integrations: {
          discord: !!DISCORD_WEBHOOK_URL,
          email: emailSent,
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