# 🍭 Đồ án Cuối kỳ: Hệ thống Web Bán Bánh Kẹo Trực Tuyến

Đây là dự án xây dựng hệ thống website thương mại điện tử chuyên cung cấp các mặt hàng bánh kẹo, áp dụng kiến trúc phần mềm MVC. Điểm đặc biệt của hệ thống là sử dụng **hoàn toàn cơ sở dữ liệu NoSQL** (không dùng CSDL quan hệ) để đảm bảo tính linh hoạt, khả năng mở rộng và tối ưu hiệu suất truy xuất dữ liệu.

## 🛠 Công nghệ & Hệ quản trị CSDL sử dụng
* **Backend:** Node.js, Express.js
* **Frontend/View:** EJS, HTML, CSS, JavaScript thuần

### 1. MongoDB (Cơ sở dữ liệu chính - Document Database)
Đóng vai trò là trung tâm lưu trữ dữ liệu nghiệp vụ cốt lõi, tận dụng mô hình Document để lưu trữ linh hoạt:
* Quản lý danh mục và thông tin chi tiết các loại bánh kẹo.
* Lưu trữ hồ sơ người dùng (khách hàng, admin).
* Lưu trữ thông tin đơn hàng và lịch sử giao dịch.
* Quản lý hệ thống bình luận, đánh giá (Review) sản phẩm có cấu trúc thay đổi.

### 2. Redis (Cơ sở dữ liệu phụ - Key-Value Store)
Tích hợp để tối ưu hóa trải nghiệm người dùng và giảm tải cho CSDL chính:
* **Giỏ hàng tạm thời (Shopping Cart):** Lưu trữ giỏ hàng của khách truy cập với thời gian sống (TTL) định trước.
* **Caching (Bộ nhớ đệm):** Cache các danh mục sản phẩm nổi bật, khuyến mãi giúp trang chủ tải nhanh hơn.
* **Leaderboard (Bảng xếp hạng):** Sử dụng cấu trúc Sorted Set để tính toán và hiển thị top các sản phẩm bán chạy nhất theo thời gian thực.

