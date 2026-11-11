# Nhảy Sạp — Hội bản vùng cao

Game rhythm Canvas 2D, JavaScript thuần; không cài thư viện hoặc build. Nằm cùng repo với Ném còn để dùng chung tài nguyên. Chưa cần tách project: khi có nhóm phát triển, vòng phát hành hoặc hosting riêng mới cân nhắc tách. Khi có nhiều game hơn có thể chuyển sang `games/` và `shared/`.

## Chạy

Từ thư mục gốc repo: `python3 -m http.server 8080`, mở `http://localhost:8080/nhay-sap/`. Menu Ném còn cũng có liên kết sang game này.

## Thiết kế bản đầu

- Một màn 48 phách (42 động tác, 6 phách nghỉ), bốn phách đếm vào. Nhịp 84/104/124 BPM; thời lượng khoảng 38/31/26 giây gồm đếm vào.
- Dấu xanh: trái/A hoặc nút Vào sạp. Dấu vàng: phải/D hoặc nút Ra sạp. Bấm khi dấu đi qua vạch vàng. Không bấm ở phách nghỉ.
- Đánh giá theo sai lệch tuyệt đối tính bằng giây. Dễ: Chuẩn ≤90ms, Đúng ≤190ms; Vừa: 70/145ms; Khó: 55/115ms.
- Chuẩn 100 điểm nền, Đúng 60. Nhân combo tăng tuyến tính đến ×2 ở combo 30. Bỏ nhịp, bấm sai hướng hoặc bấm thừa xóa combo. Bấm thừa không cộng điểm.
- Đồng hồ AudioContext chung cho chấm nhịp, hoạt cảnh và lịch âm thanh. Nhạc tổng hợp dùng thang âm ngũ cung, không phải bản thu dân gian. Có chế độ im lặng, bù trễ ±150ms, tạm dừng khi ẩn tab/mất focus.
- Hai động tác vào/ra là cách chuyển thể đơn giản hóa, không mô phỏng đầy đủ bài múa truyền thống. Không có PvP, bài hát tải ngoài hoặc nhận diện cơ thể.

## Đồ họa và cấu trúc

Dùng chung `../assets/background/Background.png` với Ném còn. Nhân vật, trang phục, cờ và thanh tre mới được tự vẽ bằng pixel integer lên Canvas; không có ảnh AI hay thư viện đồ họa. Nhân vật mới vẽ trên lưới 80×120, có đổ bóng, áo chàm, nẹp thổ cẩm, khăn đầu và váy hoa văn. Tỷ lệ đầu/thân được kéo gần nhân vật gốc hơn; vẫn ít chi tiết hơn bộ nhân vật Ném còn. Sân dùng hai cặp sạp cách nhau 67px, thanh tre dày 6px và khoảng mở 38–44px; hai thanh kê nằm dọc dưới các đầu sạp.

- `rhythm.js`: chart, độ khó, cửa sổ nhịp và công thức điểm độc lập.
- `game.js`: máy trạng thái, âm thanh, thao tác, hình ảnh.
- `style.css`, `index.html`: giao diện và hướng dẫn.
- Dữ liệu cục bộ: `sap_best_<level>`, `sap_offset`.

## Kiểm tra

`node nhay-sap/tests/rhythm.test.cjs`

Kiểm tra trọn màn hoàn hảo ở cả ba độ khó, ranh giới nhịp sớm/muộn, giới hạn hệ số combo, sai hướng, bỏ nhịp và tạm dừng/tiếp tục. Đây là kiểm tra logic mô phỏng DOM/clock, không thay cho đo độ trễ audio thực trên thiết bị.

Nguồn tham khảo cơ chế múa sạp: https://dantoc.vietnamtourism.gov.vn/en/bamboo-dancing-a-unique-cultural-feature-of-the-northwest-people/
