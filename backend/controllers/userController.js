const { poolPromise, sql } = require("../db");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Users WHERE isActive = 1");
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
      .query("SELECT * FROM Users WHERE id = @id");

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

  console.log("Request body:", req.body);

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
        INSERT INTO Users (
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
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    department,
    location,
    userRole,
    isActive
  } = req.body;

  try {
    const pool = await poolPromise;

     await pool.request()
      .input('id', sql.Int, id)
      .input("firstName", sql.VarChar, firstName)
      .input("lastName", sql.VarChar, lastName)
      .input('email', sql.VarChar, email)
      .input('phoneNumber', sql.VarChar, phoneNumber)
      .input('department', sql.VarChar, department)
      .input('location', sql.VarChar, location)
      .input('userRole', sql.VarChar, userRole)
      .input('isActive', sql.Bit, isActive ? 'Active' : 'Inactive')
      .query(`
        UPDATE Users
        SET
          firstName = @firstName,
          lastName = @lastName,
          email = @email,
          phoneNumber = @phoneNumber,
          department = @department,
          location = @location,
          userRole = @userRole,
          isActive = @isActive
        WHERE id = @id
      `);

    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ error: 'Internal server error' });
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
      .query("UPDATE Users SET isActive = 0 WHERE id = @id");

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
  const { email, password } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("email", sql.VarChar, email)
      .input("password", sql.VarChar, password)
      .query("SELECT * FROM Users WHERE email = @email AND password = @password");

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
};


