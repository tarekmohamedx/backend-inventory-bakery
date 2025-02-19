const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/userprofile1.controller');
router.get('/profile/:userId', userProfileController.getUserProfile);

// Update user profile by ID
router.put('/profile/:userId', userProfileController.updateUserProfile);

module.exports = router;