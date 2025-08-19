// TRIOGEL Customer Order Tracking Function
// Allows customers to look up their orders by email or order ID

exports.handler = async (event, context) => {
  // Allow GET requests for order lookup
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Database not configured' })
      };
    }

    // Parse query parameters
    const queryParams = event.queryStringParameters || {};
    const orderId = queryParams.orderId;
    const email = queryParams.email;

    if (!orderId && !email) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Either orderId or email parameter is required',
          usage: 'Use ?orderId=TRIO-123456 or ?email=customer@email.com'
        })
      };
    }

    console.log('?? Looking up orders for:', { orderId, email });

    // Build query based on provided parameters
    let queryUrl = `${SUPABASE_URL}/rest/v1/triogel_orders?order=created_at.desc`;
    
    if (orderId) {
      queryUrl += `&order_id=eq.${orderId}`;
    } else if (email) {
      queryUrl += `&customer_email=eq.${email}`;
    }

    // Fetch order(s) from database
    const orderResponse = await fetch(queryUrl, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!orderResponse.ok) {
      const error = await orderResponse.text();
      throw new Error(`Database query failed: ${error}`);
    }

    const orders = await orderResponse.json();

    if (orders.length === 0) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          message: orderId ? 'Order not found' : 'No orders found for this email',
          orderId: orderId || null,
          email: email || null
        })
      };
    }

    // For each order, get the order items
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        try {
          const itemsResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/triogel_order_items?order_id=eq.${order.order_id}`,
            {
              headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
              }
            }
          );

          const items = itemsResponse.ok ? await itemsResponse.json() : [];
          
          return {
            ...order,
            items: items
          };
        } catch (error) {
          console.error('Error fetching items for order:', order.order_id, error);
          return {
            ...order,
            items: []
          };
        }
      })
    );

    console.log(`? Retrieved ${ordersWithItems.length} orders with items`);

    // Format response based on lookup type
    const response = {
      success: true,
      lookupType: orderId ? 'orderId' : 'email',
      orderId: orderId || null,
      email: email || null,
      totalOrders: ordersWithItems.length,
      orders: ordersWithItems.map(order => ({
        orderId: order.order_id,
        status: order.status,
        totalAmount: parseFloat(order.total_amount),
        paymentMethod: order.payment_method,
        gameUsername: order.customer_game_username,
        region: order.customer_region,
        whatsapp: order.customer_whatsapp,
        orderDate: order.created_at,
        lastUpdated: order.updated_at,
        customerNotes: order.customer_notes,
        adminNotes: order.admin_notes,
        items: order.items.map(item => ({
          name: item.item_name,
          game: item.item_game,
          quantity: item.quantity,
          price: parseFloat(item.item_price),
          subtotal: parseFloat(item.subtotal)
        }))
      }))
    };

    // Add customer summary for email lookups
    if (email) {
      const totalSpent = ordersWithItems.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
      const statusCounts = {
        pending: ordersWithItems.filter(o => o.status === 'pending').length,
        processing: ordersWithItems.filter(o => o.status === 'processing').length,
        completed: ordersWithItems.filter(o => o.status === 'completed').length,
        cancelled: ordersWithItems.filter(o => o.status === 'cancelled').length
      };

      response.customerSummary = {
        totalOrders: ordersWithItems.length,
        totalSpent: totalSpent,
        statusBreakdown: statusCounts,
        firstOrderDate: ordersWithItems[ordersWithItems.length - 1]?.created_at,
        lastOrderDate: ordersWithItems[0]?.created_at
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error('?? Error looking up orders:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Failed to lookup orders',
        details: error.message
      })
    };
  }
};