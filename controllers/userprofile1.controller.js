// controllers/userProfile.controller.js
const express = require('express');
const router = express.Router();
const userService = require('../services/users.service');

// Get user profile
router.get('/:userId', async (req, res) => {
  console.log('Fetching user with ID:', req.params.id);
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      throw new Error('User not found');
    }
    console.log('User found:', user);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Update user profile
router.put('/:userId', async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;