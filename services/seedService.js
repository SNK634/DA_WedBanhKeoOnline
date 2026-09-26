const Category = require('../models/Category');
const Product = require('../models/Product');
const { categoryCatalog, productCatalog } = require('./productCatalog');

async function seedInitialData() {
    const [categoryCount, productCount] = await Promise.all([
        Category.countDocuments(),
        Product.countDocuments()
    ]);

    if (categoryCount === 0) {
        await Category.insertMany(categoryCatalog.map(({ name, slug }) => ({ name, slug })));
    }

    if (productCount > 0) {
        return;
    }

    const categories = await Category.find().lean();
    const categoryMap = new Map(categories.map((category) => [category.slug, category._id]));
    const hasAllCategories = categoryCatalog.every((category) => categoryMap.has(category.slug));

    if (!hasAllCategories) {
        console.warn('Không seed sản phẩm vì collection categories đã có dữ liệu nhưng thiếu danh mục chuẩn.');
        return;
    }

    await Product.insertMany(productCatalog.map((product) => {
        const { catalogId, categorySlug, ...productData } = product;
        return { ...productData, categoryId: categoryMap.get(categorySlug) };
    }));
}

module.exports = { seedInitialData };
