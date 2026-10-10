# Điều bí mật gì đang chờ đón bạn? 🌸

Website tĩnh kỷ niệm ngày Phụ nữ Việt Nam 20/10 dành cho các bạn nữ CLBTNQHQN (CLB Thanh Niên Quốc Học Quy Nhơn).

---

## 📁 Cấu trúc thư mục chuẩn

```text
dieu-bi-mat/
├── assets/
│   ├── css/
│   │   └── style.css            # Toàn bộ CSS (tự động co giãn theo màn hình PC & Mobile)
│   ├── js/
│   │   ├── functions.js         # Hàm typewriter (kèm callback khi gõ xong), format thời gian
│   │   ├── script.js            # Engine điều khiển hoạt ảnh hoa nở, audio, tương tác 3 hộp quà, video modal
│   │   └── libs/                # Thư viện JavaScript độc lập
│   │       ├── jquery.min.js
│   │       ├── jscex.min.js
│   │       ├── jscex-parser.js
│   │       ├── jscex-jit.js
│   │       ├── jscex-builderbase.min.js
│   │       ├── jscex-async.min.js
│   │       ├── jscex-async-powerpack.min.js
│   │       └── love.js
│   ├── img/
│   │   └── tn.ico               # Favicon biểu tượng CLB
│   ├── audio/
│   │   ├── nhac.mp3             # Nhạc nền chính tự phát
│   │   └── I-Do-911.mp3         # Nhạc nền phụ
│   └── video/
│       ├── 1.mp4                # Video món quà bí mật số 1 (dọc 9:16)
│       ├── 2.mp4                # Video món quà bí mật số 2 (dọc 9:16)
│       └── 3.mp4                # Video món quà bí mật số 3 (dọc 9:16)
├── index.html                   # Mở trực tiếp bằng trình duyệt
└── README.md                    # Tài liệu hướng dẫn
```

---

## 🚀 Cách mở và sử dụng

- **Không cần cài đặt Node.js hay bất kỳ phần mềm nào**: Bạn chỉ cần **nhấp đúp chuột vào file `index.html`** là trang web sẽ mở ra ngay lập tức trên trình duyệt (Chrome, Safari, Edge, Firefox, Cốc Cốc, v.v.).
- **Triển khai lên Web**: Bạn có thể tải toàn bộ thư mục này lên **GitHub Pages**, **Vercel**, **Netlify**, hoặc bất kỳ dịch vụ hosting nào.

---

## 🎁 Các tính năng & Trải nghiệm Người dùng (UI/UX) mới nhất

1. **Nhân vật vector que vui nhộn chạy tới mở quà**:
   - Khi bấm vào hộp quà, một chú bé que vector dễ thương mang nón tiệc xuất hiện với đám khói bụi hoạt hình `💨` và bong bóng thoại dí dỏm.
   - Chú bé que guồng chân chạy nhanh tới vị trí hộp quà được chọn, nhảy cẫng lên ăn mừng và bật tung nắp hộp quà kèm hiệu ứng lấp lánh `✨` trước khi video bắt đầu!

2. **Cơ chế mở khóa tuần tự từng món quà (1 ➔ 2 ➔ 3)**:
   - Ban đầu sau khi bức thư hiện xong, chỉ có **Hộp quà số 1** xuất hiện cùng huy hiệu *"MỞ NGAY ✨"*. Các hộp quà sau được giấu kín để tạo sự tò mò, bất ngờ.
   - Sau khi xem xong Video 1, **Hộp quà số 2** sẽ lập tức bung nở với hoạt ảnh nảy tưng bừng.
   - Sau khi xem xong Video 2, **Hộp quà số 3 (Trùm cuối)** sẽ chính thức lộ diện!
   - Khi đã xem trọn vẹn cả 3 món quà, banner sẽ chuyển sang lời chúc mừng 20/10 ngọt ngào nhất. Bạn vẫn có thể nhấp lại bất kỳ hộp quà nào để xem lại bất cứ lúc nào.

3. **Trình phát Video toàn màn hình (Fullscreen Theater) trên cả PC và Mobile**:
   - Video được tối ưu chiếu tràn viền màn hình (100vw, 100dvh) với nền đen điện ảnh cao cấp, không viền cản trở.
   - Trên điện thoại (khung hình dọc), video 9:16 vừa vặn trọn vẹn màn hình điện thoại từ trên xuống dưới.
   - Trên máy tính (PC), video chiếu ở độ cao tối đa sát mép màn hình, kèm nút phóng to toàn màn hình (Hardware Fullscreen) và nút đóng `✕` tinh tế.

4. **Ngôi nhà nhỏ vector sắc màu (Xanh dương chủ đạo)**:
   - Một ngôi nhà vector ấm cúng với mái xanh đại dương, ống khói bốc khói nhẹ nhàng, cửa sổ ánh vàng và cửa chính vòm xinh xắn tọa lạc vĩnh viễn bên dưới gốc cây.
   - Khi bấm mở quà, cánh cửa nhà hé mở và chú bé que sẽ chui ra từ ngôi nhà để phi nhanh tới mở quà!

5. **Tối ưu hiển thị iPhone 14 & Màn hình di động xoay ngang**:
   - Sử dụng chuẩn `100dvh` và thuật toán co giãn sân khấu thông minh thích ứng hoàn hảo với các thanh điều hướng của Safari trên iPhone 14 (2532 x 1170 px) và mọi dòng smartphone khác.
   - Trọn vẹn tán cây hoa, gốc cây, bức thư và các hộp quà luôn nằm gọn gàng, không bị mất gốc cây hay tràn chữ.

6. **Khóa bảo vệ trải nghiệm – Không cho đọc thư trước khi xem xong animation**:
   - Ở chế độ xoay dọc ban đầu, người dùng được nhắc nhở xoay ngang để chiêm ngưỡng trọn vẹn hành trình hoa nở và bức thư viết từng nét chữ.
   - Nút xem lại thư chỉ được kích hoạt sau khi toàn bộ hoạt cảnh đã diễn ra trọn vẹn, đảm bảo giữ trọn cảm xúc bất ngờ cho người xem.


