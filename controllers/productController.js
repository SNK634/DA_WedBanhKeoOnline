const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const {
    getMockProductBySlug,
    getMockProducts,
    mockCategories
} = require('../services/mockData');
const { getBestSellers } = require('../services/leaderboardService');

function isMongoConnected() {
    return mongoose.connection.readyState === 1;
}

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sortMockProducts(products, sortOption) {
    const sortedProducts = [...products];

    if (sortOption === 'price-asc') return sortedProducts.sort((a, b) => a.price - b.price);
    if (sortOption === 'price-desc') return sortedProducts.sort((a, b) => b.price - a.price);
    if (sortOption === 'best-selling') return sortedProducts.sort((a, b) => b.soldCount - a.soldCount);
    if (sortOption === 'rating') return sortedProducts.sort((a, b) => b.rating - a.rating);

    return sortedProducts.sort((a, b) => Number(b.isHot) - Number(a.isHot));
}

async function home(req, res, next) {
    if (!isMongoConnected()) {
        return res.render('home', {
            pageTitle: 'Bánh kẹo Halloween ngọt ngào',
            featuredProducts: getMockProducts().filter((product) => product.isHot).slice(0, 4),
            dataNotice: 'Đang hiển thị dữ liệu mẫu vì MongoDB chưa kết nối.'
        });
    }

    try {
        const featuredProducts = await Product.find({ isHot: true })
            .populate('categoryId')
            .sort({ createdAt: -1 })
            .limit(4)
            .lean();

        return res.render('home', {
            pageTitle: 'Bánh kẹo Halloween ngọt ngào',
            featuredProducts,
            dataNotice: null
        });
    } catch (error) {
        return next(error);
    }
}

async function listProducts(req, res, next) {
    const selectedCategory = String(req.query.category || '').trim();
    const searchQuery = String(req.query.q || '').trim();
    const sortOption = String(req.query.sort || 'featured').trim();

    if (!isMongoConnected()) {
        const categoryProducts = getMockProducts(selectedCategory);
        const searchedProducts = searchQuery
            ? categoryProducts.filter((product) => product.name.toLocaleLowerCase('vi').includes(searchQuery.toLocaleLowerCase('vi')))
            : categoryProducts;

        return res.render('products/index', {
            pageTitle: 'Sản phẩm',
            categories: mockCategories,
            products: sortMockProducts(searchedProducts, sortOption),
            bestSellers: getBestSellers(categoryProducts, 10),
            selectedCategory,
            searchQuery,
            sortOption,
            dataNotice: 'Đang hiển thị dữ liệu mẫu vì MongoDB chưa kết nối.'
        });
    }

    try {
        const categories = await Category.find().sort({ name: 1 }).lean();
        const filter = {};
        const leaderboardFilter = {};

        if (selectedCategory) {
            const category = categories.find((item) => item.slug === selectedCategory);
            filter.categoryId = category ? category._id : null;
            leaderboardFilter.categoryId = filter.categoryId;
        }

        if (searchQuery) {
            filter.name = { $regex: escapeRegExp(searchQuery), $options: 'i' };
        }

        const sortMap = {
            'price-asc': { price: 1 },
            'price-desc': { price: -1 },
            'best-selling': { soldCount: -1 },
            rating: { rating: -1, reviewCount: -1 },
            featured: { isBestSeller: -1, isHot: -1, createdAt: -1 }
        };

        const [products, bestSellers] = await Promise.all([
            Product.find(filter)
                .populate('categoryId')
                .sort(sortMap[sortOption] || sortMap.featured)
                .lean(),
            Product.find(leaderboardFilter)
                .populate('categoryId')
                .sort({ soldCount: -1 })
                .limit(10)
                .lean()
        ]);

        return res.render('products/index', {
            pageTitle: 'Sản phẩm',
            categories,
            products,
            bestSellers,
            selectedCategory,
            searchQuery,
            sortOption,
            dataNotice: null
        });
    } catch (error) {
        return next(error);
    }
}

async function productDetail(req, res, next) {
    if (!isMongoConnected()) {
        const mockProduct = getMockProductBySlug(req.params.slug);
        if (!mockProduct) {
            return res.status(404).render('error', {
                pageTitle: 'Không tìm thấy sản phẩm',
                statusCode: 404,
                message: 'Sản phẩm bạn tìm kiếm không tồn tại.'
            });
        }

        return res.render('products/detail', {
            pageTitle: mockProduct.name,
            product: mockProduct,
            dataNotice: 'Đang hiển thị dữ liệu mẫu vì MongoDB chưa kết nối.'
        });
    }

    try {
        const product = await Product.findOne({ slug: req.params.slug })
            .populate('categoryId')
            .lean();

        if (!product) {
            return res.status(404).render('error', {
                pageTitle: 'Không tìm thấy sản phẩm',
                statusCode: 404,
                message: 'Sản phẩm bạn tìm kiếm không tồn tại.'
            });
        }

        return res.render('products/detail', {
            pageTitle: product.name,
            product,
            dataNotice: null
        });
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    home,
    listProducts,
    productDetail
};
