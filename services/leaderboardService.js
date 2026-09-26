function getBestSellers(products, limit = 10) {
    // Giao diện chỉ phụ thuộc hàm này. Sau này có thể thay phần xếp hạng
    // bằng ZREVRANGE trên Redis Sorted Set mà không cần sửa EJS.
    return [...products]
        .sort((first, second) => second.soldCount - first.soldCount)
        .slice(0, limit);
}

module.exports = { getBestSellers };
