const mongoose = require('mongoose');
const Product = require('../models/Product');
const cartService = require('../services/cartService');
const { mockProducts } = require('../services/mockData');

function getCartOwner(req) {
    return req.session.user?.id || req.sessionID;
}

async function findProductsByIds(productIds) {
    if (mongoose.connection.readyState === 1) {
        return Product.find({ _id: { $in: productIds } }).lean();
    }
    const idSet = new Set(productIds);
    return mockProducts.filter((product) => idSet.has(product._id));
}

async function findProductById(productId) {
    if (mongoose.connection.readyState === 1) {
        return Product.findById(productId).lean();
    }
    return mockProducts.find((product) => product._id === productId) || null;
}

async function renderCart(req, res, next) {
    try {
        const storedItems = await cartService.getCart(getCartOwner(req));
        const productIds = storedItems
            .map((item) => item.productId)
            .filter((id) => mongoose.isValidObjectId(id));
        const products = await findProductsByIds(productIds);
        const productMap = new Map(products.map((product) => [product._id.toString(), product]));
        const items = storedItems
            .map((item) => ({ product: productMap.get(item.productId), quantity: item.quantity }))
            .filter((item) => item.product);
        const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

        return res.render('cart/index', {
            pageTitle: 'Giỏ hàng',
            items,
            total,
            cartError: req.query.empty === '1'
                ? 'Giỏ hàng đang trống. Hãy thêm sản phẩm trước khi thanh toán.'
                : (mongoose.connection.readyState !== 1 || !cartService.isConfigured()
                    ? 'Đang chạy dữ liệu mẫu: giỏ hàng chỉ được lưu tạm trong bộ nhớ và sẽ mất khi dừng server.'
                    : null)
        });
    } catch (error) {
        console.error('Cart render error:', error);
        return res.status(503).render('cart/index', {
            pageTitle: 'Giỏ hàng',
            items: [],
            total: 0,
            cartError: 'Redis chưa sẵn sàng. Hãy kiểm tra REDIS_URL và khởi động Redis.'
        });
    }
}

async function addToCart(req, res, next) {
    try {
        const productId = String(req.body.productId || '');
        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).send('Sản phẩm không hợp lệ.');
        }

        const product = await findProductById(productId);
        if (!product || product.stock < 1) {
            return res.status(404).send('Sản phẩm không tồn tại hoặc đã hết hàng.');
        }

        await cartService.addItem(getCartOwner(req), productId, 1);
        return res.redirect('/cart');
    } catch (error) {
        return next(error);
    }
}

async function updateCartItem(req, res, next) {
    try {
        const productId = String(req.params.productId || '');
        const quantity = Math.max(0, Number.parseInt(req.body.quantity, 10) || 0);
        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).send('Sản phẩm không hợp lệ.');
        }

        const product = await findProductById(productId);
        const safeQuantity = product ? Math.min(quantity, product.stock) : 0;
        await cartService.updateItem(getCartOwner(req), productId, safeQuantity);
        return res.redirect('/cart');
    } catch (error) {
        return next(error);
    }
}

async function removeCartItem(req, res, next) {
    try {
        const productId = String(req.params.productId || '');
        if (mongoose.isValidObjectId(productId)) {
            await cartService.removeItem(getCartOwner(req), productId);
        }
        return res.redirect('/cart');
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    addToCart,
    getCartOwner,
    removeCartItem,
    renderCart,
    updateCartItem
};
