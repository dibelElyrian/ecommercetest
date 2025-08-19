exports.handler = async (event, context) => {
  console.log('?? PayMongo webhook received');
  
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    const webhookData = JSON.parse(event.body);
    console.log('?? Webhook data:', webhookData);

    if (webhookData.data && webhookData.data.attributes) {
      const paymentIntent = webhookData.data;
      const status = paymentIntent.attributes.status;
      const paymentId = paymentIntent.id;
      
      console.log(`?? Payment ${paymentId} status: ${status}`);

      const SUPABASE_URL = process.env.SUPABASE_URL;
      const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
      const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

      if (SUPABASE_URL && SUPABASE_KEY) {
        try {
          let orderStatus = 'pending';
          let discordMessage = null;

          switch (status) {
            case 'succeeded':
              orderStatus = 'paid';
              discordMessage = {
                content: '?? **GCASH PAYMENT SUCCESSFUL!**',
                embeds: [{
                  title: '? Payment Confirmed',
                  description: `GCash payment has been successfully processed!`,
                  color: 0x00ff88,
                  fields: [{
                    name: '?? Payment Details',
                    value: `**Payment ID:** ${paymentId}\n**Status:** Paid\n**Method:** GCash`,
                    inline: false
                  }],
                  timestamp: new Date().toISOString()
                }]
              };
              break;
              
            case 'processing':
              orderStatus = 'processing_payment';
              break;
              
            case 'requires_payment_method':
              orderStatus = 'awaiting_payment';
              break;
              
            case 'canceled':
            case 'payment_failed':
              orderStatus = 'payment_failed';
              discordMessage = {
                content: '? **GCASH PAYMENT FAILED**',
                embeds: [{
                  title: '? Payment Failed',
                  description: `GCash payment was not successful.`,
                  color: 0xff4444,
                  fields: [{
                    name: '?? Payment Details',
                    value: `**Payment ID:** ${paymentId}\n**Status:** Failed\n**Method:** GCash`,
                    inline: false
                  }],
                  timestamp: new Date().toISOString()
                }]
              };
              break;
          }

          // Update order in database
          const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/triogel_orders?payment_id=eq.${paymentId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_KEY,
              'Authorization': `Bearer ${SUPABASE_KEY}`
            },
            body: JSON.stringify({
              status: orderStatus,
              payment_status: status,
              updated_at: new Date().toISOString()
            })
          });

          if (updateResponse.ok) {
            console.log('? Order status updated in database');
          }

          // Send Discord notification for important status changes
          if (discordMessage && DISCORD_WEBHOOK_URL) {
            try {
              await fetch(DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(discordMessage)
              });
              console.log('? Discord notification sent');
            } catch (discordError) {
              console.error('? Discord notification failed:', discordError);
            }
          }

        } catch (dbError) {
          console.error('? Database update failed:', dbError);
        }
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Webhook processed successfully' 
      })
    };

  } catch (error) {
    console.error('?? Webhook processing error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Webhook processing failed', 
        details: error.message 
      })
    };
  }
};