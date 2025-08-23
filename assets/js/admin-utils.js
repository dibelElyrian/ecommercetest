/**
 * TRIOGEL Admin Utilities
 * Enhanced admin functions for order management, customer service, and data operations
 */

// Enhanced Admin Action Functions
window.updateOrderStatus = async function(orderId, newStatus) {
    try {
        console.log('Updating order status:', orderId, newStatus);
        
        const currentUser = window.TriogelAuth?.getCurrentUser();
        
        // Try admin API first
        try {
            const response = await fetch('/.netlify/functions/admin-api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'update_order_status',
                    adminEmail: currentUser.email,
                    adminLevel: window.TriogelAuth.getAdminLevel(),
                    orderId: orderId,
                    newStatus: newStatus,
                    adminNotes: `Updated by ${currentUser.username} on ${new Date().toLocaleString()}`
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    showNotification(`? Order ${orderId} updated to ${newStatus}`);
                    if (typeof loadAdminOrders === 'function') loadAdminOrders(); // Refresh the display
                    return;
                }
            }
        } catch (serverError) {
            console.log('API not available, updating locally');
        }
        
        // Fallback: Update in localStorage
        const localOrders = JSON.parse(localStorage.getItem('triogel-orders') || '[]');
        const orderIndex = localOrders.findIndex(order => (order.orderId || order.order_id) === orderId);
        
        if (orderIndex >= 0) {
            localOrders[orderIndex].status = newStatus;
            localOrders[orderIndex].updated_at = new Date().toISOString();
            localOrders[orderIndex].admin_notes = `Updated by ${currentUser.username} on ${new Date().toLocaleString()}`;
            localStorage.setItem('triogel-orders', JSON.stringify(localOrders));
            
            showNotification(`? Order ${orderId} marked as ${newStatus}`);
            if (typeof loadAdminOrders === 'function') loadAdminOrders(); // Refresh the display
        } else {
            showNotification('? Order not found');
        }
        
    } catch (error) {
        console.error('Error updating order status:', error);
        showNotification('? Error updating order status');
    }
};

