// LilyBlock Online Shop - Get Orders Function (RLS enforced with session JWT, user-only, no stats)

const cookie = require('cookie');

exports.handler = async (event, context) => {
    // Allow GET requests only
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

        // Parse JWT from cookie
        let jwt = null;
        if (event.headers.cookie) {
            const cookies = cookie.parse(event.headers.cookie);
            jwt = cookies.jwt;
        }

        if (!jwt) {
            return {
                statusCode: 401,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ error: 'Not authenticated' })
            };
        }

        // Build query URL (no customer_email filter, RLS will enforce)
        let url = `${SUPABASE_URL}/rest/v1/orders?order=created_at.desc&limit=${limit}&offset=${offset}`;
        if (status && status !== 'all') {
            url += `&status=eq.${status}`;
        }

        // Fetch orders from database using session JWT
        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Database query failed: ${error}`);
        }

        const orders = await response.json();

        // Fetch order items for these orders
        let orderItemsMap = {};
        if (orders.length > 0) {
            const orderIds = orders.map(o => o.order_id);
            const itemsUrl = `${SUPABASE_URL}/rest/v1/order_items?order_id=in.(${orderIds.join(",")})`;
            const itemsResponse = await fetch(itemsUrl, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${jwt}`,
                    'Content-Type': 'application/json'
                }
            });
            if (itemsResponse.ok) {
                const items = await itemsResponse.json();
                // Group items by order_id
                items.forEach(item => {
                    if (!orderItemsMap[item.order_id]) orderItemsMap[item.order_id] = [];
                    orderItemsMap[item.order_id].push(item);
                });
            }
            // Attach items to each order
            orders.forEach(order => {
                order.items = orderItemsMap[order.order_id] || [];
            });
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