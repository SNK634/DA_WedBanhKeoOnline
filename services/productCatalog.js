const categoryCatalog = [
    { name: 'Chocolate', slug: 'chocolate', emoji: '🍫', brand: 'NoirCraft', origin: 'Bỉ', ingredients: 'Bơ cacao, đường mía, sữa bột và cacao nguyên chất.', allergen: 'Có sữa; một số sản phẩm có hạt cây.', weight: 'Thanh 100g', expiry: '12 tháng kể từ ngày sản xuất', storage: 'Bảo quản nơi khô mát, dưới 25°C và tránh ánh nắng.', usage: 'Dùng trực tiếp; ngon hơn khi dùng cùng trà hoặc cà phê.' },
    { name: 'Bánh quy', slug: 'banh-quy', emoji: '🍪', brand: 'ButterMoon', origin: 'Việt Nam', ingredients: 'Bột mì, bơ, đường, trứng và hương liệu tự nhiên.', allergen: 'Có gluten, sữa và trứng.', weight: 'Hộp 180g', expiry: '9 tháng kể từ ngày sản xuất', storage: 'Đậy kín sau khi mở, để nơi khô ráo và thoáng mát.', usage: 'Dùng trực tiếp trong bữa nhẹ hoặc dùng kèm đồ uống.' },
    { name: 'Kẹo', slug: 'keo', emoji: '🍬', brand: 'JollyDrop', origin: 'Nhật Bản', ingredients: 'Đường, siro glucose, nước ép trái cây cô đặc và gelatin.', allergen: 'Có thể chứa gelatin và dấu vết sữa.', weight: 'Túi 120g', expiry: '12 tháng kể từ ngày sản xuất', storage: 'Bảo quản kín, tránh nhiệt độ cao và độ ẩm.', usage: 'Dùng trực tiếp; phù hợp chia sẻ trong tiệc và dịp lễ.' },
    { name: 'Bánh ngọt', slug: 'banh-ngot', emoji: '🧁', brand: 'CloudBake', origin: 'Việt Nam', ingredients: 'Bột mì, trứng, bơ, sữa, đường và kem tươi.', allergen: 'Có gluten, sữa và trứng.', weight: 'Phần 120g', expiry: '3 ngày kể từ ngày sản xuất', storage: 'Bảo quản lạnh 2–6°C và dùng sớm sau khi mở hộp.', usage: 'Dùng trực tiếp; để ở nhiệt độ phòng 5 phút trước khi thưởng thức.' },
    { name: 'Snack', slug: 'snack', emoji: '🍿', brand: 'CrunchLab', origin: 'Hàn Quốc', ingredients: 'Khoai tây hoặc ngũ cốc, dầu thực vật và gia vị.', allergen: 'Có thể chứa sữa, đậu nành hoặc gluten.', weight: 'Gói 90g', expiry: '8 tháng kể từ ngày sản xuất', storage: 'Đậy kín sau khi mở và tránh nơi nóng ẩm.', usage: 'Dùng trực tiếp trong bữa nhẹ, xem phim hoặc tiệc nhóm.' },
    { name: 'Quà Halloween', slug: 'qua-halloween', emoji: '🎃', brand: 'SweetShop Spooky', origin: 'Việt Nam', ingredients: 'Bộ tuyển chọn chocolate, bánh quy, kẹo dẻo và snack đóng gói riêng.', allergen: 'Có thể chứa sữa, gluten, trứng, đậu nành và các loại hạt.', weight: 'Hộp 500g', expiry: 'Theo hạn in trên từng sản phẩm thành phần', storage: 'Đặt nơi khô mát; bảo quản từng món theo hướng dẫn trên bao bì.', usage: 'Dùng làm quà tặng, trang trí bàn tiệc hoặc chia sẻ trong trò Trick or Treat.' }
];

