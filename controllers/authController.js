const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/User');
const { DEMO_ACCOUNT, isDemoCredentials } = require('../services/demoAccountService');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SALT_ROUNDS = 12;

function renderLogin(req, res) {
    if (req.session.user) {
        return res.redirect('/');
    }

    return res.render('auth/login', {
        pageTitle: 'Đăng nhập',
        error: null,
        notice: req.query.required === 'checkout'
            ? 'Vui lòng đăng nhập để tiếp tục thanh toán.'
            : null,
        formData: { email: '' }
    });
}

function renderRegister(req, res) {
    if (req.session.user) {
        return res.redirect('/');
    }

    return res.render('auth/register', {
        pageTitle: 'Đăng ký',
        error: null,
        formData: { fullName: '', email: '' }
    });
}

async function register(req, res) {
    const fullName = String(req.body.fullName || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const confirmPassword = String(req.body.confirmPassword || '');
    const formData = { fullName, email };

    if (mongoose.connection.readyState !== 1) {
        return res.status(503).render('auth/register', {
            pageTitle: 'Đăng ký',
            error: 'Chế độ xem giao diện: MongoDB chưa kết nối nên chưa thể tạo tài khoản.',
            formData
        });
    }

    if (fullName.length < 2 || !EMAIL_PATTERN.test(email)) {
        return res.status(400).render('auth/register', {
            pageTitle: 'Đăng ký',
            error: 'Vui lòng nhập họ tên và email hợp lệ.',
            formData
        });
    }

    if (password.length < 6) {
        return res.status(400).render('auth/register', {
            pageTitle: 'Đăng ký',
            error: 'Mật khẩu phải có ít nhất 6 ký tự.',
            formData
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).render('auth/register', {
            pageTitle: 'Đăng ký',
            error: 'Mật khẩu xác nhận không khớp.',
            formData
        });
    }

    try {
        const existingUser = await User.findOne({ email }).lean();
        if (existingUser) {
            return res.status(409).render('auth/register', {
                pageTitle: 'Đăng ký',
                error: 'Email này đã được sử dụng.',
                formData
            });
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await User.create({ fullName, email, passwordHash });

        req.session.user = {
            id: user._id.toString(),
            fullName: user.fullName,
            email: user.email,
            role: user.role
        };

        return req.session.save(() => res.redirect('/products'));
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).render('auth/register', {
                pageTitle: 'Đăng ký',
                error: 'Email này đã được sử dụng.',
                formData
            });
        }

        console.error('Register error:', error);
        return res.status(500).render('auth/register', {
            pageTitle: 'Đăng ký',
            error: 'Không thể đăng ký lúc này. Vui lòng thử lại.',
            formData
        });
    }
}

async function login(req, res) {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const formData = { email };

    const returnTo = req.session.returnTo || '/';

    const establishSession = (sessionUser) => req.session.regenerate((error) => {
        if (error) {
            console.error('Session regenerate error:', error);
            return res.status(500).render('auth/login', {
                pageTitle: 'Đăng nhập',
                error: 'Không thể tạo phiên đăng nhập. Vui lòng thử lại.',
                notice: null,
                formData
            });
        }

        req.session.user = sessionUser;
        return req.session.save(() => res.redirect(returnTo));
    });

    if (mongoose.connection.readyState !== 1) {
        if (isDemoCredentials(email, password)) {
            return establishSession({
                id: '690000000000000000000001',
                fullName: DEMO_ACCOUNT.fullName,
                email: DEMO_ACCOUNT.email,
                role: 'customer',
                isDemo: true
            });
        }

        return res.status(401).render('auth/login', {
            pageTitle: 'Đăng nhập',
            error: 'MongoDB chưa kết nối. Hãy dùng tài khoản demo được in trong terminal để xem luồng thanh toán.',
            notice: null,
            formData
        });
    }

    try {
        const user = await User.findOne({ email });
        const passwordMatches = user && await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatches) {
            return res.status(401).render('auth/login', {
                pageTitle: 'Đăng nhập',
                error: 'Email hoặc mật khẩu không chính xác.',
                notice: null,
                formData
            });
        }

        return establishSession({
            id: user._id.toString(),
            fullName: user.fullName,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).render('auth/login', {
            pageTitle: 'Đăng nhập',
            error: 'Không thể đăng nhập lúc này. Vui lòng thử lại.',
            notice: null,
            formData
        });
    }
}

function logout(req, res) {
    req.session.destroy((error) => {
        if (error) {
            console.error('Logout error:', error);
            return res.redirect('/');
        }

        res.clearCookie('sweetshop.sid');
        return res.redirect('/');
    });
}

module.exports = {
    login,
    logout,
    register,
    renderLogin,
    renderRegister
};
