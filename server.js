require('dotenv').config();
const express = require('express');
const app = express();

// Cho phép đọc dữ liệu JSON từ request
app.use(express.json()); 

// Cấu hình template engine EJS (nếu dùng giao diện)
app.set('view engine', 'ejs');

// Test route cơ bản
app.get('/', (req, res) => {
    res.send('Web bán bánh kẹo online đã khởi chạy thành công!');
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy ở port ${PORT}`);
});