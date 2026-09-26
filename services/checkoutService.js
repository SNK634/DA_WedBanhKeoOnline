const mongoose = require('mongoose');
const Product = require('../models/Product');
const cartService = require('./cartService');
const { mockProducts } = require('./mockData');

const STANDARD_SHIPPING_FEE = 30000;
const FREE_SHIPPING_THRESHOLD = 500000;

async function getProducts(productIds) {
    if (mongoose.connection.readyState === 1) {
        return Product.find({ _id: { $in: productIds } }).lean();
    }
    const idSet = new Set(productIds);
    return mockProducts.filter((product) => idSet.has(product._id));
}

async function getCheckoutSnapshot(ownerId) {
    const storedItems = await cartService.getCart(ownerId);
    const validItems = storedItems.filter((item) => mongoose.isValidObjectId(item.productId));
    const products = await getProducts(validItems.map((item) => item.productId));
    const productMap = new Map(products.map((product) => [product._id.toString(), product]));
    const items = validItems
        .map((item) => {
            const product = productMap.get(item.productId);
            if (!product || product.stock < 1) return null;
            const quantity = Math.min(Math.max(1, item.quantity), product.stock);
            return {
                product,
                productId: product._id.toString(),
                name: product.name,
                image: product.image,
                price: product.price,
                quantity,
                subtotal: product.price * quantity
            };
        })
        .filter(Boolean);
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;

    return {
        items,
        subtotal,
        shippingFee,
        totalAmount: subtotal + shippingFee,
        isDemoMode: mongoose.connection.readyState !== 1 || !cartService.isConfigured()
    };
}

module.exports = {
    FREE_SHIPPING_THRESHOLD,
    STANDARD_SHIPPING_FEE,
    getCheckoutSnapshot
};
