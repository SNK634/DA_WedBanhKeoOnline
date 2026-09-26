const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const cartService = require('../services/cartService');
const { getCheckoutSnapshot } = require('../services/checkoutService');
const { getCartOwner } = require('./cartController');

const PAYMENT_METHODS = ['cod', 'momo', 'bank'];

function getDefaultFormData(user) {
    return {
        fullName: user.fullName || '',
        email: user.email || '',
        phone: '',
        address: '',
        city: '',
        district: '',
        ward: '',
        note: '',
        paymentMethod: 'cod'
    };
}

function getFormData(body, user) {
    const defaults = getDefaultFormData(user);
    return Object.fromEntries(Object.keys(defaults).map((key) => [
        key,
        String(body[key] ?? defaults[key]).trim()
    ]));
}

function validateCheckout(formData) {
    const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'district', 'ward', 'paymentMethod'];
    if (requiredFields.some((field) => !formData[field])) {
        return 'Vui lòng nhập đầy đủ thông tin người nhận và phương thức thanh toán.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        return 'Email người nhận không hợp lệ.';
    }
    if (!/^[0-9+\s.-]{8,15}$/.test(formData.phone)) {
        return 'Số điện thoại không hợp lệ.';
    }
    if (!PAYMENT_METHODS.includes(formData.paymentMethod)) {
        return 'Phương thức thanh toán không hợp lệ.';
    }
    return null;
}

async function renderCheckout(req, res, next) {
    try {
        const snapshot = await getCheckoutSnapshot(getCartOwner(req));
        if (!snapshot.items.length) {
            return res.redirect('/cart?empty=1');
        }
        return res.render('checkout/index', {
            pageTitle: 'Thanh toán',
            ...snapshot,
            formData: getDefaultFormData(req.session.user),
            error: null
        });
    } catch (error) {
        return next(error);
    }
}

async function createDemoOrder(req, snapshot, formData) {
    const demoId = `DEMO-${Date.now().toString(36).toUpperCase()}`;
    const order = {
        _id: demoId,
        userId: req.session.user.id,
        customerInfo: formData,
        items: snapshot.items.map(({ product, ...item }) => item),
        subtotal: snapshot.subtotal,
        shippingFee: snapshot.shippingFee,
        totalAmount: snapshot.totalAmount,
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentMethod === 'cod' ? 'unpaid' : 'paid',
        orderStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDemo: true
    };
    req.session.demoOrders = [order, ...(req.session.demoOrders || [])];
    await cartService.clearCart(getCartOwner(req));
    await new Promise((resolve, reject) => req.session.save((error) => error ? reject(error) : resolve()));
    return order;
}

async function createRealOrder(req, snapshot, formData) {
    const updatedItems = [];
    let orderCreated = false;
    try {
        for (const item of snapshot.items) {
            const result = await Product.updateOne(
                { _id: item.productId, stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity, soldCount: item.quantity } }
            );
            if (result.modifiedCount !== 1) {
                throw new Error(`${item.name} không còn đủ số lượng trong kho.`);
            }
            updatedItems.push(item);
        }

        const order = await Order.create({
            userId: req.session.user.id,
            customerInfo: formData,
            items: snapshot.items.map(({ product, ...item }) => item),
            subtotal: snapshot.subtotal,
            shippingFee: snapshot.shippingFee,
            totalAmount: snapshot.totalAmount,
            paymentMethod: formData.paymentMethod,
            paymentStatus: formData.paymentMethod === 'cod' ? 'unpaid' : 'paid',
            orderStatus: 'pending'
        });
        orderCreated = true;
        try {
            await cartService.clearCart(getCartOwner(req));
        } catch (error) {
            console.error('Order created but cart could not be cleared:', error);
        }
        return order.toObject();
    } catch (error) {
        if (updatedItems.length && !orderCreated) {
            await Product.bulkWrite(updatedItems.map((item) => ({
                updateOne: {
                    filter: { _id: item.productId },
                    update: { $inc: { stock: item.quantity, soldCount: -item.quantity } }
                }
            })));
        }
        throw error;
    }
}

async function placeOrder(req, res, next) {
    const formData = getFormData(req.body, req.session.user);
    const validationError = validateCheckout(formData);

    try {
        const snapshot = await getCheckoutSnapshot(getCartOwner(req));
        if (!snapshot.items.length) {
            return res.redirect('/cart?empty=1');
        }
        if (validationError) {
            return res.status(400).render('checkout/index', {
                pageTitle: 'Thanh toán',
                ...snapshot,
                formData,
                error: validationError
            });
        }

        const order = snapshot.isDemoMode
            ? await createDemoOrder(req, snapshot, formData)
            : await createRealOrder(req, snapshot, formData);
        return res.redirect(`/orders/${order._id}/success`);
    } catch (error) {
        console.error('Checkout error:', error);
        try {
            const snapshot = await getCheckoutSnapshot(getCartOwner(req));
            return res.status(400).render('checkout/index', {
                pageTitle: 'Thanh toán',
                ...snapshot,
                formData,
                error: error.message || 'Không thể tạo đơn hàng.'
            });
        } catch {
            return next(error);
        }
    }
}

module.exports = { placeOrder, renderCheckout };
