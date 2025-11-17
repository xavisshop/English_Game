const express = require('express');
const { register, login, getProfile, refreshToken } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.post('/refresh', protect, refreshToken);

module.exports = router;