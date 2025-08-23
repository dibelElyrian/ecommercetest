const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

// Secure admin configuration - stored server-side only
const ADMIN_CONFIG = {
  // Admin emails stored as environment variables for security
  superAdmins: (process.env.SUPER_ADMIN_EMAILS || '').split(',').map(email => email.trim()).filter(Boolean),
  managers: (process.env.MANAGER_EMAILS || '').split(',').map(email => email.trim()).filter(Boolean),
  basicAdmins: (process.env.BASIC_ADMIN_EMAILS || '').split(',').map(email => email.trim()).filter(Boolean),
  
  // Admin levels
  SUPER_ADMIN: 3,
  MANAGER: 2,
  BASIC_ADMIN: 1,
  REGULAR_USER: 0
};

/**
 * Securely determine admin level for a user
 */
function getAdminLevel(email) {
  if (!email || typeof email !== 'string') return ADMIN_CONFIG.REGULAR_USER;
  
  const normalizedEmail = email.toLowerCase().trim();
  
  if (ADMIN_CONFIG.superAdmins.includes(normalizedEmail)) {
    return ADMIN_CONFIG.SUPER_ADMIN;
  }
  
  if (ADMIN_CONFIG.managers.includes(normalizedEmail)) {
    return ADMIN_CONFIG.MANAGER;
  }
  
  if (ADMIN_CONFIG.basicAdmins.includes(normalizedEmail)) {
    return ADMIN_CONFIG.BASIC_ADMIN;
  }
  
  return ADMIN_CONFIG.REGULAR_USER;
}

/**
 * Verify admin access and get permissions
 */
function verifyAdminAccess(email, requiredLevel = 1) {
  const adminLevel = getAdminLevel(email);
  
  return {
    isAdmin: adminLevel >= 1,
    adminLevel: adminLevel,
    hasAccess: adminLevel >= requiredLevel,
    permissions: {
      canViewOrders: adminLevel >= 1,
      canUpdateOrders: adminLevel >= 1,
      canViewCustomers: adminLevel >= 2,
      canManageItems: adminLevel >= 2,
      canAccessAnalytics: adminLevel >= 2,
      canExportData: adminLevel >= 2,
      canManageAdmins: adminLevel >= 3,
      canAccessLogs: adminLevel >= 3
    }
  };
}

/**
 * Hash email for privacy in logs
 */
function hashEmail(email) {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(email + (process.env.EMAIL_HASH_SALT || 'triogel-salt')).digest('hex');
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
    console.log('?? Admin auth request:', event.httpMethod);

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

    // Get admin status (without exposing email lists)
    const adminAccess = verifyAdminAccess(userEmail);

    // Log admin access attempt (for security monitoring)
    if (adminAccess.isAdmin) {
      console.log('? Admin access granted:', {
        level: adminAccess.adminLevel,
        timestamp: new Date().toISOString()
      });
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        isAdmin: adminAccess.isAdmin,
        adminLevel: adminAccess.adminLevel,
        permissions: adminAccess.permissions,
        message: adminAccess.isAdmin ? 'Admin access granted' : 'Regular user access'
      })
    };

  } catch (error) {
    console.error('?? Admin auth error:', error);
    
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