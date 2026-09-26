const mongoose = require('mongoose');
const Order = require('../models/Order');

const paymentLabels = { cod: 'Thanh toán khi nhận hàng', momo: 'Ví MoMo (mô phỏng)', bank: 'Chuyển khoản ngân hàng (mô phỏng)' };
const paymentStatusLabels = { unpaid: 'Chưa thanh toán', paid: 'Đã thanh toán' };
const orderStatusLabels = { pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận', shipping: 'Đang giao', completed: 'Hoàn thành', cancelled: 'Đã hủy' };

function viewData(order, pageTitle) {
    return { pageTitle, order, paymentLabels, paymentStatusLabels, orderStatusLabels };
}

function findDemoOrder(req, orderId) {
    return (req.session.demoOrders || []).find((order) => order._id === orderId) || null;
}

async function findOwnedOrder(req, orderId) {
    const demoOrder = findDemoOrder(req, orderId);
    if (demoOrder) return demoOrder;
    if (mongoose.connection.readyState !== 1 || !mongoose.isValidObjectId(orderId)) return null;
    return Order.findOne({ _id: orderId, userId: req.session.user.id }).lean();
}

async function listOrders(req, res, next) {
    try {
        const orders = mongoose.connection.readyState === 1 && mongoose.isValidObjectId(req.session.user.id)
            ? await Order.find({ userId: req.session.user.id }).sort({ createdAt: -1 }).lean()
            : (req.session.demoOrders || []);
        return res.render('orders/index', {
            pageTitle: 'Đơn hàng của tôi',
            orders,
            isDemoMode: mongoose.connection.readyState !== 1,
            paymentLabels,
            paymentStatusLabels,
            orderStatusLabels
        });
    } catch (error) {
        return next(error);
    }
}

async function orderDetail(req, res, next) {
    try {
        const order = await findOwnedOrder(req, req.params.id);
        if (!order) return res.status(404).render('error', { pageTitle: 'Không tìm thấy đơn hàng', statusCode: 404, message: 'Đơn hàng không tồn tại hoặc không thuộc tài khoản của bạn.' });
        return res.render('orders/detail', viewData(order, 'Chi tiết đơn hàng'));
    } catch (error) {
        return next(error);
    }
}

async function orderSuccess(req, res, next) {
    try {
        const order = await findOwnedOrder(req, req.params.id);
        if (!order) return res.status(404).render('error', { pageTitle: 'Không tìm thấy đơn hàng', statusCode: 404, message: 'Đơn hàng không tồn tại hoặc không thuộc tài khoản của bạn.' });
        return res.render('orders/success', viewData(order, 'Đặt hàng thành công'));
    } catch (error) {
        return next(error);
    }
}

module.exports = { listOrders, orderDetail, orderSuccess };
