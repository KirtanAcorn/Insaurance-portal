const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.getAllUsers);
// User CRUD routes
router.get("/id/:id", userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

// Authentication routes
router.post("/login", userController.login);

// Get user role by email
router.get("/email/:email/role", userController.getUserRoleByEmail);


module.exports = router;
