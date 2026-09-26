const { categoryCatalog, productCatalog } = require('./productCatalog');

const mockCategories = categoryCatalog.map((category, index) => ({
    _id: `67${String(index + 1).padStart(22, '0')}`,
    name: category.name,
    slug: category.slug,
    createdAt: new Date()
}));

const categoryBySlug = new Map(mockCategories.map((category) => [category.slug, category]));

const mockProducts = productCatalog.map((product, index) => {
    const { catalogId, categorySlug, ...productData } = product;
    return {
        ...productData,
        _id: `68${String(index + 1).padStart(22, '0')}`,
        categoryId: categoryBySlug.get(categorySlug),
        createdAt: new Date()
    };
});

function getMockProducts(categorySlug = '') {
    return categorySlug
        ? mockProducts.filter((product) => product.categoryId.slug === categorySlug)
        : mockProducts;
}

function getMockProductBySlug(slug) {
    return mockProducts.find((product) => product.slug === slug) || null;
}

module.exports = {
    getMockProductBySlug,
    getMockProducts,
    mockCategories,
    mockProducts
};
