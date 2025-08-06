const { poolPromise, sql } = require("../db");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Users");
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
  const {
    firstName, lastName, email, phoneNumber, department, location, userRole,
    accountStatus, temporaryPassword, canViewClaims, canProcessClaims,
    canCreatePolicies, canManageUsers, additionalNotes
  } = req.body;


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
      .input("canViewClaims", sql.Bit, canViewClaims)
      .input("canProcessClaims", sql.Bit, canProcessClaims)
      .input("canCreatePolicies", sql.Bit, canCreatePolicies)
      .input("canManageUsers", sql.Bit, canManageUsers)
      .input("additionalNotes", sql.VarChar, additionalNotes)
      .input("createdAt", sql.DateTime, new Date())
      .input("updatedAt", sql.DateTime, new Date())
      .query(`
        INSERT INTO Users (
          firstName, lastName, email, phoneNumber, department, location, userRole,
          accountStatus, temporaryPassword, canViewClaims, canProcessClaims,
          canCreatePolicies, canManageUsers, additionalNotes, createdAt, updatedAt
        )
        VALUES (
          @firstName, @lastName, @email, @phoneNumber, @department, @location, @userRole,
          @accountStatus, @temporaryPassword, @canViewClaims, @canProcessClaims,
          @canCreatePolicies, @canManageUsers, @additionalNotes, @createdAt, @updatedAt
        )
      `);
    res.status(200).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    firstName, lastName, email, phoneNumber, department, location, userRole,
    accountStatus, temporaryPassword, canViewClaims, canProcessClaims,
    canCreatePolicies, canManageUsers, additionalNotes
  } = req.body;
  console.log("*****************************",req.body);
  

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.UniqueIdentifier, id)
      .input("firstName", sql.VarChar, firstName)
      .input("lastName", sql.VarChar, lastName)
      .input("email", sql.VarChar, email)
      .input("phoneNumber", sql.VarChar, phoneNumber)
      .input("department", sql.VarChar, department)
      .input("location", sql.VarChar, location)
      .input("userRole", sql.VarChar, userRole)
      .input("accountStatus", sql.VarChar, accountStatus)
      .input("temporaryPassword", sql.VarChar, temporaryPassword)
      .input("canViewClaims", sql.Bit, canViewClaims)
      .input("canProcessClaims", sql.Bit, canProcessClaims)
      .input("canCreatePolicies", sql.Bit, canCreatePolicies)
      .input("canManageUsers", sql.Bit, canManageUsers)
      .input("additionalNotes", sql.VarChar, additionalNotes)
      .input("updatedAt", sql.DateTime, new Date())
      .query(`
        UPDATE Users SET
          firstName = @firstName, lastName = @lastName, email = @email,
          phoneNumber = @phoneNumber, department = @department, location = @location,
          userRole = @userRole, accountStatus = @accountStatus, temporaryPassword = @temporaryPassword,
          canViewClaims = @canViewClaims, canProcessClaims = @canProcessClaims,
          canCreatePolicies = @canCreatePolicies, canManageUsers = @canManageUsers,
          additionalNotes = @additionalNotes, updatedAt = @updatedAt
        WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.UniqueIdentifier, id)
      .query("DELETE FROM Users WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
