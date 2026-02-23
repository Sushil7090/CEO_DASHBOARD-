const express = require("express");
const router = express.Router();
const { User } = require("../../database/models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth.middleware");

// SIGNUP ROUTE
// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, role, salary } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Role validation
    const allowedRoles = ["admin", "manager", "employee"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // Salary validation (optional but recommended)
    if (salary !== undefined && salary < 0) {
      return res.status(400).json({
        success: false,
        message: "Salary cannot be negative",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Auto-generate password
    const autoPassword = `${firstName.toLowerCase()}@123`;

    // Hash password
    const hashedPassword = await bcrypt.hash(autoPassword, 10);

    // Create user (salary defaults to 0 if not provided)
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      salary: salary || 0,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      generatedPassword: autoPassword,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        salary: user.salary,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Signup failed",
    });
  }
});


// LOGIN ROUTE
// POST /api/auth/login

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        user_id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});


router.put("/users/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, role, salary } = req.body;

    // 1️⃣ Check if user exists
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2️⃣ Email duplicate check (if updating email)
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ where: { email } });

      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }
    }

    // 3️⃣ Salary update restriction (Only admin can update salary)
    if (salary !== undefined) {
      if (req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Only admin can update salary",
        });
      }
    }

    // 4️⃣ Update user
    await user.update({
      firstName: firstName ?? user.firstName,
      lastName: lastName ?? user.lastName,
      email: email ?? user.email,
      role: role ?? user.role,
      salary: salary ?? user.salary,
    });

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });

  } catch (error) {
    console.error("Update User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
});

module.exports = router;
