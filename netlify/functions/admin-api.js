const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICEROLE_KEY // Use service key for admin operations
);

const resend = new Resend(process.env.RESEND_MAILSENDER);

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    console.log('Admin API called:', event.httpMethod, event.path);

    // Parse request
    const body = event.body ? JSON.parse(event.body) : {};
    const { action, adminEmail, adminLevel } = body;

    const adminEmails = (process.env.SUPER_ADMIN_EMAILS || '')
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(e => e);

    // Verify admin access (basic check)
    if (!adminEmail || !adminEmails.includes(adminEmail.toLowerCase())) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Access denied. Admin privileges required.'
        })
      };
    }

    // Route admin actions
    switch (action) {
      case 'get_orders':
        return await getOrders(body);
      
      case 'update_order_status':
        return await updateOrderStatus(body);
      
      case 'get_users':
        return await getUsers(body);
      
      case 'get_analytics':
        return await getAnalytics(body);
      
      case 'add_item':
        return await addItem(body);
      
      case 'update_item':
        return await updateItem(body);
      
      case 'delete_item':
        return await deleteItem(body);
      
      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Invalid admin action'
          })
        };
    }

  } catch (error) {
    console.error('?? Admin API Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        details: error.message
      })
    };
  }

  // Default GET handler for order listing
  async function getOrders(params) {
    try {
      const { status, limit = 50, offset = 0 } = params;
      
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (
            item_id,
            item_name,
            item_game,
            item_price,
            quantity,
            subtotal
          )
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (status) {
        query = query.eq('status', status);
      }

      const { data: orders, error } = await query;

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          orders: orders || [],
          count: orders?.length || 0
        })
      };

    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  async function updateOrderStatus(params) {
    try {
      const { orderId, newStatus, adminNotes } = params;
      
      if (!orderId || !newStatus) {
        throw new Error('Order ID and status are required');
      }

      const updateData = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      if (adminNotes) {
        updateData.admin_notes = adminNotes;
      }

      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('order_id', orderId)
        .select();

      if (error) throw error;

      const updatedOrder = data?.[0];
      console.log(`Order ${orderId} status updated to ${newStatus}`);

      // --- EMAIL NOTIFICATION LOGIC START ---
      if (updatedOrder && (newStatus === 'completed' || newStatus === 'processing' || newStatus === 'cancelled')) {
        try {
          console.log('📧 Sending status update email...');

          // Determine recipient (Test Mode Strategy)
          // TODO: PRODUCTION - Change this to use updatedOrder.customer_email once domain is verified
          const testRecipient = 'delivered@resend.dev';

          // Define email content based on status
          let subject = `Order Update: ${orderId}`;
          let headline = 'Order Status Update';
          let messageBody = '';
          let color = '#667eea';

          switch (newStatus) {
            case 'completed':
              subject = `Order Completed: ${orderId}`;
              headline = 'Your Order is Complete!';
              messageBody = `<p>Great news! Your order has been successfully processed and delivered.</p>
                             <p>If you purchased game credits or items, they should now be available in your account.</p>`;
              color = '#10b981'; // Green
              break;
            case 'processing':
              subject = `Order Processing: ${orderId}`;
              headline = 'We are working on your order';
              messageBody = `<p>We have received your payment and are currently processing your order.</p>
                             <p>You will receive another email once it is completed.</p>`;
              color = '#3b82f6'; // Blue
              break;
            case 'cancelled':
              subject = `Order Cancelled: ${orderId}`;
              headline = 'Order Cancelled';
              messageBody = `<p>Your order has been cancelled.</p>
                             <p>If you have already paid, please reply to this email for refund assistance.</p>`;
              color = '#ef4444'; // Red
              break;
          }

          const emailHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: ${color};">${headline}</h1>
              <p>Hello,</p>
              ${messageBody}
              
              <div style="margin: 20px 0; padding: 15px; background: #f8f9fa; border-left: 4px solid ${color};">
                <p style="margin: 0;"><strong>Order ID:</strong> ${orderId}</p>
                <p style="margin: 5px 0 0;"><strong>New Status:</strong> ${newStatus.toUpperCase()}</p>
                ${adminNotes ? `<p style="margin: 10px 0 0; font-style: italic;"><strong>Note from Admin:</strong> ${adminNotes}</p>` : ''}
              </div>

              <p>Thank you for shopping with LilyBlock Online Shop!</p>

              <p style="margin-top: 20px; font-size: 12px; color: #666;">
                This email was sent to ${updatedOrder.customer_email}. <br>
                (Test Mode: Actually sent to ${testRecipient})
              </p>
            </div>
          `;

          const { data: emailData, error: emailError } = await resend.emails.send({
            // TODO: PRODUCTION - Change 'from' to your verified domain email
            from: 'LilyBlock Shop <onboarding@resend.dev>',
            to: [testRecipient],
            subject: subject,
            html: emailHtml
          });

          if (emailError) {
            console.error('❌ Email sending failed:', emailError);
          } else {
            console.log('✅ Status email sent successfully:', emailData.id);
          }

        } catch (emailErr) {
          console.error('💥 Email logic error:', emailErr);
        }
      }
      // --- EMAIL NOTIFICATION LOGIC END ---

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          order: updatedOrder,
          message: `Order status updated to ${newStatus}`
        })
      };

    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  async function getUsers(params) {
    try {
      const { limit = 100 } = params;

      // Get user summary from users
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          users: users || [],
          count: users?.length || 0
        })
      };

    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

async function getAnalytics(params) {
    try {
        // Fetch all orders
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('total_amount, status, payment_method, created_at');

        if (ordersError) throw ordersError;

        // Fetch all order items
        const { data: items, error: itemsError } = await supabase
            .from('order_items')
            .select('item_name, item_game, quantity');

        if (itemsError) throw itemsError;

        // Total Orders
        const totalOrders = orders.length;

        // Total Sales (sum of total_amount)
        const totalSales = orders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);

        // Average Order Value
        const averageOrderValue = totalOrders ? totalSales / totalOrders : 0;

        // Status Breakdown
        const statusCounts = {
            pending: orders.filter(o => o.status === 'pending').length,
            processing: orders.filter(o => o.status === 'processing').length,
            completed: orders.filter(o => o.status === 'completed').length,
            cancelled: orders.filter(o => o.status === 'cancelled').length
        };

        // Recent Orders (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentOrders = orders.filter(o => new Date(o.created_at) >= sevenDaysAgo).length;

        // Conversion Rate (completed / total)
        const conversionRate = totalOrders > 0 ? ((statusCounts.completed / totalOrders) * 100).toFixed(2) : "0.00";

        // Payment Methods Breakdown
        const paymentMethods = {};
        orders.forEach(o => {
            paymentMethods[o.payment_method] = (paymentMethods[o.payment_method] || 0) + 1;
        });

        // Top Items Sold
        const itemCounts = {};
        items.forEach(i => {
            itemCounts[i.item_name] = (itemCounts[i.item_name] || 0) + (i.quantity || 0);
        });
        const topItems = Object.entries(itemCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, qty]) => ({ name, qty }));

        // Top Games Sold
        const gameCounts = {};
        items.forEach(i => {
            gameCounts[i.item_game] = (gameCounts[i.item_game] || 0) + (i.quantity || 0);
        });
        const topGames = Object.entries(gameCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([game, qty]) => ({ game, qty }));

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                analytics: {
                    totalOrders,
                    totalSales,
                    averageOrderValue,
                    statusCounts,
                    recentOrders,
                    conversionRate,
                    paymentMethods,
                    topItems,
                    topGames
                }
            })
        };

    } catch (error) {
        console.error('Error fetching analytics:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message || 'Failed to fetch analytics'
            })
        };
    }
}

async function addItem(params) {
    try {
        const { itemData } = params;

        // Validate required fields
        if (!itemData || !itemData.name || !itemData.price || !itemData.game) {
            throw new Error('Missing required item fields');
        }

        // Validate price is positive
        if (typeof itemData.price !== 'number' || itemData.price < 0) {
            throw new Error('Price must be a positive number');
        }

        // Prepare insert data (match Supabase schema)
        const insertData = {
            name: itemData.name,
            description: itemData.description || null,
            price: itemData.price,
            image_url: itemData.image_url || null,
            game: itemData.game,
            rarity: itemData.rarity || null,
            stock: typeof itemData.stock === 'number' ? itemData.stock : 0,
            active: typeof itemData.active === 'boolean' ? itemData.active : true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        // Insert into Supabase items table
        const { data, error } = await supabase
            .from('items')
            .insert([insertData])
            .select();

        if (error) throw error;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                item: data?.[0],
                message: 'Item added successfully'
            })
        };

    } catch (error) {
        console.error('Error adding item:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message || 'Failed to add item'
            })
        };
    }
}

async function updateItem(params) {
    try {
        const { itemId, itemData } = params;

        // Validate input
        if (!itemId || typeof itemId !== 'number' && typeof itemId !== 'string') {
            throw new Error('Valid itemId is required');
        }
        if (!itemData || typeof itemData.stock !== 'number' || itemData.stock < 0) {
            throw new Error('Valid stock value is required');
        }

        // Prepare update data
        const updateData = {
            stock: itemData.stock,
            updated_at: new Date().toISOString()
        };

        // Update the item in Supabase
        const { data, error } = await supabase
            .from('items')
            .update(updateData)
            .eq('id', itemId)
            .select();

        if (error) throw error;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                item: data?.[0],
                message: 'Item stock updated successfully'
            })
        };

    } catch (error) {
        console.error('Error updating item:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message || 'Failed to update item'
            })
        };
    }
}

  async function deleteItem(params) {
    try {
      const { itemId } = params;
      
      console.log('Delete item functionality would be implemented here');
      console.log('Item ID:', itemId);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Item deletion feature coming soon',
          note: 'Items are currently managed in the JavaScript code'
        })
      };

    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }
};