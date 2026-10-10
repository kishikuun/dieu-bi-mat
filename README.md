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

4. **Yêu cầu xoay dọc màn hình trên điện thoại (Mobile UX)**:
   - Khi người dùng đang xoay ngang điện thoại (xem cây hoa) và bấm mở hộp quà, màn hình sẽ hiển thị lời nhắc: **"Xoay dọc điện thoại lại nhé! 📱"**.
   - Ngay khi người dùng **xoay dọc điện thoại lại**, hệ thống tự động phát hiện, chú bé que sẽ chạy tới mở hộp quà và video toàn màn hình sẽ phát ngay lập tức!
   - Có sẵn nút *"Xem luôn ở màn hình ngang ▶"* nếu người dùng đang khóa xoay màn hình (orientation lock).
   - Trong chế độ dọc ban đầu, người dùng cũng có thể bấm *"Đọc thư & Mở quà ngay tại đây"* để đọc thư và mở các hộp quà theo đúng trình tự.


