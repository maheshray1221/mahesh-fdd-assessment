const express = require('express');
const router = express.Router();
const { getUsers, getUserProfile } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, adminOnly, getUsers);
router.get('/profile', protect, getUserProfile);

module.exports = router;
