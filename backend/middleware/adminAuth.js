const { poolPromise, sql } = require('../db');

/**
 * Middleware to verify admin role
 * Expects userId in request body or query parameters
 */
const verifyAdmin = async (req, res, next) => {
  try {
    const userId = req.body.userId || req.query.userId;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required for admin verification'
      });
    }

    const pool = await poolPromise;
    const query = `
      SELECT userRole 
      FROM Facility_Users 
      WHERE id = @userId AND isActive = 1
    `;
    
    const request = pool.request();
    request.input('userId', sql.Int, userId);
    const result = await request.query(query);
    
    if (result.recordset.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }
    
    const user = result.recordset[0];
    if (user.userRole !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }
    
    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error verifying admin role'
    });
  }
};

module.exports = { verifyAdmin };