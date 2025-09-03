// LilyBlock Online Shop Admin Utilities - Production Version

// Enhanced Admin Action Functions
window.updateOrderStatus = async function (orderId, newStatus) {
    try {
        console.log('Updating order status:', orderId, newStatus);

        const currentUser = window.LilyBlockOnlineShopAuth?.getCurrentUser();

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
                    adminLevel: window.LilyBlockOnlineShopAuth.getAdminLevel(),
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

        // Fallback: No localStorage update, just notify
        showNotification('? Order not updated (local storage disabled)');
    } catch (error) {
        console.error('Error updating order status:', error);
        showNotification('? Error updating order status');
    }
};

window.contactCustomer = function (orderId, customerEmail) {
    try {
        console.log('Contacting customer:', customerEmail, 'for order:', orderId);

        const emailSubject = orderId ?
            `LilyBlock Online Shop Order Update - ${orderId}` :
            'LilyBlock Online Shop Customer Service';

        const emailBody = orderId ?
            `Hello,\n\nRegarding your LilyBlock Online Shop order ${orderId}.\n\nWe will process your order and contact you for in-game delivery coordination.\n\nPlease provide your in-game username and preferred time for delivery if you haven't already.\n\nBest regards,\nLilyBlock Online Shop Team` :
            `Hello,\n\nThank you for being a valued LilyBlock Online Shop customer.\n\nIf you have any questions or need assistance, please don't hesitate to reach out.\n\nBest regards,\nLilyBlock Online Shop Team`;

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

console.log('Admin utilities loaded successfully');