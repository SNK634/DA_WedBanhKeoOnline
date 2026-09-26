require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productController = require('./controllers/productController');
const cartController = require('./controllers/cartController');
const cartService = require('./services/cartService');
const { seedInitialData } = require('./services/seedService');
const { DEMO_ACCOUNT, seedDemoAccount } = require('./services/demoAccountService');
const app = express();

app.locals.currentUser = null;
app.locals.currentPath = '/';
app.locals.cartItemCount = 0;
app.locals.dataNotice = null;

// Cho phép đọc dữ liệu JSON từ request
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));

// Phục vụ các file giao diện tĩnh trong thư mục public
app.use(express.static('public'));

// Cấu hình template engine EJS (nếu dùng giao diện)
app.set('view engine', 'ejs');

// Session dùng cho trạng thái đăng nhập; giỏ hàng vẫn được lưu riêng trong Redis.
app.use(session({
    name: 'sweetshop.sid',
    secret: process.env.SESSION_SECRET || 'sweetshop-development-secret-change-me',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}));

// Dữ liệu dùng chung cho header ở mọi trang.
app.use(async (req, res, next) => {
    res.locals.currentUser = req.session.user || null;
    res.locals.currentPath = req.path || '/';
    res.locals.cartItemCount = 0;
    res.locals.dataNotice = null;

    try {
        res.locals.cartItemCount = await cartService.countItems(cartController.getCartOwner(req));
    } catch {
        // Trang vẫn hoạt động nếu Redis tạm thời chưa sẵn sàng.
    }

    next();
});

app.get('/', productController.home);
app.use(authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/orders', orderRoutes);

app.use((req, res) => {
    res.status(404).render('error', {
        pageTitle: 'Không tìm thấy trang',
        statusCode: 404,
        message: 'Trang bạn tìm kiếm không tồn tại.'
    });
});

app.use((error, req, res, next) => {
    console.error(error);
    if (res.headersSent) {
        return next(error);
    }
    return res.status(500).render('error', {
        pageTitle: 'Đã có lỗi xảy ra',
        statusCode: 500,
        message: 'SweetShop đang gặp sự cố. Vui lòng thử lại sau.'
    });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
    const mongoUri = process.env.MONGODB_URI?.trim();

    if (mongoUri) {
        try {
            await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
            console.log('Đã kết nối MongoDB.');
            await seedInitialData();
            await seedDemoAccount();
            console.log(`Tài khoản kiểm thử: ${DEMO_ACCOUNT.email}`);
        } catch (error) {
            console.warn(`MongoDB chưa sẵn sàng, chạy UI demo: ${error.message}`);
        }
    } else {
        console.warn('MONGODB_URI đang trống - server chạy ở chế độ UI demo.');
        console.warn(`Tài khoản UI demo: ${DEMO_ACCOUNT.email} / ${DEMO_ACCOUNT.password}`);
    }

    if (!cartService.isConfigured()) {
        console.warn('REDIS_URL đang trống - giỏ hàng thật tạm thời chưa hoạt động.');
    }

    return app.listen(PORT, () => {
        console.log(`Server đang chạy ở port ${PORT}`);
    });
}

if (require.main === module) {
    startServer().catch((error) => {
        console.error('Không thể khởi động server:', error.message);
        process.exit(1);
    });
}

module.exports = { app, startServer };