window.contactCustomer = function(orderId, customerEmail) {
    try {
        console.log('Contacting customer:', customerEmail, 'for order:', orderId);
        
        const emailSubject = orderId ? 
            `TRIOGEL Order Update - ${orderId}` : 
            'TRIOGEL Customer Service';
            
        const emailBody = orderId ? 
            `Hello,\n\nRegarding your TRIOGEL order ${orderId}.\n\nWe will process your order and contact you for in-game delivery coordination.\n\nPlease provide your in-game username and preferred time for delivery if you haven't already.\n\nBest regards,\nTRIOGEL Team` :
            `Hello,\n\nThank you for being a valued TRIOGEL customer.\n\nIf you have any questions or need assistance, please don't hesitate to reach out.\n\nBest regards,\nTRIOGEL Team`;
        
        // Create mailto link
        const mailtoLink = `mailto:${customerEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        
        // Open email client
        window.open(mailtoLink);
        
        showNotification(`?? Email client opened for ${customerEmail}`);
    } catch (error) {
        console.error('Error contacting customer:', error);
        showNotification('? Error opening email client');
    }
};

window.viewCustomerOrders = function(customerEmail) {
    try {
        console.log('Viewing orders for customer:', customerEmail);
        
        // Find all orders for this customer
        const localOrders = JSON.parse(localStorage.getItem('triogel-orders') || '[]');
        const customerOrders = localOrders.filter(order => 
            (order.email || order.customer_email) === customerEmail
        );
        
        if (customerOrders.length === 0) {
            showNotification('No orders found for this customer');
            return;
        }
        
        const ordersHtml = `
            <div class="customer-orders-modal">
                <h3>Orders for ${customerEmail}</h3>
                <div class="customer-orders-list">
                    ${customerOrders.map(order => `
                        <div class="customer-order-item">
                            <div class="order-summary">
                                <strong>${order.orderId || order.order_id}</strong>
                                <span class="status-${order.status || 'pending'}">${order.status || 'pending'}</span>
                                <span class="order-total">${formatPrice(order.total || order.total_amount)}</span>
                                <span class="order-date">${new Date(order.timestamp || order.created_at).toLocaleDateString()}</span>
                            </div>
                            <div class="order-actions">
                                <button onclick="viewOrderDetails('${order.orderId || order.order_id}'); this.closest('.modal').remove();" class="admin-btn view-btn">View Details</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Create and show modal
        const modal = document.createElement('div');
        modal.className = 'modal customer-orders-modal';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                ${ordersHtml}
            </div>
        `;
        document.body.appendChild(modal);
        
    } catch (error) {
        console.error('Error viewing customer orders:', error);
        showNotification('? Error loading customer orders');
    }
};

window.exportOrders = function() {
    try {
        console.log('Exporting orders...');
        
        const localOrders = JSON.parse(localStorage.getItem('triogel-orders') || '[]');
        
        if (localOrders.length === 0) {
            showNotification('No orders to export');
            return;
        }
        
        // Convert to CSV format
        const headers = ['Order ID', 'Customer Email', 'Game Username', 'Status', 'Payment Method', 'Total', 'Date', 'WhatsApp', 'Region', 'Items'];
        const csvContent = [
            headers.join(','),
            ...localOrders.map(order => [
                `"${order.orderId || order.order_id}"`,
                `"${order.email || order.customer_email}"`,
                `"${order.gameUsername || order.customer_game_username}"`,
                `"${order.status || 'pending'}"`,
                `"${order.paymentMethod || order.payment_method}"`,
                `"${order.total || order.total_amount}"`,
                `"${new Date(order.timestamp || order.created_at).toISOString()}"`,
                `"${order.whatsappNumber || order.customer_whatsapp || ''}"`,
                `"${order.serverRegion || order.customer_region || ''}"`,
                `"${(order.items || []).map(item => `${item.name} x${item.quantity}`).join('; ')}"`
            ].join(','))
        ].join('\n');
        
        // Download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `triogel-orders-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
        
        showNotification(`? Orders exported (${localOrders.length} orders)`);
        
    } catch (error) {
        console.error('Error exporting orders:', error);
        showNotification('? Error exporting orders');
    }
};

window.backupData = function() {
    try {
        console.log('Creating data backup...');
        
        const backupData = {
            orders: JSON.parse(localStorage.getItem('triogel-orders') || '[]'),
            users: JSON.parse(localStorage.getItem('triogel-user') || 'null'),
            offlineUsers: JSON.parse(localStorage.getItem('triogel-offline-users') || '[]'),
            currencyCache: JSON.parse(localStorage.getItem('triogel-currency-cache') || '{}'),
            timestamp: new Date().toISOString(),
            version: '1.0',
            totalOrders: JSON.parse(localStorage.getItem('triogel-orders') || '[]').length,
            adminInfo: {
                exportedBy: window.TriogelAuth?.getCurrentUser()?.username || 'Unknown',
                adminLevel: window.TriogelAuth?.getAdminLevel() || 0
            }
        };
        
        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `triogel-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        window.URL.revokeObjectURL(url);
        
        showNotification('? Data backup created successfully');
        
    } catch (error) {
        console.error('Error creating backup:', error);
        showNotification('? Error creating backup');
    }
};

window.generateReport = function() {
    try {
        console.log('Generating admin report...');
        
        const localOrders = JSON.parse(localStorage.getItem('triogel-orders') || '[]');
        
        if (localOrders.length === 0) {
            showNotification('No data available for report generation');
            return;
        }
        
        // Generate comprehensive report
        const report = {
            reportDate: new Date().toISOString(),
            generatedBy: window.TriogelAuth?.getCurrentUser()?.username || 'Unknown Admin',
            
            summary: {
                totalOrders: localOrders.length,
                totalRevenue: localOrders.reduce((sum, order) => sum + parseFloat(order.total || order.total_amount), 0),
                averageOrderValue: localOrders.reduce((sum, order) => sum + parseFloat(order.total || order.total_amount), 0) / localOrders.length,
            },
            
            statusBreakdown: {
                pending: localOrders.filter(o => (o.status || 'pending') === 'pending').length,
                processing: localOrders.filter(o => (o.status || 'pending') === 'processing').length,
                completed: localOrders.filter(o => (o.status || 'pending') === 'completed').length,
                cancelled: localOrders.filter(o => (o.status || 'pending') === 'cancelled').length
            },
            
            paymentMethods: localOrders.reduce((acc, order) => {
                const method = order.paymentMethod || order.payment_method || 'unknown';
                acc[method] = (acc[method] || 0) + 1;
                return acc;
            }, {}),
            
            gameBreakdown: localOrders.reduce((acc, order) => {
                (order.items || []).forEach(item => {
                    const game = item.game || 'unknown';
                    acc[game] = (acc[game] || 0) + item.quantity;
                });
                return acc;
            }, {}),
            
            recentActivity: {
                last7Days: localOrders.filter(order => {
                    const orderDate = new Date(order.timestamp || order.created_at);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return orderDate >= weekAgo;
                }).length,
                
                last30Days: localOrders.filter(order => {
                    const orderDate = new Date(order.timestamp || order.created_at);
                    const monthAgo = new Date();
                    monthAgo.setDate(monthAgo.getDate() - 30);
                    return orderDate >= monthAgo;
                }).length
            }
        };
        
        // Download report as JSON
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `triogel-report-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        window.URL.revokeObjectURL(url);
        
        showNotification(`? Report generated (${localOrders.length} orders analyzed)`);
        
    } catch (error) {
        console.error('Error generating report:', error);
        showNotification('? Error generating report');
    }
};

// Enhanced order details view
window.viewOrderDetails = function(orderId) {
    try {
        console.log('Viewing order details for:', orderId);
        
        // Find order in localStorage
        const localOrders = JSON.parse(localStorage.getItem('triogel-orders') || '[]');
        const order = localOrders.find(o => (o.orderId || o.order_id) === orderId);
        
        if (order) {
            const detailsHtml = `
                <div class="order-details-modal">
                    <h3>?? Order Details: ${order.orderId || order.order_id}</h3>
                    <div class="order-detail-grid">
                        <div class="detail-section">
                            <h4>?? Customer Information</h4>
                            <p><strong>Email:</strong> ${order.email || order.customer_email}</p>
                            <p><strong>Game Username:</strong> ${order.gameUsername || order.customer_game_username}</p>
                            <p><strong>WhatsApp:</strong> ${order.whatsappNumber || order.customer_whatsapp || 'Not provided'}</p>
                            <p><strong>Region:</strong> ${order.serverRegion || order.customer_region || 'Not specified'}</p>
                        </div>
                        <div class="detail-section">
                            <h4>?? Order Information</h4>
                            <p><strong>Status:</strong> <span class="status-badge status-${order.status || 'pending'}">${(order.status || 'pending').toUpperCase()}</span></p>
                            <p><strong>Payment Method:</strong> ${order.paymentMethod || order.payment_method}</p>
                            <p><strong>Total:</strong> <span class="order-total-detail">${formatPrice(order.total || order.total_amount)}</span></p>
                            <p><strong>Order Date:</strong> ${new Date(order.timestamp || order.created_at).toLocaleString()}</p>
                            ${order.updated_at ? `<p><strong>Last Updated:</strong> ${new Date(order.updated_at).toLocaleString()}</p>` : ''}
                        </div>
                    </div>
                    ${order.items ? `
                        <div class="detail-section">
                            <h4>??? Items Ordered</h4>
                            <div class="items-detail-list">
                                ${order.items.map(item => `
                                    <div class="item-detail-row">
                                        <div class="item-info">
                                            <strong>${item.name}</strong>
                                            <span class="item-game">${(item.game || '').toUpperCase()}</span>
                                            <span class="item-rarity rarity-${item.rarity || 'common'}">${item.rarity || 'common'}</span>
                                        </div>
                                        <div class="item-quantity">Qty: ${item.quantity}</div>
                                        <div class="item-price">${formatPrice(item.price * item.quantity)}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    ${order.customerNotes || order.customer_notes ? `
                        <div class="detail-section">
                            <h4>?? Customer Notes</h4>
                            <div class="notes-box customer-notes">
                                ${order.customerNotes || order.customer_notes}
                            </div>
                        </div>
                    ` : ''}
                    ${order.admin_notes ? `
                        <div class="detail-section">
                            <h4>?? Admin Notes</h4>
                            <div class="notes-box admin-notes">
                                ${order.admin_notes}
                            </div>
                        </div>
                    ` : ''}
                    <div class="detail-actions">
                        <button onclick="contactCustomer('${order.orderId || order.order_id}', '${order.email || order.customer_email}')" class="admin-btn contact-btn">?? Contact Customer</button>
                        <button onclick="updateOrderStatus('${order.orderId || order.order_id}', 'processing'); this.closest('.modal').remove();" class="admin-btn process-btn">? Mark Processing</button>
                        <button onclick="updateOrderStatus('${order.orderId || order.order_id}', 'completed'); this.closest('.modal').remove();" class="admin-btn complete-btn">? Mark Completed</button>
                        <button onclick="updateOrderStatus('${order.orderId || order.order_id}', 'cancelled'); this.closest('.modal').remove();" class="admin-btn cancel-btn">? Cancel Order</button>
                    </div>
                </div>
            `;
            
            // Create and show modal
            const modal = document.createElement('div');
            modal.className = 'modal admin-details-modal';
            modal.style.display = 'block';
            modal.innerHTML = `
                <div class="modal-content order-details-content">
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                    ${detailsHtml}
                </div>
            `;
            document.body.appendChild(modal);
        } else {
            showNotification('? Order not found');
        }
    } catch (error) {
        console.error('Error viewing order details:', error);
        showNotification('? Error loading order details');
    }
};

// Bulk operations for admin
window.bulkUpdateOrders = function(orderIds, newStatus) {
    try {
        console.log('Bulk updating orders:', orderIds, 'to status:', newStatus);
        
        const localOrders = JSON.parse(localStorage.getItem('triogel-orders') || '[]');
        let updatedCount = 0;
        
        localOrders.forEach((order, index) => {
            if (orderIds.includes(order.orderId || order.order_id)) {
                localOrders[index].status = newStatus;
                localOrders[index].updated_at = new Date().toISOString();
                localOrders[index].admin_notes = `Bulk updated to ${newStatus} on ${new Date().toLocaleString()}`;
                updatedCount++;
            }
        });
        
        localStorage.setItem('triogel-orders', JSON.stringify(localOrders));
        
        showNotification(`? ${updatedCount} orders updated to ${newStatus}`);
        if (typeof loadAdminOrders === 'function') loadAdminOrders();
        
    } catch (error) {
        console.error('Error in bulk update:', error);
        showNotification('? Error updating orders');
    }
};

// Search and filter functions
window.searchOrders = function(searchTerm) {
    try {
        console.log('Searching orders for:', searchTerm);
        
        const localOrders = JSON.parse(localStorage.getItem('triogel-orders') || '[]');
        const filteredOrders = localOrders.filter(order => {
            const searchString = [
                order.orderId || order.order_id,
                order.email || order.customer_email,
                order.gameUsername || order.customer_game_username,
                order.paymentMethod || order.payment_method
            ].join(' ').toLowerCase();
            
            return searchString.includes(searchTerm.toLowerCase());
        });
        
        if (typeof displayAdminOrders === 'function') {
            displayAdminOrders(filteredOrders);
        }
        
        showNotification(`Found ${filteredOrders.length} orders matching "${searchTerm}"`);
        
    } catch (error) {
        console.error('Error searching orders:', error);
        showNotification('? Error searching orders');
    }
};

console.log('? Admin utilities loaded successfully');