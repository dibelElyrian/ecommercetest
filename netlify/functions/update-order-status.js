// LilyBlock Online Shop Admin - Update Order Status Function
// Updates order status and sends notifications

exports.handler = async (event, context) => {
  // Allow PATCH/PUT requests
  if (event.httpMethod !== 'PATCH' && event.httpMethod !== 'PUT') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'PATCH, PUT'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
    const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
    
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Database not configured' })
      };
    }

    const updateData = JSON.parse(event.body);
    const { orderId, status, adminNotes } = updateData;

    if (!orderId || !status) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing orderId or status' })
      };
    }

    console.log('?? Updating order status:', orderId, 'to', status);

    // Prepare update data
    const updateRecord = {
      status: status,
      updated_at: new Date().toISOString()
    };

    if (adminNotes) {
      updateRecord.admin_notes = adminNotes;
    }

    // Update order in database
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/triogel_orders?order_id=eq.${orderId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(updateRecord)
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Database update failed: ${error}`);
    }

    const updatedOrders = await response.json();
    const updatedOrder = updatedOrders[0];

    if (!updatedOrder) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Order not found' })
      };
    }

    console.log(`? Order ${orderId} status updated to ${status}`);

    // Send Discord notification for status updates if configured
    if (DISCORD_WEBHOOK_URL && (status === 'completed' || status === 'processing')) {
      try {
        const statusEmojis = {
          'pending': ':hourglass:',
          'processing': ':gear:',
          'completed': ':white_check_mark:',
          'cancelled': ':x:'
        };

        const statusColors = {
          'pending': 0xfbbf24,
          'processing': 0x3b82f6,
          'completed': 0x10b981,
          'cancelled': 0xef4444
        };

        const discordMessage = {
          embeds: [{
            title: ':arrows_counterclockwise: LilyBlock Online Shop Order Status Update',
            description: `Order **${orderId}** status has been updated`,
            color: statusColors[status] || 0x667eea,
            fields: [
              {
                name: 'Order ID',
                value: orderId,
                inline: true
              },
              {
                name: 'New Status',
                value: `${statusEmojis[status]} ${status.charAt(0).toUpperCase() + status.slice(1)}`,
                inline: true
              },
              {
                name: 'Customer Email',
                value: updatedOrder.customer_email,
                inline: true
              }
            ],
            footer: {
              text: 'LilyBlock Online Shop Order Management'
            },
            timestamp: new Date().toISOString()
          }]
        };

        if (adminNotes) {
          discordMessage.embeds[0].fields.push({
            name: 'Admin Notes',
            value: adminNotes,
            inline: false
          });
        }

        await fetch(DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(discordMessage)
        });

        console.log('? Discord status notification sent');
      } catch (discordError) {
        console.error('?? Discord notification failed:', discordError);
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        message: 'Order status updated successfully',
        order: updatedOrder
      })
    };

  } catch (error) {
    console.error('?? Error updating order status:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Failed to update order status',
        details: error.message
      })
    };
  }
};