const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const authenticateJWT = require('../middleware/auth.middleware');
const { User } = require('../../database/models');

console.log('usersRoutes.js loaded');

   //GET ALL USERS 
   //GET /api/users
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'role']
    });

    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: users
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: err.message
    });
  }
});

   //GET USER BY ID
   //GET /api/users/:user_id
router.get('/:user_id', authenticateJWT, async (req, res) => {
  try {
    const { user_id } = req.params;

    const user = await User.findOne({
      where: { id: user_id },
      attributes: ['id', 'firstName', 'lastName', 'email', 'role']
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: user
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: err.message
    });
  }
});

   //CREATE USER
  // POST /api/users
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      id: uuidv4(),
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || 'User'
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: err.message
    });
  }
});

module.exports = router;
