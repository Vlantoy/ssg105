# Sắc Việt Core (Rust Engine & WebAssembly Bridge)

Thư viện lõi hiệu năng cao viết bằng **Rust** cho nền tảng trò chơi dân gian Sắc Việt.

## 🎯 Tính Năng & Tối Ưu Cốt Lõi

1. **Ném Còn (`nem_con`):**
   - **Quy tắc chiến thắng mới:** Thắng ngay khi đạt **3 điểm** (`WINNING_SCORE = 3`).
   - Mô phỏng động học lực ly tâm tích đà, gia tốc trọng trường $g = 380\text{ px/s}^2$ và lực cản khí động học $k_{\text{drag}} = 6 \times 10^{-5}$.
   - Thuật toán kiểm tra xuyên tâm hình elip của vòng còn đỉnh cột (`rx = 9px`, `ry = 38px`).

2. **Nhảy Sạp (`nhay_sap`):**
   - **Giới hạn chuỗi mũi tên:** Chuỗi phím bấm được cố định tối đa **3 nút mũi tên** (`MAX_SEQUENCE_LENGTH = 3`), loại bỏ cơ chế tăng vô hạn trước đây gây bất khả thi cho người chơi ở các vòng sau.
   - Cơ chế tăng tiến độ khó công bằng: Về sau BPM và nhịp gõ tăng dần (90 → 160 BPM) và cửa sổ căn nhịp thu hẹp dần (`good` / `perfect`), nhưng số lượng nút bấm luôn dừng ở mức 3 để tạo trải nghiệm nhịp điệu sảng khoái và vừa sức người chơi.

## 📦 Biên Dịch Ra WebAssembly (Tùy Chọn)

Khi máy tính cài đặt Rust toolchain và `wasm-pack`, có thể đóng gói thư viện này thành module WebAssembly chạy trực tiếp trên trình duyệt:

```bash
# Cài đặt wasm-pack (nếu chưa có)
cargo install wasm-pack

# Biên dịch ra target web
wasm-pack build --target web --features wasm --release
```