const productGroups = {
    chocolate: [
        ['Chocolate đen 72% Midnight', 'chocolate-den-72-midnight', 99000, 'Thanh 100g'],
        ['Chocolate sữa Velvet Moon', 'chocolate-sua-velvet-moon', 79000, 'Thanh 100g'],
        ['Chocolate hạnh nhân Amber', 'chocolate-hanh-nhan-amber', 109000, 'Hộp 120g'],
        ['Chocolate hazelnut Night Crunch', 'chocolate-hazelnut-night-crunch', 119000, 'Hộp 120g'],
        ['Chocolate matcha Phantom', 'chocolate-matcha-phantom', 95000, 'Thanh 90g'],
        ['Chocolate dâu Blood Berry', 'chocolate-dau-blood-berry', 92000, 'Thanh 90g'],
        ['Chocolate caramel Pumpkin Gold', 'chocolate-caramel-pumpkin-gold', 105000, 'Thanh 100g'],
        ['Chocolate viên Truffle Eclipse', 'chocolate-vien-truffle-eclipse', 149000, 'Hộp 12 viên'],
        ['Chocolate trắng Cookies & Scream', 'chocolate-trang-cookies-scream', 89000, 'Thanh 100g'],
        ['Hộp chocolate Spooky Collection', 'hop-chocolate-spooky-collection', 259000, 'Hộp 24 viên']
    ],
    'banh-quy': [
        ['Bánh quy bơ Golden Bat', 'banh-quy-bo-golden-bat', 65000, 'Hộp 180g'],
        ['Cookie chocolate chip Dark Dot', 'cookie-chocolate-chip-dark-dot', 72000, 'Túi 160g'],
        ['Bánh quy yến mạch Harvest Moon', 'banh-quy-yen-mach-harvest-moon', 76000, 'Hộp 180g'],
        ['Wafer cacao Shadow Layers', 'wafer-cacao-shadow-layers', 59000, 'Gói 150g'],
        ['Bánh quy cacao Black Cat', 'banh-quy-cacao-black-cat', 68000, 'Hộp 170g'],
        ['Bánh quy phô mai Witch Hat', 'banh-quy-pho-mai-witch-hat', 74000, 'Hộp 160g'],
        ['Bánh quy hạnh nhân Moon Slice', 'banh-quy-hanh-nhan-moon-slice', 85000, 'Hộp 170g'],
        ['Bánh quy dừa Ghost Flake', 'banh-quy-dua-ghost-flake', 62000, 'Túi 160g'],
        ['Bánh quy matcha Green Spell', 'banh-quy-matcha-green-spell', 78000, 'Hộp 170g'],
        ['Hộp bánh quy Haunted House', 'hop-banh-quy-haunted-house', 189000, 'Hộp 420g']
    ],
    keo: [
        ['Kẹo trái cây Neon Ghost', 'keo-trai-cay-neon-ghost', 45000, 'Túi 120g'],
        ['Kẹo dẻo Gummy Bat', 'keo-deo-gummy-bat', 52000, 'Túi 140g'],
        ['Kẹo bạc hà Frost Fang', 'keo-bac-ha-frost-fang', 39000, 'Hộp 80g'],
        ['Kẹo sữa Milky Boo', 'keo-sua-milky-boo', 48000, 'Túi 120g'],
        ['Kẹo cà phê Dark Roast Drop', 'keo-ca-phe-dark-roast-drop', 49000, 'Túi 110g'],
        ['Gummy Bear Monster Mix', 'gummy-bear-monster-mix', 55000, 'Túi 150g'],
        ['Marshmallow Cloud Ghost', 'marshmallow-cloud-ghost', 59000, 'Túi 160g'],
        ['Kẹo chanh Sour Scream', 'keo-chanh-sour-scream', 43000, 'Túi 120g'],
        ['Kẹo cola Midnight Bottle', 'keo-cola-midnight-bottle', 46000, 'Túi 130g'],
        ['Kẹo Halloween Trick Mix', 'keo-halloween-trick-mix', 89000, 'Hũ 300g']
    ],
    'banh-ngot': [
        ['Cupcake kem bí ngô', 'cupcake-kem-bi-ngo', 39000, 'Phần 120g'],
        ['Brownie Dark Grave', 'brownie-dark-grave', 45000, 'Phần 110g'],
        ['Donut mạng nhện cam', 'donut-mang-nhen-cam', 42000, 'Phần 100g'],
        ['Muffin cacao Bat Wing', 'muffin-cacao-bat-wing', 43000, 'Phần 120g'],
        ['Tiramisu Midnight Cup', 'tiramisu-midnight-cup', 69000, 'Cốc 140g'],
        ['Cheesecake mini Pumpkin Swirl', 'cheesecake-mini-pumpkin-swirl', 65000, 'Phần 130g'],
        ['Macaron Spooky Colors', 'macaron-spooky-colors', 99000, 'Hộp 6 chiếc'],
        ['Bánh cuộn kem Ghost Roll', 'banh-cuon-kem-ghost-roll', 79000, 'Cuộn 240g'],
        ['Bánh mousse Orange Moon', 'banh-mousse-orange-moon', 72000, 'Phần 140g'],
        ['Bánh kem mini Haunted Garden', 'banh-kem-mini-haunted-garden', 219000, 'Bánh 500g']
    ],
    snack: [
        ['Khoai tây lát Pumpkin Spice', 'khoai-tay-lat-pumpkin-spice', 35000, 'Gói 90g'],
        ['Rong biển giòn Dark Sea', 'rong-bien-gion-dark-sea', 32000, 'Gói 45g'],
        ['Bắp rang caramel Witch Pot', 'bap-rang-caramel-witch-pot', 49000, 'Túi 130g'],
        ['Snack phô mai Monster Puff', 'snack-pho-mai-monster-puff', 38000, 'Gói 85g'],
        ['Snack cay Dragon Breath', 'snack-cay-dragon-breath', 42000, 'Gói 90g'],
        ['Hạt mix Moonlight Energy', 'hat-mix-moonlight-energy', 69000, 'Hũ 180g'],
        ['Pretzel Black Sesame', 'pretzel-black-sesame', 55000, 'Túi 150g'],
        ['Nachos Orange Flame', 'nachos-orange-flame', 59000, 'Gói 170g'],
        ['Cracker bí ngô giòn', 'cracker-bi-ngo-gion', 48000, 'Hộp 150g'],
        ['Snack chocolate Crunchy Coffin', 'snack-chocolate-crunchy-coffin', 62000, 'Túi 140g']
    ],
    'qua-halloween': [
        ['Hộp quà bí ngô Pumpkin Chest', 'hop-qua-bi-ngo-pumpkin-chest', 239000, 'Hộp 500g'],
        ['Túi kẹo Ghost Parade', 'tui-keo-ghost-parade', 159000, 'Túi 400g'],
        ['Combo Trick or Treat Classic', 'combo-trick-or-treat-classic', 299000, 'Combo 8 món'],
        ['Hộp chocolate Halloween Noir', 'hop-chocolate-halloween-noir', 329000, 'Hộp 24 viên'],
        ['Combo snack Midnight Party', 'combo-snack-midnight-party', 279000, 'Combo 7 món'],
        ['Hộp quà trẻ em Little Monster', 'hop-qua-tre-em-little-monster', 219000, 'Hộp 10 món'],
        ['Combo kẹo dẻo Spooky Friends', 'combo-keo-deo-spooky-friends', 189000, 'Combo 6 túi'],
        ['Gift Box Black & Orange', 'gift-box-black-orange', 359000, 'Hộp 12 món'],
        ['Combo tiệc Halloween Big Boo', 'combo-tiec-halloween-big-boo', 499000, 'Combo 18 món'],
        ['Mystery Candy Box', 'mystery-candy-box', 269000, 'Hộp bí mật 1kg']
    ]
};

