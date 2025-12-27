// LilyBlock Online Shop Admin - Update Order Status Function
// Updates order status and sends notifications
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_MAILSENDER);

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
      `${SUPABASE_URL}/rest/v1/orders?order_id=eq.${orderId}`,
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

    console.log(`Order ${orderId} status updated to ${status}`);

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

    // Send Email Notification to Customer (Resend)
    // Only send for significant status changes
    if (status === 'completed' || status === 'processing' || status === 'cancelled') {
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

        switch (status) {
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
              <p style="margin: 5px 0 0;"><strong>New Status:</strong> ${status.toUpperCase()}</p>
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