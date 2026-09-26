const express = require('express');
const orderController = require('../controllers/orderController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', requireAuth, orderController.listOrders);
router.get('/:id/success', requireAuth, orderController.orderSuccess);
router.get('/:id', requireAuth, orderController.orderDetail);

module.exports = router;
