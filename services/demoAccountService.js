const bcrypt = require('bcrypt');
const User = require('../models/User');

const DEMO_ACCOUNT = {
    fullName: 'Khách hàng Demo',
    email: 'demo@sweetshop.local',
    password: 'Sweet123!'
};

async function seedDemoAccount() {
    const existingUser = await User.findOne({ email: DEMO_ACCOUNT.email }).lean();
    if (existingUser) {
        return existingUser;
    }

    const passwordHash = await bcrypt.hash(DEMO_ACCOUNT.password, 12);
    return User.create({
        fullName: DEMO_ACCOUNT.fullName,
        email: DEMO_ACCOUNT.email,
        passwordHash,
        role: 'customer'
    });
}

function isDemoCredentials(email, password) {
    return email === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password;
}

module.exports = {
    DEMO_ACCOUNT,
    isDemoCredentials,
    seedDemoAccount
};
