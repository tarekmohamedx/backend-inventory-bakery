const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewere/authentication.middlewere');

// router.use(verifyToken);

router.get('/dashboard', async (req, res) => {
    res.status(200).json({ success: true, data: "Admin Dashboard" });
});

module.exports = router;
