// TRIOGEL Database Schema and Utilities
// Supabase integration for order management

class TriogelDatabase {
  constructor() {
    this.supabaseUrl = process.env.SUPABASE_URL;
    this.supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    if (!this.supabaseUrl || !this.supabaseKey) {
      console.warn('?? Supabase credentials not configured');
    }
  }

  // Create tables if they don't exist (run this once)
  async initializeDatabase() {
    const createOrdersTable = `
      CREATE TABLE IF NOT EXISTS triogel_orders (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(50) UNIQUE NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_game_username VARCHAR(100) NOT NULL,
        customer_whatsapp VARCHAR(20),
        customer_region VARCHAR(100),
        payment_method VARCHAR(50) NOT NULL,
        customer_notes TEXT,
        total_amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        discord_sent BOOLEAN DEFAULT false,
        admin_notes TEXT
      );
    `;

    const createOrderItemsTable = `
      CREATE TABLE IF NOT EXISTS triogel_order_items (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(50) REFERENCES triogel_orders(order_id),
        item_id INTEGER NOT NULL,
        item_name VARCHAR(255) NOT NULL,
        item_game VARCHAR(20) NOT NULL,
        item_price DECIMAL(10,2) NOT NULL,
        quantity INTEGER NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL
      );
    `;

    const createCustomersTable = `
      CREATE TABLE IF NOT EXISTS triogel_customers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        game_username VARCHAR(100),
        whatsapp VARCHAR(20),
        preferred_region VARCHAR(100),
        total_orders INTEGER DEFAULT 0,
        total_spent DECIMAL(10,2) DEFAULT 0.00,
        first_order_date TIMESTAMP,
        last_order_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    try {
      // Note: In production, you'd run these via Supabase dashboard or migration
      console.log('?? Database schema ready for setup');
      return {
        orders: createOrdersTable,
        order_items: createOrderItemsTable,
        customers: createCustomersTable
      };
    } catch (error) {
      console.error('?? Database initialization error:', error);
      throw error;
    }
  }

  // Save order to database
  async saveOrder(orderData) {
    try {
      console.log('?? Saving order to database:', orderData.orderId);

      // Prepare order data for database
      const orderRecord = {
        order_id: orderData.orderId,
        customer_email: orderData.customer.email,
        customer_game_username: orderData.customer.gameUsername,
        customer_whatsapp: orderData.customer.whatsappNumber || null,
        customer_region: orderData.customer.serverRegion || null,
        payment_method: orderData.paymentMethod,
        customer_notes: orderData.customerNotes || null,
        total_amount: orderData.total,
        status: 'pending',
        discord_sent: true // Since we're sending Discord notification
      };

      // Use fetch to call Supabase REST API
      const response = await fetch(`${this.supabaseUrl}/rest/v1/triogel_orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(orderRecord)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Database save failed: ${error}`);
      }

      const savedOrder = await response.json();
      console.log('? Order saved to database');

      // Save order items
      await this.saveOrderItems(orderData.orderId, orderData.items);

      // Update customer records
      await this.updateCustomerRecord(orderData.customer, orderData.total);

      return savedOrder;

    } catch (error) {
      console.error('?? Error saving order to database:', error);
      // Don't throw - we still want Discord notification to work even if DB fails
      return null;
    }
  }

  // Save individual order items
  async saveOrderItems(orderId, items) {
    try {
      const orderItems = items.map(item => ({
        order_id: orderId,
        item_id: item.id,
        item_name: item.name,
        item_game: item.game,
        item_price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      }));

      const response = await fetch(`${this.supabaseUrl}/rest/v1/triogel_order_items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`
        },
        body: JSON.stringify(orderItems)
      });

      if (response.ok) {
        console.log('? Order items saved to database');
      }
    } catch (error) {
      console.error('?? Error saving order items:', error);
    }
  }

  // Update or create customer record
  async updateCustomerRecord(customerData, orderTotal) {
    try {
      const customerRecord = {
        email: customerData.email,
        game_username: customerData.gameUsername,
        whatsapp: customerData.whatsappNumber || null,
        preferred_region: customerData.serverRegion || null
      };

      // Try to update existing customer
      const updateResponse = await fetch(`${this.supabaseUrl}/rest/v1/triogel_customers?email=eq.${customerData.email}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          ...customerRecord,
          total_orders: 'total_orders + 1',
          total_spent: `total_spent + ${orderTotal}`,
          last_order_date: new Date().toISOString()
        })
      });

      // If customer doesn't exist, create new record
      if (updateResponse.status === 406 || !updateResponse.ok) {
        await fetch(`${this.supabaseUrl}/rest/v1/triogel_customers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': this.supabaseKey,
            'Authorization': `Bearer ${this.supabaseKey}`
          },
          body: JSON.stringify({
            ...customerRecord,
            total_orders: 1,
            total_spent: orderTotal,
            first_order_date: new Date().toISOString(),
            last_order_date: new Date().toISOString()
          })
        });
      }

      console.log('? Customer record updated');
    } catch (error) {
      console.error('?? Error updating customer record:', error);
    }
  }

  // Get all orders (for admin panel)
  async getAllOrders(status = null, limit = 50) {
    try {
      let url = `${this.supabaseUrl}/rest/v1/triogel_orders?order=created_at.desc&limit=${limit}`;
      if (status) {
        url += `&status=eq.${status}`;
      }

      const response = await fetch(url, {
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`
        }
      });

      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      console.error('?? Error fetching orders:', error);
      return [];
    }
  }

  // Get order details with items
  async getOrderDetails(orderId) {
    try {
      // Get order info
      const orderResponse = await fetch(
        `${this.supabaseUrl}/rest/v1/triogel_orders?order_id=eq.${orderId}`,
        {
          headers: {
            'apikey': this.supabaseKey,
            'Authorization': `Bearer ${this.supabaseKey}`
          }
        }
      );

      // Get order items
      const itemsResponse = await fetch(
        `${this.supabaseUrl}/rest/v1/triogel_order_items?order_id=eq.${orderId}`,
        {
          headers: {
            'apikey': this.supabaseKey,
            'Authorization': `Bearer ${this.supabaseKey}`
          }
        }
      );

      if (orderResponse.ok && itemsResponse.ok) {
        const orders = await orderResponse.json();
        const items = await itemsResponse.json();
        
        return {
          order: orders[0] || null,
          items: items || []
        };
      }
      return null;
    } catch (error) {
      console.error('?? Error fetching order details:', error);
      return null;
    }
  }

  // Update order status
  async updateOrderStatus(orderId, status, adminNotes = null) {
    try {
      const updateData = {
        status: status,
        updated_at: new Date().toISOString()
      };

      if (adminNotes) {
        updateData.admin_notes = adminNotes;
      }

      const response = await fetch(
        `${this.supabaseUrl}/rest/v1/triogel_orders?order_id=eq.${orderId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': this.supabaseKey,
            'Authorization': `Bearer ${this.supabaseKey}`,
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(updateData)
        }
      );

      if (response.ok) {
        console.log(`? Order ${orderId} status updated to ${status}`);
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('?? Error updating order status:', error);
      return null;
    }
  }
}

module.exports = TriogelDatabase;