const { poolPromise, sql } = require("../db");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Users_ WHERE isActive = 1");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single user
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Users_ WHERE id = @id");

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create user
exports.createUser = async (req, res) => {
  const {firstName,lastName,email,phoneNumber,department,location,userRole,accountStatus,temporaryPassword,additionalNotes,companyAccess,permissions} = req.body;

  // Destructure permissions (avoid undefined)
  const {
    viewClaims = false,
    processClaims = false,
    createPolicies = false,
    manageUsers = false
  } = permissions || {};

  try {
    const pool = await poolPromise;

    await pool.request()
      .input("firstName", sql.VarChar, firstName)
      .input("lastName", sql.VarChar, lastName)
      .input("email", sql.VarChar, email)
      .input("phoneNumber", sql.VarChar, phoneNumber)
      .input("department", sql.VarChar, department)
      .input("location", sql.VarChar, location)
      .input("userRole", sql.VarChar, userRole)
      .input("accountStatus", sql.VarChar, accountStatus)
      .input("temporaryPassword", sql.VarChar, temporaryPassword)
      .input("canViewClaims", sql.Bit, viewClaims)
      .input("canProcessClaims", sql.Bit, processClaims)
      .input("canCreatePolicies", sql.Bit, createPolicies)
      .input("canManageUsers", sql.Bit, manageUsers)
      .input("additionalNotes", sql.VarChar, additionalNotes)
      .input("createdAt", sql.DateTime, new Date())
      .input("updatedAt", sql.DateTime, new Date())
      .input("companyAccess", sql.VarChar, JSON.stringify(companyAccess))
      .query(`
        INSERT INTO Users_ (
          firstName, lastName, email, phoneNumber, department, location, userRole,
          accountStatus, temporaryPassword, canViewClaims, canProcessClaims,
          canCreatePolicies, canManageUsers, additionalNotes,
          companyAccess, createdAt, updatedAt
        )
        VALUES (
          @firstName, @lastName, @email, @phoneNumber, @department, @location, @userRole,
          @accountStatus, @temporaryPassword, @canViewClaims, @canProcessClaims,
          @canCreatePolicies, @canManageUsers, @additionalNotes,
          @companyAccess, @createdAt, @updatedAt
        )
      `);

    res.status(200).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: err.message });
  }
};


// Update user  ::  PUT /api/users/update/:id
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const pool = await poolPromise;

    // Dynamically build the query based on fields provided
    const setClauses = [];
    const request = pool.request().input("id", sql.Int, id);

    if (updates.firstName !== undefined) {
      setClauses.push("firstName = @firstName");
      request.input("firstName", sql.VarChar, updates.firstName);
    }
    if (updates.lastName !== undefined) {
      setClauses.push("lastName = @lastName");
      request.input("lastName", sql.VarChar, updates.lastName);
    }
    if (updates.email !== undefined) {
      setClauses.push("email = @email");
      request.input("email", sql.VarChar, updates.email);
    }
    if (updates.phoneNumber !== undefined) {
      setClauses.push("phoneNumber = @phoneNumber");
      request.input("phoneNumber", sql.VarChar, updates.phoneNumber);
    }
    if (updates.department !== undefined) {
      setClauses.push("department = @department");
      request.input("department", sql.VarChar, updates.department);
    }
    if (updates.location !== undefined) {
      setClauses.push("location = @location");
      request.input("location", sql.VarChar, updates.location);
    }
    if (updates.userRole !== undefined) {
      setClauses.push("userRole = @userRole");
      request.input("userRole", sql.VarChar, updates.userRole);
    }
    if (updates.isActive !== undefined) {
      setClauses.push("isActive = @isActive");
      request.input("isActive", sql.Bit, updates.isActive ? 1 : 0);
    }
    if (updates.accountStatus !== undefined) {
      setClauses.push("accountStatus = @accountStatus");
      request.input("accountStatus", sql.VarChar, updates.accountStatus);
    }

    // ⛔ Prevent running empty update
    if (setClauses.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const query = `
      UPDATE Users_
      SET ${setClauses.join(", ")}
      WHERE id = @id
    `;

    await request.query(query);

    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Delete user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input("id", sql.Int, id)
      .query("UPDATE Users_ SET isActive = 0 WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "User not found or already inactive" });
    }

    res.json({ message: "User soft deleted successfully" });
  } catch (err) {
    console.error("Soft delete error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ 
      success: false,
      message: "Email, password, and role are required" 
    });
  }

  try {
    // Get database connection pool
    let pool;
    try {
      pool = await poolPromise;
    } catch (poolError) {
      return res.status(500).json({
        success: false,
        message: 'Database connection failed',
        error: poolError.message
      });
    }
    
    // First, check if user exists with the given email
    const query = `
      SELECT 
        id, firstName, lastName, email, 
        temporaryPassword,  -- Using temporaryPassword instead of password
        userRole, isActive, department, location
      FROM Users_ 
      WHERE email = @email
    `;
    
    const cleanQuery = query.replace(/\s+/g, ' ').trim();
    
    // Query the database for the user by email
    let userResult;
    try {
      const request = pool.request();
      request.input('email', sql.VarChar, email);
      
      userResult = await request.query(query);
      
      if (userResult.recordset.length === 0) {
        return res.status(401).json({ 
          success: false,
          message: "Invalid email or password" 
        });
      }
    } catch (dbError) {
      console.error('Database query error:', dbError);
      return res.status(500).json({
        success: false,
        message: "Database error during login"
      });
    }
    
    if (userResult.recordset.length === 0) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    const user = userResult.recordset[0];

    // Check password (case-sensitive)
    const storedPassword = user.temporaryPassword;

    // Compare passwords
    const isPasswordMatch = password === storedPassword;
    
    if (!isPasswordMatch) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }
    
    // Check if user's role matches the selected role (case-insensitive)
    if (user.userRole.toLowerCase() !== role.toLowerCase()) {
      return res.status(403).json({ 
        success: false,
        message: `Access denied. Your account is registered as ${user.userRole}.` 
      });
    }

    // If we get here, credentials and role are valid
    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userRole: user.userRole,
      // Include other necessary user data, but never send password back
      department: user.department,
      location: user.location
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "An error occurred during login. Please try again." });
  }
};


//
exports.getUserRoleByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("email", sql.VarChar, email)
      .query(`
        SELECT userRole 
        FROM Users_ 
        WHERE email = @email AND isActive = 1
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ userRole: result.recordset[0].userRole });
  } catch (err) {
    console.error("Error fetching user role:", err);
    res.status(500).json({ error: err.message });
  }
};

