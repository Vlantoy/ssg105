# Đẩy gậy · Sơn Mạch

Mở `/day-gay/` qua máy chủ tĩnh đang phục vụ dự án. Không cần cài thư viện.

- Đấu máy: giữ Space hoặc nút cảm ứng để tăng lực, thả để giảm.
- Hai người: A và ArrowUp, hoặc hai nút cảm ứng độc lập.
- Bám vùng vàng để đẩy; bám tâm 0,85 giây tích lũy để dồn lực, hồi 3 giây.
- Mỗi hiệp 25 giây; thắng hai hiệp. Hòa thì đấu lại hiệp.
- Esc tạm dừng; mất tiêu điểm hoặc ẩn tab tự tạm dừng.
- Âm thanh tổng hợp chỉ bật khi người chơi chọn. Không tải tài nguyên bên ngoài.

Hình ảnh dùng lại `assets/background/Background.png` của Ném còn; nhân vật và sân đấu được vẽ bằng Canvas, làm tròn tọa độ và tắt nội suy để giữ nét pixel. Trang phục nhân vật là cách điệu, không gán cho cộng đồng cụ thể. Cơ chế thanh lực/dồn lực là sáng tạo của bản số.

Kiểm thử: `node --test day-gay/tests/engine.test.cjs`.

## Art/UI revision

Character assets now use generated detailed pixel/RPG art matching Ném còn, in two costume colors; see `assets/README.md` for prompts and provenance. Crowd uses existing Ném còn costume assets. Responsive canvas redraws to fill the arena instead of letterboxing; the control dock floats above the bottom of the scene and hides for menus/results. Character height and ground placement adapt for portrait viewports. Engine rules are unchanged.

## Two-character update (v4)

The active pair is now the braided woman and the mature stocky man. There is no character selection menu. See `assets/CHARACTERS-v4.md` for generated assets and prompts. UI removes the footer disclaimer, decorative subtitles, repeated coaching text, duplicate athlete labels and secondary result statistics. Hold/release instructions are combined in each control button; detailed help is available once in the header. Gameplay rules are unchanged.