const reviewerNames = ['Minh Anh', 'Thu Hà', 'Quang Huy', 'Ngọc Linh', 'Gia Bảo'];
const reviewMessages = [
    'Hương vị vừa miệng, bao bì đen cam nhìn rất hợp không khí Halloween.',
    'Sản phẩm đóng gói cẩn thận, phần ăn đúng mô tả và giao diện hộp rất xinh.',
    'Mình mua cho buổi tiệc nhỏ, mọi người đều thích và muốn thử thêm lần nữa.',
    'Giá hợp lý, vị ngon rõ ràng và không bị ngọt gắt như mình lo ban đầu.',
    'Món này dùng làm quà rất ổn, màu sắc đẹp và trải nghiệm tổng thể vui mắt.'
];

function createProductCatalog() {
    let globalIndex = 0;

    return categoryCatalog.flatMap((category, categoryIndex) => {
        return productGroups[category.slug].map(([name, slug, price, weight], productIndex) => {
            globalIndex += 1;
            const isBestSeller = productIndex < 2;
            const isHot = productIndex < 4 || category.slug === 'qua-halloween';
            const soldCount = isBestSeller
                ? 1080 - categoryIndex * 47 - productIndex * 83
                : 620 - productIndex * 43 + categoryIndex * 11;
            const rating = Number((4.9 - (productIndex % 5) * 0.1).toFixed(1));
            const visibleReviewCount = 4 + (globalIndex % 2);
            const reviews = Array.from({ length: visibleReviewCount }, (_, reviewIndex) => ({
                userName: reviewerNames[(reviewIndex + categoryIndex) % reviewerNames.length],
                rating: reviewIndex === visibleReviewCount - 1 && productIndex % 3 === 0 ? 4 : 5,
                comment: `${reviewMessages[(reviewIndex + productIndex) % reviewMessages.length]} ${name} để lại ấn tượng khá tốt.`,
                createdAt: new Date(Date.now() - (reviewIndex + 1) * 86400000 * 9)
            }));

            return {
                catalogId: globalIndex,
                name,
                slug,
                categorySlug: category.slug,
                shortDescription: `${name} mang hương vị đặc trưng của bộ sưu tập ${category.name} mùa Halloween.`,
                description: `${name} được SweetShop tuyển chọn cho những buổi gặp gỡ và bàn tiệc Halloween. Sản phẩm có hương vị cân bằng, quy cách tiện lợi và sắc thái đen cam hiện đại, phù hợp để tự thưởng, chia sẻ cùng bạn bè hoặc làm một món quà nhỏ đầy không khí lễ hội.`,
                origin: category.origin,
                brand: category.brand,
                ingredients: category.ingredients,
                weight,
                expiry: category.expiry,
                storage: category.storage,
                usage: category.usage,
                allergen: category.allergen,
                price,
                image: category.emoji,
                stock: 24 + ((globalIndex * 7) % 73),
                soldCount,
                rating,
                reviewCount: Math.max(18, Math.round(soldCount * 0.31)),
                reviews,
                isHot,
                isBestSeller
            };
        });
    });
}

const productCatalog = createProductCatalog();

module.exports = {
    categoryCatalog,
    productCatalog
};
