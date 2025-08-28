// TRIOGEL Admin - Get Orders Function
// Retrieves orders from Supabase database for management

exports.handler = async (event, context) => {
  // Allow GET requests
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
    const status = queryParams.status || null;
    const limit = parseInt(queryParams.limit) || 50;
    const offset = parseInt(queryParams.offset) || 0;
    const email = queryParams.email || null;

    console.log('?? Fetching TRIOGEL orders:', { status, limit, offset });

    // Build query URL
    let url = `${SUPABASE_URL}/rest/v1/triogel_orders?order=created_at.desc&limit=${limit}&offset=${offset}`;
    if (status && status !== 'all') {
      url += `&status=eq.${status}`;
    }
    if (email) {
      url += `&customer_email=eq.${encodeURIComponent(email)}`;
    }

    // Fetch orders from database
    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Database query failed: ${error}`);
    }

    const orders = await response.json();
    console.log(`? Retrieved ${orders.length} orders from database`);

    // Get order statistics
    const statsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/triogel_orders?select=status,total_amount`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    let stats = {
      total: 0,
      pending: 0,
      processing: 0,
      completed: 0,
      cancelled: 0,
      totalRevenue: 0,
      pendingRevenue: 0
    };

    if (statsResponse.ok) {
      const allOrders = await statsResponse.json();
      stats.total = allOrders.length;
      stats.pending = allOrders.filter(o => o.status === 'pending').length;
      stats.processing = allOrders.filter(o => o.status === 'processing').length;
      stats.completed = allOrders.filter(o => o.status === 'completed').length;
      stats.cancelled = allOrders.filter(o => o.status === 'cancelled').length;
      stats.totalRevenue = allOrders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
      stats.pendingRevenue = allOrders
        .filter(o => o.status === 'pending' || o.status === 'processing')
        .reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        data: orders,
        stats: stats,
        pagination: {
          limit: limit,
          offset: offset,
          hasMore: orders.length === limit
        }
      })
    };

  } catch (error) {
    console.error('?? Error fetching orders:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Failed to fetch orders',
        details: error.message
      })
    };
  }
};