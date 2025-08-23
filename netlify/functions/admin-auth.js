const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

// Secure admin configuration - only use existing Netlify variables
const ADMIN_CONFIG = {
  // Only use SUPER_ADMIN_EMAILS since that's what exists in Netlify
  adminEmails: (process.env.SUPER_ADMIN_EMAILS || 'admin@triogel.com,ryanserdan@gmail.com').split(',').map(email => email.trim()).filter(Boolean)
};

/**
 * Check if email is admin
 */
function isAdminEmail(email) {
  if (!email || typeof email !== 'string') return false;
  
  const normalizedEmail = email.toLowerCase().trim();
  return ADMIN_CONFIG.adminEmails.includes(normalizedEmail);
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { action, userEmail } = body;

    // Input validation
    if (!userEmail || !action) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Missing required parameters'
        })
      };
    }

    // Check if user is admin
    const isAdmin = isAdminEmail(userEmail);

    // Simple admin permissions
    const permissions = {
      canViewOrders: isAdmin,
      canUpdateOrders: isAdmin,
      canViewCustomers: isAdmin,
      canManageItems: isAdmin,
      canAccessAnalytics: isAdmin,
      canExportData: isAdmin
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        isAdmin: isAdmin,
        adminLevel: isAdmin ? 3 : 0,
        permissions: permissions,
        message: isAdmin ? 'Admin access granted' : 'Regular user access'
      })
    };

  } catch (error) {
    console.error('Admin auth error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error'
      })
    };
  }
};