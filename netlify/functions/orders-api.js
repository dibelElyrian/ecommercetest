const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client - fallback to anon key if service key not available
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

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

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const requestData = JSON.parse(event.body);
        const { action, userEmail, adminEmail, orderId, limit = 50 } = requestData;

        console.log('Orders API request:', { action, userEmail, adminEmail, orderId });

        // Check if Supabase is configured
        if (!process.env.SUPABASE_URL) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    success: false, 
                    error: 'Database not configured' 
                })
            };
        }

        switch (action) {
            case 'get_user_orders':
                // Get orders for a specific user
                if (!userEmail) {
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({ 
                            success: false, 
                            error: 'User email is required' 
                        })
                    };
                }

                const { data: userOrders, error: userOrdersError } = await supabase
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
                    .eq('customer_email', userEmail)
                    .order('created_at', { ascending: false })
                    .limit(limit);

                if (userOrdersError) {
                    console.error('Error fetching user orders:', userOrdersError);
                    return {
                        statusCode: 500,
                        headers,
                        body: JSON.stringify({ 
                            success: false, 
                            error: 'Failed to fetch user orders: ' + userOrdersError.message 
                        })
                    };
                }

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        orders: userOrders || []
                    })
                };

            case 'get_admin_orders':
                // Get all orders for admin (requires admin verification)
                if (!adminEmail) {
                    return {
                        statusCode: 403,
                        headers,
                        body: JSON.stringify({ 
                            success: false, 
                            error: 'Admin email is required' 
                        })
                    };
                }

                // TODO: Add admin verification here
                // For now, allowing all requests with adminEmail

                const { data: adminOrders, error: adminOrdersError } = await supabase
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
                    .limit(limit);

                if (adminOrdersError) {
                    console.error('Error fetching admin orders:', adminOrdersError);
                    return {
                        statusCode: 500,
                        headers,
                        body: JSON.stringify({ 
                            success: false, 
                            error: 'Failed to fetch admin orders: ' + adminOrdersError.message 
                        })
                    };
                }

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        orders: adminOrders || []
                    })
                };

            case 'get_order_by_id':
                // Get specific order by order_id
                if (!orderId) {
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({ 
                            success: false, 
                            error: 'Order ID is required' 
                        })
                    };
                }

                const { data: orderData, error: orderError } = await supabase
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
                    .eq('order_id', orderId)
                    .single();

                if (orderError) {
                    if (orderError.code === 'PGRST116') {
                        return {
                            statusCode: 404,
                            headers,
                            body: JSON.stringify({ 
                                success: false, 
                                error: 'Order not found' 
                            })
                        };
                    }

                    console.error('Error fetching order:', orderError);
                    return {
                        statusCode: 500,
                        headers,
                        body: JSON.stringify({ 
                            success: false, 
                            error: 'Failed to fetch order: ' + orderError.message 
                        })
                    };
                }

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        order: orderData
                    })
                };

            case 'update_order_status':
                // Update order status (admin only)
                const { orderId: updateOrderId, newStatus } = requestData;
                
                if (!updateOrderId || !newStatus) {
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({ 
                            success: false, 
                            error: 'Order ID and new status are required' 
                        })
                    };
                }

                const { data: updatedOrder, error: updateError } = await supabase
                    .from('triogel_orders')
                    .update({ 
                        order_status: newStatus,
                        updated_at: new Date().toISOString()
                    })
                    .eq('order_id', updateOrderId)
                    .select()
                    .single();

                if (updateError) {
                    console.error('Error updating order status:', updateError);
                    return {
                        statusCode: 500,
                        headers,
                        body: JSON.stringify({ 
                            success: false, 
                            error: 'Failed to update order status: ' + updateError.message 
                        })
                    };
                }

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        message: 'Order status updated successfully',
                        order: updatedOrder
                    })
                };

            default:
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ 
                        success: false, 
                        error: 'Invalid action' 
                    })
                };
        }

    } catch (error) {
        console.error('Orders API error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                success: false, 
                error: 'Internal server error: ' + error.message 
            })
        };
    }
};