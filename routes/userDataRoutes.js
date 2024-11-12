const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/user-dashboard-data', auth, userController.userData);
router.get('/user-passkey', auth, userController.userPassKeys);
module.exports = router;