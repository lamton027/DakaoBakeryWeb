# Bánh Mì Đakao — Hướng dẫn chỉnh sửa website

Tài liệu này giúp bạn **tự sửa nội dung** trang quảng cáo mà không cần biết sâu HTML/CSS.

| Mục | Giá trị |
|---|---|
| Thư mục site | `Website/` |
| Nội dung chính | `Website/index.html` |
| Giao diện | `Website/styles.css` |
| Ngôn ngữ / carousel / form | `Website/script.js` |
| Ảnh & logo | `Website/assets/` |
| Danh mục sản phẩm (Sheet/CSV) | `Docs/products-catalog.csv` |
| Thương hiệu | Bánh Mì Đakao |
| Màu chủ đạo | `#F4A261` |
| Slogan | Ăn ngon mỗi ngày |

> Việc hàng ngày: sửa **`index.html`**, đổi ảnh trong **`assets/`**, và (nếu cần) chuỗi EN trong **`script.js`**. Chỉ đụng `styles.css` khi đổi màu / layout.  
> **Danh mục / giá:** sửa trên Google Sheet → lưu → refresh trang web (mục 0).

---

## 0. Google Sheet danh mục sản phẩm (live)

Website **tự đọc Google Sheet mỗi lần khách mở hoặc refresh trang**.  
Bạn sửa Sheet → lưu → refresh website là thấy dữ liệu mới (giá, tên, ẩn/hiện, bestseller…).

Sheet đang dùng:
`https://docs.google.com/spreadsheets/d/16anggRO2SLUId43IIVhlD-iwn0UUuH06cWrxA8XdIuo/edit?usp=sharing`

### 0.1. Điều kiện để trang đọc được Sheet

1. **Share → Anyone with the link → Viewer** (bắt buộc).
2. Không cần Publish to web nếu Share đã mở Viewer.
3. Trang fetch CSV:
   `https://docs.google.com/spreadsheets/d/SHEET_ID/export?format=csv`
