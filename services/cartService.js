const { createClient } = require('redis');

const CART_TTL_SECONDS = Number(process.env.CART_TTL_SECONDS) || 7 * 24 * 60 * 60;
let redisClient;
let connectPromise;
const demoCarts = new Map();

function isConfigured() {
    return Boolean(process.env.REDIS_URL?.trim());
}

function createRedisClient() {
    const client = createClient({
        url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
        socket: {
            connectTimeout: 2000,
            reconnectStrategy: false
        }
    });

    client.on('error', (error) => {
        console.error('Redis error:', error.message);
    });

    return client;
}

async function getClient() {
    if (!isConfigured()) {
        throw new Error('REDIS_URL chưa được cấu hình.');
    }

    if (!redisClient) {
        redisClient = createRedisClient();
    }

    if (!redisClient.isOpen) {
        if (!connectPromise) {
            connectPromise = redisClient.connect().finally(() => {
                connectPromise = null;
            });
        }
        await connectPromise;
    }

    return redisClient;
}

function getCartKey(ownerId) {
    return `cart:${ownerId}`;
}

async function getCart(ownerId) {
    if (!isConfigured()) {
        const entry = demoCarts.get(String(ownerId));
        if (!entry || entry.expiresAt < Date.now()) {
            demoCarts.delete(String(ownerId));
            return [];
        }
        return entry.items.map((item) => ({ ...item }));
    }

    const client = await getClient();
    const value = await client.get(getCartKey(ownerId));

    if (!value) {
        return [];
    }

    try {
        const items = JSON.parse(value);
        return Array.isArray(items) ? items : [];
    } catch {
        return [];
    }
}

async function saveCart(ownerId, items) {
    if (!isConfigured()) {
        if (items.length === 0) {
            demoCarts.delete(String(ownerId));
        } else {
            demoCarts.set(String(ownerId), {
                items: items.map((item) => ({ ...item })),
                expiresAt: Date.now() + CART_TTL_SECONDS * 1000
            });
        }
        return;
    }

    const client = await getClient();
    const key = getCartKey(ownerId);

    if (items.length === 0) {
        await client.del(key);
        return;
    }

    await client.set(key, JSON.stringify(items), { EX: CART_TTL_SECONDS });
}

async function addItem(ownerId, productId, quantity = 1) {
    const items = await getCart(ownerId);
    const existingItem = items.find((item) => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        items.push({ productId, quantity });
    }

    await saveCart(ownerId, items);
    return items;
}

async function updateItem(ownerId, productId, quantity) {
    const items = await getCart(ownerId);
    const nextItems = quantity <= 0
        ? items.filter((item) => item.productId !== productId)
        : items.map((item) => item.productId === productId ? { ...item, quantity } : item);

    await saveCart(ownerId, nextItems);
    return nextItems;
}

async function removeItem(ownerId, productId) {
    const items = await getCart(ownerId);
    const nextItems = items.filter((item) => item.productId !== productId);
    await saveCart(ownerId, nextItems);
    return nextItems;
}

async function countItems(ownerId) {
    const items = await getCart(ownerId);
    return items.reduce((total, item) => total + item.quantity, 0);
}

async function clearCart(ownerId) {
    await saveCart(ownerId, []);
}

async function closeRedis() {
    if (redisClient?.isOpen) {
        await redisClient.quit();
    }
}

module.exports = {
    addItem,
    clearCart,
    closeRedis,
    countItems,
    getCart,
    getCartKey,
    isConfigured,
    removeItem,
    updateItem
};
