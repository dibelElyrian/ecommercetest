const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Use service key for admin operations
);

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
    console.log('?? Admin API called:', event.httpMethod, event.path);

    // Parse request
    const body = event.body ? JSON.parse(event.body) : {};
    const { action, adminEmail, adminLevel } = body;

    // Admin emails configuration - CHANGE THESE FOR PRODUCTION
    const adminEmails = [
      'admin@triogel.com',
      'ryanserdan@gmail.com',
      'owner@triogel.com',
      'manager@triogel.com'
    ];

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
      
      case 'get_customers':
        return await getCustomers(body);
      
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
        .from('triogel_orders')
        .select(`
          *,
          triogel_order_items (
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
        .from('triogel_orders')
        .update(updateData)
        .eq('order_id', orderId)
        .select();

      if (error) throw error;

      console.log(`? Order ${orderId} status updated to ${newStatus}`);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          order: data?.[0],
          message: `Order status updated to ${newStatus}`
        })
      };

    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  async function getCustomers(params) {
    try {
      const { limit = 100 } = params;

      // Get customer summary from orders
      const { data: customers, error } = await supabase
        .from('triogel_customers')
        .select('*')
        .order('total_spent', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          customers: customers || [],
          count: customers?.length || 0
        })
      };

    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  async function getAnalytics(params) {
    try {
      // Get total orders and revenue
      const { data: orderStats, error: orderError } = await supabase
        .from('triogel_orders')
        .select('total_amount, status, created_at');

      if (orderError) throw orderError;

      // Calculate analytics
      const totalOrders = orderStats?.length || 0;
      const totalRevenue = orderStats?.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0) || 0;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Status breakdown
      const statusCounts = {
        pending: orderStats?.filter(o => o.status === 'pending').length || 0,
        processing: orderStats?.filter(o => o.status === 'processing').length || 0,
        completed: orderStats?.filter(o => o.status === 'completed').length || 0,
        cancelled: orderStats?.filter(o => o.status === 'cancelled').length || 0
      };

      // Recent activity (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentOrders = orderStats?.filter(order => 
        new Date(order.created_at) >= sevenDaysAgo
      ).length || 0;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          analytics: {
            totalOrders,
            totalRevenue,
            averageOrderValue,
            statusCounts,
            recentOrders,
            conversionRate: totalOrders > 0 ? (statusCounts.completed / totalOrders * 100).toFixed(2) : 0
          }
        })
      };

    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }

  async function addItem(params) {
    try {
      const { itemData } = params;
      
      // Note: In this implementation, items are stored in JavaScript array
      // For production, you'd want to store items in the database
      
      console.log('Add item functionality would be implemented here');
      console.log('Item data:', itemData);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Item addition feature coming soon',
          note: 'Items are currently managed in the JavaScript code'
        })
      };

    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  }

  async function updateItem(params) {
    try {
      const { itemId, itemData } = params;
      
      console.log('Update item functionality would be implemented here');
      console.log('Item ID:', itemId, 'Data:', itemData);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Item update feature coming soon',
          note: 'Items are currently managed in the JavaScript code'
        })
      };

    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
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