4. Nếu Google lỗi tạm thời, trang thử [opensheet](https://opensheet.elk.sh) rồi mới fallback `Website/products-catalog.csv`.

### 0.2. Các cột

| Cột | Bắt buộc | Ý nghĩa | Ví dụ |
|---|---|---|---|
| `id` | Có | Mã ổn định (không dấu) | `banh-mi` |
| `name` | Có | Tên VI | `Bánh mì` |
| `category` | Có | Nhóm | `Bánh mì` |
| `unit` | Có | Đơn vị text | `ổ` |
| `price` | Nên có | Số VND; trống = “Liên hệ” | `15000` hoặc `15.000` |
| `image` | Có | File trong `Website/assets/` | `product-banh-mi.jpg` |
| `desc` | Nên có | Mô tả ngắn | … |
| `detail` | Tuỳ | Mô tả popup | … |
| `bestseller` | Có | `TRUE` / `FALSE` | `TRUE` |
| `active` | Có | `TRUE` = hiện web | `TRUE` |
| `sort` | Có | Thứ tự | `10` |
| `promote` | Tuỳ | `TRUE` = luôn đứng đầu trong category | `FALSE` |

Giá trống → hiện **Liên hệ**. Giá số → hiện dạng `15.000đ`.

Trong mỗi category: món `promote=TRUE` xếp đầu **list món của category đó**. Thứ tự các category không đổi.

**Phân nhóm trên web = cột `category`.**  
Cùng một chữ category → cùng một mục (vd. `Bánh Mì`, `Bánh Bao`, `Các món ăn kèm`). Đổi tên sản phẩm **không** đổi nhóm — phải sửa cột `category`.

### 0.3. Sau khi sửa Sheet

1. Lưu trên Google Sheets.
2. Mở / refresh trang web — danh mục, best sellers, form đặt hàng và giá cập nhật tự động.
3. Không cần nhờ agent đồng bộ HTML nữa (trừ khi đổi sheet ID hoặc thêm cột mới).
4. Nếu món nằm sai mục: sửa ô `category` của đúng hàng `id` (vd. `xoi`, `cha-lua` → `Các món ăn kèm`).

### 0.4. Tạo Sheet lần đầu (nếu làm sheet mới)

1. Mở [Google Sheets](https://sheets.google.com) → spreadsheet trống.
2. **File → Import → Upload** → [`Docs/products-catalog.csv`](products-catalog.csv).
3. **Share → Anyone with the link → Viewer**.
4. Đưa `SHEET_ID` vào `Website/script.js` (`const SHEET_ID = "..."`).

### 0.5. Fallback local

`Website/products-catalog.csv` dùng khi không fetch được Sheet (offline / CORS). Nên giữ file này gần giống Sheet.
Ảnh vẫn do bạn bỏ vào `Website/assets/` đúng tên cột `image`.

---

## 1. Mục đích trang web

Landing giới thiệu thương hiệu, gồm:

1. Hero full-bleed (brand + slogan + CTA)
2. Giới thiệu + “Vì sao chọn chúng tôi”
3. Feedback khách (carousel vuốt trái/phải)
4. Best sellers
5. Danh mục sản phẩm (load live từ Google Sheet)
6. Giao hàng / đặt sỉ
7. Giỏ hàng (thêm từ popup sản phẩm → xác nhận Zalo)
8. Liên hệ + Google Maps + nút nổi Gọi / Zalo
9. Chuyển ngôn ngữ **VI | EN**

---

## 2. Cấu trúc thư mục

```
Website/
├── index.html
├── styles.css
├── script.js                 ← fetch Sheet mỗi lần load/refresh
├── products-catalog.csv      ← fallback offline
└── assets/
    ├── logo.svg              ← logo đầy đủ (mark + chữ)
    ├── logo-mark.svg         ← icon vuông (header / favicon)
    ├── hero.jpg              ← thay ảnh hero (placeholder nếu chưa có)
    ├── about.jpg             ← ảnh giới thiệu
    ├── product-banh-mi.jpg
    ├── product-banh-mi-tuoi.jpg
    ├── product-banh-bao.jpg
    ├── product-banh-bao-tuoi.jpg
    ├── product-da-bao.jpg
    ├── product-sandwich-ngot.jpg
    ├── product-sandwich-lat.jpg
    ├── product-sandwich-nguyen-cam.jpg
    ├── product-cha-gio.jpg
    ├── product-banh-gio.jpg
    ├── product-cha-lua.jpg
    └── product-xoi.jpg
```

Nếu file ảnh chưa có, trang vẫn hiện khối màu cam pastel + nhãn placeholder — không bị “vỡ layout”.

---

## 3. Cách xem trên máy tính

1. Mở thư mục `Website/` trong File Explorer.
2. Double-click `index.html` (Chrome / Edge / Firefox).
3. Sau mỗi lần sửa: **lưu** rồi **F5**.

Không cần cài phần mềm đặc biệt.

---

## 4. Tìm chỗ cần sửa (`EDIT:`)

Trong `index.html`, dùng **Ctrl+F** và gõ `EDIT:`.

| Muốn đổi | Vùng |
|---|---|
| Tóm tắt SĐT / Zalo / địa chỉ / giờ | Đầu file: `EDIT NHANH` |
| SĐT / Zalo header | `EDIT: SĐT / Zalo (header)` |
| Hero | `EDIT: Hero` |
| Giới thiệu + vì sao chọn | `EDIT: Giới thiệu` |
| Feedback khách | `EDIT: Feedback khách hàng` |
| Best sellers | `EDIT: Best sellers` |
| Danh mục + giá | `EDIT: Danh mục sản phẩm` |
| Giao hàng / sỉ | `EDIT: Giao hàng / sỉ` |
| Giỏ hàng | Nút **Giỏ** trên header + drawer |
| Đơn vị (ký, bịch…) | Cột `unit` trên Google Sheet |
| Liên hệ + map | `EDIT: Liên hệ` |
| Footer / FAB | `EDIT: SĐT / địa chỉ (footer)`, `EDIT: SĐT / Zalo (nút nổi)` |

---

## 5. Bảng “muốn đổi gì → sửa gì”

### 5.1. Số điện thoại

Đổi **cả ba dạng**:

| Dạng | Ví dụ | Chỗ dùng |
|---|---|---|
| Hiển thị | `0907 827 072` | Chữ trên trang |
| `tel:` | `tel:+84907827072` | Link gọi |
| Zalo | `https://zalo.me/0907827072` | Link Zalo + hằng `ZALO_URL` trong `script.js` |

Cách làm:

1. Ctrl+F `0907 827 072` → thay hiển thị.
2. Ctrl+F `84907827072` → thay trong `tel:+84...`.
3. Ctrl+F `zalo.me/0907827072` → thay link Zalo.
4. Trong `script.js`, cập nhật `const ZALO_URL = "..."`.
5. Cập nhật khối `EDIT NHANH` cho khớp.

### 5.2. Địa chỉ & giờ mở cửa

- Địa chỉ: tìm `18 Ngô Tất Tố`.
- Giờ: tìm `05:00 – 20:00` (HTML) và chuỗi `contact.hoursValue` / `order.hint2` trong `script.js` (VI + EN).
- Bản đồ: cập nhật 2 URL `maps.google.com` trong khối Liên hệ (iframe + “Mở trên Google Maps”).

### 5.3. Giá sản phẩm

Mỗi món có dòng:

```html
<p class="price" data-price>XX.000đ</p>
```

Đổi `XX.000đ` thành giá thật (ví dụ `15.000đ`) hoặc `Liên hệ`.  
Giá **không** nằm trong bộ i18n — sửa trực tiếp trong HTML.

### 5.4. Feedback khách

Trong `EDIT: Feedback khách hàng`, sửa từng thẻ `<article class="feedback-card">`:

- Nội dung: thuộc tính `data-i18n="feedback.N.text"`
- Tên / vai trò: `feedback.N.name`, `feedback.N.meta`

Sau khi sửa chữ VI trong HTML, **đồng bộ bản EN** trong `script.js` (object `i18n.en`) để nút EN không hiện text cũ.

### 5.5. Ảnh

| Loại | Tên file gợi ý | Gợi ý kích thước |
|---|---|---|
| Hero | `hero.jpg` | ngang ~1600×900+ |
| Giới thiệu | `about.jpg` | ~1200×900 |
| Sản phẩm | `product-....jpg` | vuông ~800×800 |
| Logo | `logo.svg` / `logo-mark.svg` | SVG |

- Đặt file đúng tên vào `Website/assets/` → trang tự hiện ảnh (không cần sửa HTML nếu giữ tên).
- Nén ảnh nếu >1–2 MB.

---

## 6. Thêm / sửa / xóa sản phẩm

### 6.1. Mẫu một sản phẩm

```html
<li class="product-item" data-product data-order-value="Tên món" data-unit="cái" tabindex="0" role="button" aria-haspopup="dialog">
  <div class="media-slot ratio-1x1" data-ph="Tên món">
    <img src="assets/product-ten-mon.jpg" alt="Tên món" width="400" height="400" loading="lazy" />
  </div>
  <h4 data-i18n="p.tenMon">Tên món</h4>
  <p data-i18n="p.tenMon.desc">Mô tả ngắn.</p>
  <p class="price" data-price>XX.000đ</p>
</li>
```

`data-unit` = đơn vị hiển thị dạng **text** (không phải dropdown) khi mở popup / đổ vào form.

### 6.2. Thêm món mới

1. Thêm ảnh vào `assets/`.
2. Copy một `product-item`, dán vào nhóm phù hợp trong `EDIT: Danh mục sản phẩm`.
3. Đổi `src`, `data-ph`, `alt`, chữ, giá.
4. Nếu dùng `data-i18n` mới: thêm key vào **cả** `i18n.vi` và `i18n.en` trong `script.js`.
5. (Tuỳ chọn) Thêm món mới trên Google Sheet (`active=TRUE`).

### 6.3. Best sellers

Chỉ đánh dấu `bestseller=TRUE` trên Sheet (hoặc sửa khối best sellers nếu đang hardcode).

---

## 7. Giỏ hàng → Zalo

Không còn form `#dat-hang`. Đặt hàng qua **giỏ hàng**:

1. Mở popup sản phẩm → chọn số lượng → **Thêm vào giỏ**.
2. Mở nút **Giỏ** trên header.
3. **Xác nhận gửi Zalo** → copy tin nhắn tổng hợp + mở Zalo để dán gửi.

Tin nhắn Zalo dạng:

```
Đơn hàng — Bánh Mì Đakao
Món trong giỏ:
- Bánh mì: 5 ổ
- Chả lụa: 2 ký
Ghi chú: (không)
```

#### Đổi đơn vị của từng món

Sửa cột `unit` trên Google Sheet (vd. `ổ`, `cái`, `ký`, `bịch`) rồi refresh trang.

---

## 8. Ngôn ngữ VI / EN

- Nút **VI | EN** ở header.
- Lựa chọn được nhớ trong `localStorage` (`bmd-lang`).
- Chuỗi dịch nằm trong `Website/script.js` → object `i18n`.
- Element có `data-i18n="key"` sẽ được điền từ dictionary.

Khi đổi slogan / mô tả dài: sửa HTML (VI mặc định) **và** key tương ứng trong `i18n.en`.

---

## 9. Khi nào sửa `styles.css`

- Đổi màu: biến `--primary` (`#F4A261`), `--primary-dark`, v.v. ở đầu file.
- Chỉnh khoảng cách / typography lớn.

**Không** cần CSS khi chỉ đổi chữ, SĐT, giá, ảnh, feedback.

---

## 10. Checklist trước khi đưa lên mạng

- [ ] SĐT đúng mọi chỗ (kể cả `script.js` → `ZALO_URL`)
- [ ] Link `tel:` và `zalo.me` đúng
- [ ] Địa chỉ, giờ 05:00–20:00, bản đồ đúng pin
- [ ] Thay ảnh `hero.jpg`, `about.jpg`, `product-*.jpg`
- [ ] Cập nhật giá `XX.000đ`
- [ ] Thử VI/EN, carousel feedback (vuốt + nút), giỏ hàng → Zalo
- [ ] Thử trên điện thoại: menu, FAB Gọi / Zalo

### Hosting

Upload **toàn bộ** `Website/` (`index.html`, `styles.css`, `script.js`, `assets/`). Giữ cấu trúc thư mục.

---

## 11. Lỗi thường gặp

| Hiện tượng | Nguyên nhân | Cách xử lý |
|---|---|---|
| Ảnh không hiện, chỉ thấy chữ placeholder | Chưa có file / sai tên | Đặt đúng tên trong `assets/` |
| Đổi VI nhưng EN vẫn cũ | Chưa sửa `script.js` | Đồng bộ key trong `i18n.en` |
| Form không mở Zalo | Popup bị chặn / sai URL | Cho phép popup; kiểm tra `ZALO_URL` |
| Layout rối | Xóa nhầm thẻ đóng | Undo hoặc copy lại từ git |

---

## 12. Liên hệ kỹ thuật trong repo

- App Unity (quản lý bán hàng): `Docs/TINH_NANG.md`
- Website quảng cáo **độc lập** với app — sửa website không ảnh hưởng dữ liệu bán hàng.
