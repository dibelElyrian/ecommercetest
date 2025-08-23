const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service key for admin operations
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
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
 * @param {string} email - User email to check
 * @returns {number} Admin level (0 = regular user, 1-3 = admin levels)
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
 * @param {string} email - User email
 * @param {number} requiredLevel - Minimum required admin level
 * @returns {Object} Admin verification result
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
    const { action, userEmail, sessionToken } = body;

    console.log('?? Admin auth request:', { action, userEmail: userEmail ? '[REDACTED]' : 'none' });

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

    // Rate limiting check (basic)
    const clientIp = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
    console.log('Request from IP:', clientIp);

    switch (action) {
      case 'check_admin_status':
        return await checkAdminStatus(userEmail, sessionToken);
      
      case 'verify_session':
        return await verifyAdminSession(userEmail, sessionToken);
      
      case 'get_admin_permissions':
        return await getAdminPermissions(userEmail);
      
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

  async function checkAdminStatus(email, sessionToken) {
    try {
      // Verify the user exists and session is valid
      if (sessionToken) {
        const { data: user, error } = await supabase
          .from('triogel_users')
          .select('email, session_token, session_expires')
          .eq('email', email)
          .eq('session_token', sessionToken)
          .single();

        if (error || !user) {
          console.log('Invalid session for admin check');
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({
              success: false,
              error: 'Invalid session'
            })
          };
        }

        // Check session expiry
        if (new Date(user.session_expires) < new Date()) {
          console.log('Expired session for admin check');
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({
              success: false,
              error: 'Session expired'
            })
          };
        }
      }

      // Get admin status (without exposing email lists)
      const adminAccess = verifyAdminAccess(email);

      // Log admin access attempt (for security monitoring)
      if (adminAccess.isAdmin) {
        console.log('? Admin access granted:', {
          level: adminAccess.adminLevel,
          timestamp: new Date().toISOString()
        });

        // Log to database for audit trail
        try {
          await supabase.from('triogel_admin_logs').insert({
            admin_email_hash: await hashEmail(email), // Hash for privacy
            action: 'admin_status_check',
            admin_level: adminAccess.adminLevel,
            ip_address: clientIp,
            timestamp: new Date().toISOString(),
            success: true
          });
        } catch (logError) {
          console.warn('Failed to log admin access:', logError);
        }
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          isAdmin: adminAccess.isAdmin,
          adminLevel: adminAccess.adminLevel,
          permissions: adminAccess.permissions,
          // Never expose actual admin email lists
          message: adminAccess.isAdmin ? 'Admin access granted' : 'Regular user access'
        })
      };

    } catch (error) {
      console.error('Error checking admin status:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Failed to verify admin status'
        })
      };
    }
  }

  async function verifyAdminSession(email, sessionToken) {
    try {
      const { data: user, error } = await supabase
        .from('triogel_users')
        .select('email, session_token, session_expires, last_login')
        .eq('email', email)
        .eq('session_token', sessionToken)
        .single();

      if (error || !user) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Invalid session'
          })
        };
      }

      if (new Date(user.session_expires) < new Date()) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Session expired'
          })
        };
      }

      const adminAccess = verifyAdminAccess(email);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          isAdmin: adminAccess.isAdmin,
          adminLevel: adminAccess.adminLevel,
          permissions: adminAccess.permissions,
          lastLogin: user.last_login
        })
      };

    } catch (error) {
      console.error('Error verifying admin session:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Session verification failed'
        })
      };
    }
  }

  async function getAdminPermissions(email) {
    try {
      const adminAccess = verifyAdminAccess(email);

      if (!adminAccess.isAdmin) {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Access denied'
          })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          permissions: adminAccess.permissions,
          adminLevel: adminAccess.adminLevel
        })
      };

    } catch (error) {
      console.error('Error getting admin permissions:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Failed to get permissions'
        })
      };
    }
  }
};

/**
 * Hash email for privacy in logs
 * @param {string} email 
 * @returns {string} Hashed email
 */
async function hashEmail(email) {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(email + (process.env.EMAIL_HASH_SALT || 'triogel-salt')).digest('hex');
}