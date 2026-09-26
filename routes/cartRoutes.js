const express = require('express');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.get('/', cartController.renderCart);
router.post('/add', cartController.addToCart);
router.post('/update/:productId', cartController.updateCartItem);
router.post('/remove/:productId', cartController.removeCartItem);

module.exports = router;
