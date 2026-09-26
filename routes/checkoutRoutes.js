const express = require('express');
const checkoutController = require('../controllers/checkoutController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', requireAuth, checkoutController.renderCheckout);
router.post('/', requireAuth, checkoutController.placeOrder);

module.exports = router;
