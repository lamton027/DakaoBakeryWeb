(() => {
  "use strict";

  const ZALO_URL = "https://zalo.me/0907827072";
  const LANG_KEY = "bmd-lang";
  const CART_KEY = "bmd-cart";
  const SHEET_ID = "16anggRO2SLUId43IIVhlD-iwn0UUuH06cWrxA8XdIuo";
  // gid from the live "products-catalog" tab
  const SHEET_GID = "1141096199";
  const CATALOG_SOURCES = [
    () =>
      `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}&_=${Date.now()}`,
    () => `https://opensheet.elk.sh/${SHEET_ID}/products-catalog`,
    () => "products-catalog.csv",
  ];

  // EN-only fallbacks when Sheet text is Vietnamese
  const PRODUCT_I18N = {
    "banh-mi": "p.banhMi",
    "banh-mi-tuoi": "p.banhMiTuoi",
    "banh-bao": "p.banhBao",
    "banh-bao-tuoi": "p.banhBaoTuoi",
    "da-bao": "p.daBao",
    "sandwich-ngot": "p.sandwichSweet",
    "sandwich-lat": "p.sandwichSavory",
    "sandwich-nguyen-cam": "p.sandwichWhole",
    "cha-gio": "p.chaGio",
    "banh-gio": "p.banhGio",
    "cha-lua": "p.chaLua",
    xoi: "p.xoi",
  };

  const CATEGORY_I18N = {
    "Bánh Mì": "cat.bread",
    "Bánh mì": "cat.bread",
    "Bánh mì ổ nhỏ": "cat.breadSmall",
    "Bánh Bao": "cat.bao",
    "Bánh bao": "cat.bao",
    "Bánh bao & da bao": "cat.bao",
    "Các món ăn kèm": "cat.sides",
    "Món kèm & mang đi": "cat.sides",
    "Thực phẩm đông lạnh": "cat.frozen",
    "Sandwich - Hot dog - Burger": "cat.sandwich",
    Sandwich: "cat.sandwich",
  };

  const i18n = {
    vi: {
      skip: "Bỏ qua điều hướng",
      slogan: "Ăn ngon mỗi ngày",
      "nav.about": "Giới thiệu",
      "nav.products": "Sản phẩm",
      "nav.order": "Đặt hàng",
      "nav.contact": "Liên hệ",
      "nav.delivery": "Giao hàng",
      "nav.menu": "Menu",
      "cta.call": "Gọi ngay",
      "cta.callShort": "Gọi",
      "cta.callOrder": "Gọi đặt hàng",
      "cta.products": "Xem sản phẩm",
      "cta.order": "Đặt hàng online",
      "cta.zalo": "Nhắn Zalo",
      "hero.kicker": "Tiệm bánh · Hơn 30 năm",
      "hero.lead":
        "Bánh tươi mỗi sáng — phục vụ khách lẻ và đơn số lượng lớn. Gọi, nhắn Zalo hoặc đặt online.",
      "about.eyebrow": "Về chúng tôi",
      "about.title": "Giới thiệu Bánh Mì Đakao",
      "about.body":
        "Hơn 30 năm gắn với từng ổ bánh nóng mỗi sáng, Bánh Mì Đakao giữ một điều giản dị: làm mới mỗi ngày để bạn ăn ngon mỗi ngày — từ khách ghé quán đến đơn sỉ cho quầy.",
      "why.title": "Vì sao chọn chúng tôi",
      "why.1.title": "Bánh tươi mới mỗi ngày",
      "why.1.body": "Nướng và chế biến theo ngày bán, giữ độ nóng giòn.",
      "why.2.title": "Đồ kèm tự làm, nguồn gốc rõ",
      "why.2.body":
        "Da bao, chả lụa và món kèm do tiệm làm — rõ nguồn, ổn định chất lượng.",
      "why.3.title": "Nhận lẻ, sỉ và đặt trước",
      "why.3.body": "Phục vụ khách mang đi lẫn đơn số lượng lớn cho quầy.",
      "why.4.title": "Giao gần miễn phí",
      "why.4.body":
        "Miễn phí trong 3km với đơn từ 300.000đ; giao rộng hơn qua app đặt hàng.",
      "feedback.eyebrow": "Khách hàng nói gì",
      "feedback.title": "Phản hồi từ khách",
      "feedback.1.text":
        "“Bánh nóng mỗi sáng, giao đúng giờ cho quán mình. Đã đặt sỉ nhiều năm.”",
      "feedback.1.name": "Chị Lan",
      "feedback.1.meta": "Chủ quán ăn sáng",
      "feedback.2.text":
        "“Ổ bánh giòn, nhân đầy đặn. Gia đình mình hay gọi mang về cuối tuần.”",
      "feedback.2.name": "Anh Minh",
      "feedback.2.meta": "Khách thường xuyên",
      "feedback.3.text":
        "“Chả lụa và da bao tự làm rất ổn — đặt số lượng lớn vẫn đều chất lượng.”",
      "feedback.3.name": "Quán Phở Hương",
      "feedback.3.meta": "Khách sỉ",
      "feedback.4.text":
        "“Nhân viên dễ nói, đặt qua Zalo nhanh. Sandwich nguyên cám cũng ngon.”",
      "feedback.4.name": "Bạn Thu",
      "feedback.4.meta": "Văn phòng gần tiệm",
      "feedback.5.text":
        "“Hơn 30 năm mà vẫn giữ được cảm giác bánh nhà — đáng tin để đặt hàng ngày.”",
      "feedback.5.name": "Chú Hùng",
      "feedback.5.meta": "Khách lâu năm",
      "best.eyebrow": "Bán chạy",
      "best.title": "Món được yêu thích",
      "best.seeAll": "Xem tất cả sản phẩm →",
      "products.eyebrow": "Thực đơn",
      "products.title": "Danh mục sản phẩm",
      "products.lead":
        "Giá cập nhật theo ngày — vui lòng liên hệ để xác nhận còn hàng và báo giá.",
      "cat.breadSmall": "Bánh mì ổ nhỏ",
      "cat.bread": "Bánh Mì",
      "cat.bao": "Bánh Bao",
      "cat.frozen": "Thực phẩm đông lạnh",
      "cat.sandwich": "Sandwich - Hot dog - Burger",
      "cat.sides": "Các món ăn kèm",
      "price.contact": "Liên hệ",
      "catalog.loading": "Đang tải sản phẩm…",
      "catalog.error":
        "Không tải được danh mục. Kiểm tra kết nối hoặc thử tải lại trang.",
      "catalog.empty": "Chưa có sản phẩm.",
      "p.banhMi": "Bánh mì",
      "p.banhMi.desc": "Ổ bánh cổ điển — vỏ giòn, ruột mềm.",
      "p.banhMi.detail":
        "Ổ bánh mì truyền thống của tiệm — phù hợp ăn kèm pate, chả, rau hoặc dùng làm nền cho nhiều kiểu nhân. Có thể đặt lẻ hoặc số lượng lớn cho quán.",
      "p.banhMiTuoi": "Bánh mì tươi",
      "p.banhMiTuoi.desc": "Mới ra lò trong ngày — nóng và thơm.",
      "p.banhMiTuoi.detail":
        "Bánh mì vừa nướng trong ngày, giữ độ nóng giòn. Nên đặt trước nếu cần giao sớm hoặc số lượng nhiều.",
      "p.banhBao": "Bánh bao",
      "p.banhBao.desc": "Bánh bao mềm, nhân đậm đà.",
      "p.banhBao.detail":
        "Bánh bao nhân mặn, vỏ mềm — tiện mang đi hoặc dùng kèm buổi sáng. Hỗ trợ đặt theo suất cho quán.",
      "p.banhBaoTuoi": "Bánh bao tươi",
      "p.banhBaoTuoi.desc": "Hấp mới mỗi ngày — mang đi tiện.",
      "p.banhBaoTuoi.detail":
        "Hấp mới theo ngày bán. Giữ độ ẩm và hương vị tốt nhất khi dùng trong ngày.",
      "p.daBao": "Da bao",
      "p.daBao.desc": "Da bao tự làm tại tiệm — dùng kèm hoặc bán lẻ.",
      "p.daBao.detail":
        "Da bao do tiệm làm, nguồn gốc rõ — dùng kèm bánh mì hoặc bán lẻ theo yêu cầu.",
      "p.sandwichSweet": "Sandwich ngọt",
      "p.sandwichSweet.desc": "Vị ngọt nhẹ — phù hợp ăn sáng hoặc trà chiều.",
      "p.sandwichSweet.detail":
        "Sandwich vị ngọt dịu, đóng gói mang đi tiện. Phù hợp văn phòng hoặc set trà chiều.",
      "p.sandwichSavory": "Sandwich lạt",
      "p.sandwichSavory.desc": "Nhân mặn cân bằng — mang đi tiện.",
      "p.sandwichSavory.detail":
        "Sandwich nhân mặn cân bằng, no bụng — lựa chọn nhanh cho bữa sáng hoặc trưa nhẹ.",
      "p.sandwichWhole": "Sandwich nguyên cám",
      "p.sandwichWhole.desc": "Bánh nguyên cám — lựa chọn nhẹ bụng hơn.",
      "p.sandwichWhole.detail":
        "Làm trên nền bánh nguyên cám — lựa chọn cho khách thích vị thanh và ít ngọt hơn.",
      "p.chaGio": "Chả giò",
      "p.chaGio.desc": "Giòn ngoài, đậm đà bên trong.",
      "p.chaGio.detail":
        "Chả giò chiên giòn, phù hợp dùng kèm hoặc bán theo phần. Đặt trước để giữ suất nóng.",
      "p.banhGio": "Bánh giò",
      "p.banhGio.desc": "Bánh giò thơm, nhân truyền thống.",
      "p.banhGio.detail":
        "Bánh giò nhân truyền thống — tiện mang đi buổi sáng. Có thể đặt theo số lượng.",
      "p.chaLua": "Chả lụa",
      "p.chaLua.desc": "Chả lụa tự làm — cắt sẵn hoặc theo yêu cầu.",
      "p.chaLua.detail":
        "Chả lụa tự làm tại tiệm — cắt sẵn hoặc theo độ dày yêu cầu. Phù hợp dùng kèm bánh mì hoặc bán lẻ.",
      "p.xoi": "Xôi",
      "p.xoi.desc": "Xôi mang đi — no bụng, tiện sáng sớm.",
      "p.xoi.detail":
        "Xôi mang đi, no và tiện cho buổi sáng sớm. Liên hệ để chọn loại / số suất theo ngày.",
      "productModal.eyebrow": "Chi tiết sản phẩm",
      "productModal.order": "Thêm vào giỏ",
      "productModal.added": "Đã thêm vào giỏ hàng",
      "productModal.close": "Đóng",
      "productModal.qty": "Số lượng",
      "productModal.unit": "Đơn vị",
      "cart.open": "Mở giỏ hàng",
      "cart.openShort": "Giỏ",
      "cart.eyebrow": "Đơn của bạn",
      "cart.title": "Giỏ hàng",
      "cart.close": "Đóng giỏ hàng",
      "cart.empty": "Giỏ hàng đang trống. Chọn món và bấm “Thêm vào giỏ”.",
      "cart.note": "Ghi chú (tuỳ chọn)",
      "cart.total": "Tổng cộng",
      "cart.confirm": "Xác nhận gửi Zalo",
      "cart.clear": "Xóa giỏ hàng",
      "cart.remove": "Xóa",
      "cart.status.copied":
        "Đã copy đơn hàng. Zalo sẽ mở — dán tin nhắn và gửi.",
      "cart.status.opened":
        "Đang mở Zalo. Nếu chưa có sẵn nội dung, hãy dán tin đã copy.",
      "cart.status.empty": "Giỏ hàng trống — hãy thêm món trước.",
      "cart.status.popupBlocked":
        "Trình duyệt chặn popup Zalo. Cho phép popup rồi thử lại.",
      "cart.msg.header": "Đơn hàng — Bánh Mì Đakao",
      "cart.msg.items": "Món trong giỏ",
      "cart.msg.note": "Ghi chú",
      "cart.msg.emptyNote": "(không)",
      "cart.msg.total": "Tổng cộng",
      "cart.msg.contactPrice": "Liên hệ",
      "order.msg.qty": "Số lượng",
      "order.msg.unit": "Đơn vị",
      "order.msg.emptyQty": "(chưa chọn)",
      "order.msg.emptyUnit": "(chưa chọn)",
      "delivery.eyebrow": "Giao hàng & đặt sỉ",
      "delivery.title": "Giao tận nơi — nhận đơn lớn",
      "delivery.lead":
        "Đặt trước trong ngày để giữ suất bánh tươi. Hỗ trợ khách lẻ và đại lý / quán.",
      "delivery.1": "Miễn phí giao trong phạm vi 3km với đơn từ 300.000đ",
      "delivery.2": "Giao toàn thành phố qua các ứng dụng đặt hàng",
      "delivery.3":
        "Nhận đặt trước và đơn số lượng lớn — gọi hoặc Zalo để báo giá",
      "order.eyebrow": "Đặt hàng",
      "order.title": "Đặt hàng online",
      "order.lead":
        "Điền form — chúng tôi mở Zalo với nội dung đơn để bạn gửi nhanh. Hoặc gọi trực tiếp.",
      "order.hint1": "Hỗ trợ đặt trước và đơn số lượng lớn",
      "order.hint2": "Giờ nhận đơn: 05:00 – 20:00 hàng ngày",
      "order.name": "Họ tên",
      "order.phone": "Số điện thoại",
      "order.fulfillment": "Hình thức nhận hàng",
      "order.fulfillment.delivery": "Tự giao",
      "order.fulfillment.pickup": "Đến lấy",
      "order.items": "Chọn món & số lượng",
      "order.note": "Ghi chú (giờ lấy, yêu cầu thêm…)",
      "order.submit": "Gửi đơn qua Zalo",
      "order.status.copied":
        "Đã sao chép nội dung đơn. Cửa sổ Zalo sẽ mở — dán tin nhắn và gửi.",
      "order.status.opened":
        "Đang mở Zalo. Nếu tin nhắn chưa điền sẵn, dán nội dung đã sao chép.",
      "order.status.error": "Vui lòng nhập họ tên và số điện thoại.",
      "order.status.popupBlocked":
        "Không gửi được đơn: trình duyệt đã chặn cửa sổ popup. Hãy cho phép popup cho trang này rồi thử lại, hoặc bấm nút Zalo trên trang để mở chat thủ công.",
      "order.status.noItems": "Vui lòng chọn ít nhất một món.",
      "contact.eyebrow": "Kết nối",
      "contact.title": "Liên hệ & bản đồ",
      "contact.pitch":
        "Gọi hoặc nhắn Zalo để hỏi hàng còn, đặt trước hoặc nhận đường đến cửa hàng.",
      "contact.phone": "Điện thoại",
      "contact.address": "Địa chỉ",
      "contact.hours": "Giờ mở cửa",
      "contact.hoursValue": "05:00 – 20:00 (hàng ngày)",
      "contact.map": "Mở trên Google Maps",
      "footer.explore": "Khám phá",
      "order.msg.header": "Đơn hàng — Bánh Mì Đakao",
      "order.msg.name": "Họ tên",
      "order.msg.phone": "SĐT",
      "order.msg.fulfillment": "Nhận hàng",
      "order.msg.fulfillment.delivery": "Tự giao",
      "order.msg.fulfillment.pickup": "Đến lấy",
      "order.msg.items": "Món",
      "order.msg.note": "Ghi chú",
      "order.msg.none": "(chưa chọn)",
      "order.msg.emptyNote": "(không)",
    },
    en: {
      skip: "Skip to content",
      slogan: "Eat well every day",
      "nav.about": "About",
      "nav.products": "Products",
      "nav.order": "Order",
      "nav.contact": "Contact",
      "nav.delivery": "Delivery",
      "nav.menu": "Menu",
      "cta.call": "Call now",
      "cta.callShort": "Call",
      "cta.callOrder": "Call to order",
      "cta.products": "View products",
      "cta.order": "Order online",
      "cta.zalo": "Chat on Zalo",
      "hero.kicker": "Bakery · 30+ years",
      "hero.lead":
        "Fresh bread every morning — for walk-in guests and large orders. Call, Zalo, or order online.",
      "about.eyebrow": "About us",
      "about.title": "Meet Bánh Mì Đakao",
      "about.body":
        "For more than 30 years, Bánh Mì Đakao has stayed true to one simple promise: fresh every day, so you can eat well every day — whether you stop by or order wholesale.",
      "why.title": "Why choose us",
      "why.1.title": "Fresh every day",
      "why.1.body": "Baked and prepared for the day — hot and crisp.",
      "why.2.title": "House-made sides, clear origins",
      "why.2.body":
        "Da bao, Vietnamese pork loaf, and sides made in-house — consistent quality.",
      "why.3.title": "Retail, wholesale & pre-orders",
      "why.3.body": "Takeaway for guests and bulk orders for shops.",
      "why.4.title": "Free nearby delivery",
      "why.4.body":
        "Free within 3km for orders from 300,000đ; city-wide via delivery apps.",
      "feedback.eyebrow": "What guests say",
      "feedback.title": "Customer feedback",
      "feedback.1.text":
        "“Hot bread every morning, on-time for our shop. We’ve ordered wholesale for years.”",
      "feedback.1.name": "Ms. Lan",
      "feedback.1.meta": "Breakfast shop owner",
      "feedback.2.text":
        "“Crispy rolls, generous fillings. Our family orders takeaway on weekends.”",
      "feedback.2.name": "Mr. Minh",
      "feedback.2.meta": "Regular guest",
      "feedback.3.text":
        "“House-made pork loaf and da bao are solid — large orders stay consistent.”",
      "feedback.3.name": "Pho Huong",
      "feedback.3.meta": "Wholesale customer",
      "feedback.4.text":
        "“Friendly staff, quick Zalo orders. Whole-grain sandwich is great too.”",
      "feedback.4.name": "Thu",
      "feedback.4.meta": "Nearby office",
      "feedback.5.text":
        "“Over 30 years and it still feels homemade — trustworthy for daily orders.”",
      "feedback.5.name": "Uncle Hung",
      "feedback.5.meta": "Long-time guest",
      "best.eyebrow": "Best sellers",
      "best.title": "Favorites",
      "best.seeAll": "See all products →",
      "products.eyebrow": "Menu",
      "products.title": "Products",
      "products.lead":
        "Prices update daily — contact us to check stock and get a quote.",
      "cat.breadSmall": "Small banh mi",
      "cat.bread": "Banh mi",
      "cat.bao": "Bao",
      "cat.frozen": "Frozen foods",
      "cat.sandwich": "Sandwich, hot dog & burger",
      "cat.sides": "Sides",
      "price.contact": "Contact us",
      "catalog.loading": "Loading products…",
      "catalog.error":
        "Could not load the menu. Check your connection or refresh the page.",
      "catalog.empty": "No products yet.",
      "p.banhMi": "Banh mi",
      "p.banhMi.desc": "Classic loaf — crisp crust, soft crumb.",
      "p.banhMi.detail":
        "Our classic banh mi loaf — great with pate, cold cuts, and greens, or as a base for many fillings. Available retail or in bulk for shops.",
      "p.banhMiTuoi": "Fresh banh mi",
      "p.banhMiTuoi.desc": "Straight from the oven — hot and fragrant.",
      "p.banhMiTuoi.detail":
        "Baked the same day for peak crunch and aroma. Pre-order if you need early delivery or larger quantities.",
      "p.banhBao": "Bao",
      "p.banhBao.desc": "Soft steamed bao with savory filling.",
      "p.banhBao.detail":
        "Soft savory bao — easy takeaway or breakfast side. Bulk portions available for shops.",
      "p.banhBaoTuoi": "Fresh bao",
      "p.banhBaoTuoi.desc": "Steamed fresh daily — easy takeaway.",
      "p.banhBaoTuoi.detail":
        "Steamed fresh for the day. Best enjoyed the same day for texture and flavor.",
      "p.daBao": "Da bao",
      "p.daBao.desc": "House-made da bao — as a side or sold separately.",
      "p.daBao.detail":
        "House-made da bao with clear origins — as a banh mi side or sold on its own.",
      "p.sandwichSweet": "Sweet sandwich",
      "p.sandwichSweet.desc": "Lightly sweet — for breakfast or afternoon tea.",
      "p.sandwichSweet.detail":
        "A lightly sweet sandwich, packed for takeaway. Nice for offices or afternoon tea.",
      "p.sandwichSavory": "Savory sandwich",
      "p.sandwichSavory.desc": "Balanced savory filling — ready to go.",
      "p.sandwichSavory.detail":
        "Balanced savory filling — a quick breakfast or light lunch option.",
      "p.sandwichWhole": "Whole-grain sandwich",
      "p.sandwichWhole.desc": "Whole-grain bread — a lighter option.",
      "p.sandwichWhole.detail":
        "Made on whole-grain bread — a lighter, less sweet choice.",
      "p.chaGio": "Spring rolls",
      "p.chaGio.desc": "Crispy outside, savory inside.",
      "p.chaGio.detail":
        "Crispy fried spring rolls — as a side or by the portion. Pre-order to keep them hot.",
      "p.banhGio": "Banh gio",
      "p.banhGio.desc": "Fragrant pyramid rice dumpling, classic filling.",
      "p.banhGio.detail":
        "Classic filled banh gio — convenient morning takeaway. Available in quantity.",
      "p.chaLua": "Vietnamese pork loaf",
      "p.chaLua.desc": "House-made — sliced or custom cut.",
      "p.chaLua.detail":
        "House-made pork loaf — pre-sliced or cut to your preferred thickness. Great with banh mi or sold alone.",
      "p.xoi": "Sticky rice",
      "p.xoi.desc": "Takeaway sticky rice — filling early breakfast.",
      "p.xoi.detail":
        "Takeaway sticky rice for early mornings. Contact us for style and daily portions.",
      "productModal.eyebrow": "Product details",
      "productModal.order": "Add to cart",
      "productModal.added": "Added to cart",
      "productModal.close": "Close",
      "productModal.qty": "Quantity",
      "productModal.unit": "Unit",
      "cart.open": "Open cart",
      "cart.openShort": "Cart",
      "cart.eyebrow": "Your order",
      "cart.title": "Cart",
      "cart.close": "Close cart",
      "cart.empty": "Your cart is empty. Pick a product and tap “Add to cart”.",
      "cart.note": "Note (optional)",
      "cart.total": "Total",
      "cart.confirm": "Confirm via Zalo",
      "cart.clear": "Clear cart",
      "cart.remove": "Remove",
      "cart.status.copied":
        "Order copied. Zalo will open — paste the message and send.",
      "cart.status.opened":
        "Opening Zalo. If the message isn’t there, paste the copied text.",
      "cart.status.empty": "Cart is empty — add items first.",
      "cart.status.popupBlocked":
        "Your browser blocked the Zalo popup. Allow popups and try again.",
      "cart.msg.header": "Order — Bánh Mì Đakao",
      "cart.msg.items": "Cart items",
      "cart.msg.note": "Note",
      "cart.msg.emptyNote": "(none)",
      "cart.msg.total": "Total",
      "cart.msg.contactPrice": "Contact us",
      "delivery.eyebrow": "Delivery & wholesale",
      "delivery.title": "Delivered — large orders welcome",
      "delivery.lead":
        "Pre-order during the day to reserve fresh bread. Retail and shop partners welcome.",
      "delivery.1": "Free delivery within 3km for orders from 300,000đ",
      "delivery.2": "City-wide delivery via ordering apps",
      "delivery.3": "Pre-orders and bulk quantities — call or Zalo for a quote",
      "order.eyebrow": "Order",
      "order.title": "Order online",
      "order.lead":
        "Fill the form — we’ll open Zalo with your order text ready to send. Or call us.",
      "order.hint1": "Pre-orders and larger quantities welcome",
      "order.hint2": "Orders taken 05:00 – 20:00 daily",
      "order.name": "Full name",
      "order.phone": "Phone number",
      "order.fulfillment": "Fulfillment",
      "order.fulfillment.delivery": "Delivery",
      "order.fulfillment.pickup": "Pickup",
      "order.items": "Choose items & quantities",
      "order.note": "Notes (pickup time, extra requests…)",
      "order.submit": "Send order via Zalo",
      "order.status.copied":
        "Order text copied. Zalo will open — paste the message and send.",
      "order.status.opened":
        "Opening Zalo. If the message isn’t prefilled, paste the copied text.",
      "order.status.error": "Please enter your name and phone number.",
      "order.status.popupBlocked":
        "Could not send the order: your browser blocked the popup. Allow popups for this site and try again, or tap a Zalo button on the page to open chat manually.",
      "order.status.noItems": "Please select at least one item.",
      "order.msg.qty": "Quantity",
      "order.msg.unit": "Unit",
      "order.msg.emptyQty": "(not set)",
      "order.msg.emptyUnit": "(not set)",
      "contact.eyebrow": "Connect",
      "contact.title": "Contact & map",
      "contact.pitch":
        "Call or message on Zalo to check stock, pre-order, or get directions.",
      "contact.phone": "Phone",
      "contact.address": "Address",
      "contact.hours": "Hours",
      "contact.hoursValue": "05:00 – 20:00 (daily)",
      "contact.map": "Open in Google Maps",
      "footer.explore": "Explore",
      "order.msg.header": "Order — Bánh Mì Đakao",
      "order.msg.name": "Name",
      "order.msg.phone": "Phone",
      "order.msg.fulfillment": "Fulfillment",
      "order.msg.fulfillment.delivery": "Delivery",
      "order.msg.fulfillment.pickup": "Pickup",
      "order.msg.items": "Items",
      "order.msg.note": "Note",
      "order.msg.none": "(none selected)",
      "order.msg.emptyNote": "(none)",
    },
  };

  let lang = "vi";

  function t(key) {
    return (i18n[lang] && i18n[lang][key]) || i18n.vi[key] || key;
  }

  function applyI18n() {
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = t(key);
      if (value != null) el.textContent = value;
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      const value = t(key);
      if (value != null) el.setAttribute("aria-label", value);
    });

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      const active = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    if (typeof refreshProductModal === "function") {
      refreshProductModal();
    }
  }

  function setLang(next) {
    if (!i18n[next]) return;
    lang = next;
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (_) {
      /* ignore */
    }
    applyI18n();
    if (catalogProducts.length) {
      renderCatalog(catalogProducts);
      applyI18n();
      wireCatalogImages();
    }
    if (typeof renderCart === "function") renderCart();
  }

  function initLang() {
    let saved = null;
    try {
      saved = localStorage.getItem(LANG_KEY);
    } catch (_) {
      /* ignore */
    }
    lang = saved === "en" || saved === "vi" ? saved : "vi";
    applyI18n();

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        setLang(btn.getAttribute("data-lang"));
      });
    });
  }

  function initYear() {
    const el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function initImagePlaceholders() {
    document.querySelectorAll(".media-slot img").forEach((img) => {
      const markMissing = () => img.setAttribute("data-missing", "");
      if (img.complete && img.naturalWidth === 0) {
        markMissing();
        return;
      }
      img.addEventListener("error", markMissing);
    });
  }

  function initMobileNav() {
    const toggle = document.querySelector(".nav-toggle");
    const panel = document.getElementById("mobile-nav");
    if (!toggle || !panel) return;

    const close = () => {
      panel.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const open = panel.hidden;
      panel.hidden = !open;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    panel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", close);
    });
  }

  function initCarousel() {
    const root = document.querySelector("[data-carousel]");
    if (!root) return;

    const track = root.querySelector("[data-carousel-track]");
    const prev = document.querySelector("[data-carousel-prev]");
    const next = document.querySelector("[data-carousel-next]");
    if (!track) return;

    const cardStep = () => {
      const card = track.querySelector(".feedback-card");
      if (!card) return 280;
      const styles = getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap) || 16;
      return card.getBoundingClientRect().width + gap;
    };

    const scrollByDir = (dir) => {
      track.scrollBy({ left: dir * cardStep(), behavior: "smooth" });
    };

    prev?.addEventListener("click", () => scrollByDir(-1));
    next?.addEventListener("click", () => scrollByDir(1));

    let dragging = false;
    let startX = 0;
    let startScroll = 0;
    let moved = false;

    const onPointerDown = (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startScroll = track.scrollLeft;
      track.classList.add("is-dragging");
      track.setPointerCapture?.(e.pointerId);
    };

    const onPointerMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      track.scrollLeft = startScroll - dx;
    };

    const onPointerUp = (e) => {
      if (!dragging) return;
      dragging = false;
      track.classList.remove("is-dragging");
      try {
        track.releasePointerCapture?.(e.pointerId);
      } catch (_) {
        /* ignore */
      }
    };

    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", onPointerUp);
    track.addEventListener("pointercancel", onPointerUp);

    track.addEventListener(
      "click",
      (e) => {
        if (moved) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true
    );
  }

  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_) {
      /* fall through */
    }

    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (_) {
      ok = false;
    }
    document.body.removeChild(area);
    return ok;
  }

  function readItemQty(qtyInput) {
    const raw = Number.parseInt(qtyInput?.value || "1", 10);
    if (!Number.isFinite(raw) || raw < 1) return 1;
    return raw;
  }

  function showOrderStatus(statusEl, key, isError) {
    if (!statusEl) return;
    statusEl.hidden = false;
    statusEl.textContent = t(key);
    statusEl.classList.toggle("is-error", Boolean(isError));
  }

  async function openZaloWithMessage(message) {
    const copied = await copyText(message);
    // Do not pass "noopener" — it makes window.open() always return null.
    const popup = window.open(ZALO_URL, "_blank");
    if (!popup) {
      return { ok: false, copied, blocked: true };
    }
    try {
      popup.opener = null;
    } catch (_) {
      /* ignore */
    }
    return { ok: true, copied, blocked: false };
  }

  function loadCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((item) => ({
          id: String(item.id || "").trim(),
          name: String(item.name || "").trim(),
          unit: String(item.unit || "").trim(),
          image: String(item.image || "").trim(),
          priceRaw: String(item.priceRaw ?? "").trim(),
          qty: Math.max(1, Math.floor(Number(item.qty) || 1)),
        }))
        .filter((item) => item.id && item.name);
    } catch (_) {
      return [];
    }
  }

  function saveCart(items) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (_) {
      /* ignore */
    }
  }

  let cartItems = loadCart();
  let cartToastTimer = 0;

  function cartCount() {
    return cartItems.length;
  }

  function updateCartBadge() {
    const badge = document.getElementById("cart-badge");
    if (!badge) return;
    const count = cartCount();
    badge.textContent = String(count);
    badge.hidden = count < 1;
  }

  function showCartToast(message) {
    let toast = document.getElementById("cart-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "cart-toast";
      toast.className = "cart-toast";
      toast.setAttribute("role", "status");
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(cartToastTimer);
    cartToastTimer = window.setTimeout(() => {
      toast.hidden = true;
    }, 2200);
  }

  function resolveCartPriceRaw(item) {
    const raw = String(item?.priceRaw ?? "").trim();
    if (raw) return raw;
    return String(catalogById.get(item?.id)?.priceRaw ?? "").trim();
  }

  function parsePriceAmount(raw) {
    const value = String(raw ?? "").trim();
    if (!value) return null;
    const digits = value.replace(/[.\s,]/g, "");
    if (!/^\d+$/.test(digits)) return null;
    const amount = Number.parseInt(digits, 10);
    return Number.isFinite(amount) ? amount : null;
  }

  function formatMoneyAmount(amount) {
    return `${amount.toLocaleString("vi-VN")}đ`;
  }

  function cartLineAmount(item) {
    const unitPrice = parsePriceAmount(resolveCartPriceRaw(item));
    if (unitPrice == null) return null;
    return unitPrice * item.qty;
  }

  function cartTotals() {
    let sum = 0;
    let pricedCount = 0;
    let contactCount = 0;
    cartItems.forEach((item) => {
      const line = cartLineAmount(item);
      if (line == null) {
        contactCount += 1;
        return;
      }
      pricedCount += 1;
      sum += line;
    });
    return { sum, pricedCount, contactCount };
  }

  function formatCartTotalLabel() {
    const { sum, pricedCount, contactCount } = cartTotals();
    if (!pricedCount && contactCount) return t("price.contact");
    if (pricedCount && contactCount) {
      return `${formatMoneyAmount(sum)} +`;
    }
    return formatMoneyAmount(sum);
  }

  function addToCart(product, qty) {
    if (!product?.id || !product?.name) return;
    const amount = Math.max(1, Math.floor(Number(qty) || 1));
    const existing = cartItems.find((item) => item.id === product.id);
    if (existing) {
      existing.qty += amount;
      existing.name = product.name;
      existing.unit = product.unit || existing.unit || "";
      existing.image = product.image || existing.image || "";
      existing.priceRaw =
        product.priceRaw != null ? String(product.priceRaw) : existing.priceRaw || "";
    } else {
      cartItems.push({
        id: product.id,
        name: product.name,
        unit: product.unit || "",
        image: product.image || "",
        priceRaw: String(product.priceRaw ?? "").trim(),
        qty: amount,
      });
    }
    saveCart(cartItems);
    updateCartBadge();
    renderCart();
    showCartToast(t("productModal.added"));
  }

  function setCartItemQty(id, qty) {
    const item = cartItems.find((entry) => entry.id === id);
    if (!item) return;
    item.qty = Math.max(1, Math.floor(Number(qty) || 1));
    saveCart(cartItems);
    updateCartBadge();
    renderCart();
  }

  function removeCartItem(id) {
    cartItems = cartItems.filter((item) => item.id !== id);
    saveCart(cartItems);
    updateCartBadge();
    renderCart();
  }

  function clearCart() {
    cartItems = [];
    saveCart(cartItems);
    updateCartBadge();
    renderCart();
    const note = document.getElementById("cart-note");
    if (note) note.value = "";
  }

  function buildCartMessage() {
    const note = document.getElementById("cart-note")?.value.trim() || "";
    const itemLines = cartItems.map((item) => {
      const unit = item.unit ? ` ${item.unit}` : "";
      const line = cartLineAmount(item);
      const priceLabel =
        line == null ? t("cart.msg.contactPrice") : formatMoneyAmount(line);
      return `- ${item.name}: ${item.qty}${unit} — ${priceLabel}`;
    });
    return [
      t("cart.msg.header"),
      `${t("cart.msg.items")}:`,
      ...(itemLines.length ? itemLines : [`- ${t("order.msg.none")}`]),
      `${t("cart.msg.total")}: ${formatCartTotalLabel()}`,
      `${t("cart.msg.note")}: ${note || t("cart.msg.emptyNote")}`,
    ].join("\n");
  }

  function cartItemHtml(item) {
    const name = escapeHtml(item.name);
    const unit = escapeHtml(item.unit || "");
    const img = escapeHtml(item.image || "");
    const id = escapeHtml(item.id);
    const priceRaw = resolveCartPriceRaw(item);
    const unitPriceLabel = escapeHtml(formatPrice(priceRaw));
    const line = cartLineAmount(item);
    const lineLabel = escapeHtml(
      line == null ? t("price.contact") : formatMoneyAmount(line)
    );
    const qtyMeta = unit
      ? `${escapeHtml(String(item.qty))} ${unit}`
      : escapeHtml(String(item.qty));

    return `<li class="cart-item" data-cart-id="${id}">
      <div class="media-slot ratio-1x1 cart-item-media" data-ph="${name}">
        <img src="${img}" alt="${name}" width="64" height="64" loading="lazy" />
      </div>
      <div class="cart-item-copy">
        <strong>${name}</strong>
        <p class="cart-item-meta">${qtyMeta} · ${unitPriceLabel}</p>
        <p class="cart-item-line-price">${lineLabel}</p>
      </div>
      <div class="cart-item-controls">
        <div class="qty-stepper">
          <button type="button" class="qty-btn" data-cart-qty-minus aria-label="−">−</button>
          <input class="cart-qty" type="number" inputmode="numeric" min="1" step="1" value="${item.qty}" aria-label="${escapeHtml(t("productModal.qty"))}" />
          <button type="button" class="qty-btn" data-cart-qty-plus aria-label="+">+</button>
        </div>
        <button type="button" class="cart-item-remove" data-cart-remove>${escapeHtml(t("cart.remove"))}</button>
      </div>
    </li>`;
  }

  function renderCart() {
    const list = document.getElementById("cart-list");
    const listWrap = document.getElementById("cart-list-wrap");
    const empty = document.getElementById("cart-empty");
    const footer = document.getElementById("cart-footer");
    const totalEl = document.getElementById("cart-total");
    if (!list || !empty || !footer) return;

    const hasItems = cartItems.length > 0;
    empty.hidden = hasItems;
    if (listWrap) listWrap.hidden = !hasItems;
    footer.hidden = !hasItems;

    list.innerHTML = hasItems ? cartItems.map(cartItemHtml).join("") : "";
    if (totalEl) totalEl.textContent = hasItems ? formatCartTotalLabel() : "";

    list.querySelectorAll("img").forEach((img) => {
      const markMissing = () => img.setAttribute("data-missing", "");
      if (!img.getAttribute("src")) {
        markMissing();
        return;
      }
      img.addEventListener("error", markMissing, { once: true });
      if (img.complete && img.naturalWidth === 0) markMissing();
    });
    updateCartBadge();
  }

  function isCartOpen() {
    const drawer = document.getElementById("cart-drawer");
    return Boolean(drawer && !drawer.hidden);
  }

  function openCart() {
    const drawer = document.getElementById("cart-drawer");
    const panel = drawer?.querySelector(".cart-drawer-panel");
    if (!drawer) return;
    renderCart();
    drawer.hidden = false;
    document.body.classList.add("modal-open");
    panel?.focus?.();
  }

  function closeCart() {
    const drawer = document.getElementById("cart-drawer");
    if (!drawer) return;
    drawer.hidden = true;
    if (document.getElementById("product-modal")?.hidden !== false) {
      document.body.classList.remove("modal-open");
    }
    const status = document.getElementById("cart-status");
    if (status) {
      status.hidden = true;
      status.textContent = "";
      status.classList.remove("is-error");
    }
  }

  function initCart() {
    updateCartBadge();
    renderCart();

    document.getElementById("cart-open")?.addEventListener("click", openCart);
    document.querySelectorAll("[data-open-cart]").forEach((el) => {
      el.addEventListener("click", openCart);
    });
    document.querySelectorAll("[data-cart-close]").forEach((el) => {
      el.addEventListener("click", closeCart);
    });

    document.getElementById("cart-clear")?.addEventListener("click", () => {
      clearCart();
    });

    document.getElementById("cart-confirm")?.addEventListener("click", async () => {
      const status = document.getElementById("cart-status");
      if (!cartItems.length) {
        showOrderStatus(status, "cart.status.empty", true);
        return;
      }

      const message = buildCartMessage();
      const result = await openZaloWithMessage(message);
      if (result.blocked) {
        showOrderStatus(status, "cart.status.popupBlocked", true);
        return;
      }

      showOrderStatus(
        status,
        result.copied ? "cart.status.copied" : "cart.status.opened",
        false
      );
      clearCart();
    });

    document.getElementById("cart-list")?.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const row = target.closest("[data-cart-id]");
      if (!row) return;
      const id = row.getAttribute("data-cart-id") || "";
      const item = cartItems.find((entry) => entry.id === id);
      if (!item) return;

      if (target.closest("[data-cart-remove]")) {
        removeCartItem(id);
        return;
      }
      if (target.closest("[data-cart-qty-minus]")) {
        setCartItemQty(id, item.qty - 1);
        return;
      }
      if (target.closest("[data-cart-qty-plus]")) {
        setCartItemQty(id, item.qty + 1);
      }
    });

    document.getElementById("cart-list")?.addEventListener("change", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement) || !target.matches(".cart-qty")) return;
      const row = target.closest("[data-cart-id]");
      const id = row?.getAttribute("data-cart-id") || "";
      if (!id) return;
      setCartItemQty(id, readItemQty(target));
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isCartOpen()) {
        closeCart();
      }
    });
  }

  let catalogProducts = [];
  let catalogById = new Map();
  let activeProduct = null;
  let lastFocusedEl = null;
  let refreshProductModal = () => {};

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function isTruthyFlag(value) {
    const raw = String(value ?? "")
      .trim()
      .toUpperCase();
    return raw === "TRUE" || raw === "1" || raw === "YES";
  }

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let cell = "";
    let inQuotes = false;

    const pushCell = () => {
      row.push(cell);
      cell = "";
    };
    const pushRow = () => {
      if (row.length) rows.push(row);
      row = [];
    };

    for (let i = 0; i < text.length; i += 1) {
      const ch = text[i];
      const next = text[i + 1];
      if (inQuotes) {
        if (ch === '"' && next === '"') {
          cell += '"';
          i += 1;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          cell += ch;
        }
      } else if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        pushCell();
      } else if (ch === "\n") {
        pushCell();
        pushRow();
      } else if (ch !== "\r") {
        cell += ch;
      }
    }
    if (cell.length || row.length) {
      pushCell();
      pushRow();
    }
    if (!rows.length) return [];

    const headers = rows[0].map((h) => h.trim());
    return rows
      .slice(1)
      .filter((r) => r.some((c) => String(c || "").trim()))
      .map((r) => {
        const obj = {};
        headers.forEach((h, i) => {
          obj[h] = String(r[i] ?? "").trim();
        });
        return obj;
      });
  }

  function formatPrice(raw) {
    const value = String(raw ?? "").trim();
    if (!value) return t("price.contact");

    const digits = value.replace(/[.\s,]/g, "");
    if (!/^\d+$/.test(digits)) return value;

    const amount = Number.parseInt(digits, 10);
    if (!Number.isFinite(amount)) return value;
    return `${amount.toLocaleString("vi-VN")}đ`;
  }

  function imageSrc(fileName) {
    const name = String(fileName || "").trim();
    if (!name) return "";
    if (/^https?:\/\//i.test(name) || name.startsWith("assets/")) return name;
    return `assets/${name}`;
  }

  function normalizeProduct(row) {
    const id = String(row.id || "").trim();
    const name = String(row.name || "").trim();
    if (!id || !name) return null;
    if (!isTruthyFlag(row.active ?? "TRUE")) return null;

    const nameKey = PRODUCT_I18N[id] || "";
    return {
      id,
      name,
      category: String(row.category || "").trim() || "Khác",
      unit: String(row.unit || "").trim() || "cái",
      priceRaw: String(row.price || "").trim(),
      image: imageSrc(row.image),
      desc: String(row.desc || "").trim(),
      detail: String(row.detail || "").trim(),
      bestseller: isTruthyFlag(row.bestseller),
      promote: isTruthyFlag(row.promote),
      sort: Number.parseInt(String(row.sort || "0"), 10) || 0,
      nameKey,
      descKey: nameKey ? `${nameKey}.desc` : "",
      detailKey: nameKey ? `${nameKey}.detail` : "",
    };
  }

  function productLabel(product, field) {
    const sheetValue =
      field === "name"
        ? product.name
        : field === "desc"
          ? product.desc
          : field === "detail"
            ? product.detail
            : "";

    // Sheet is the source of truth for Vietnamese copy.
    if (lang === "vi") return sheetValue;

    const key =
      field === "name"
        ? product.nameKey
        : field === "desc"
          ? product.descKey
          : field === "detail"
            ? product.detailKey
            : "";
    if (key) {
      const translated = t(key);
      if (translated && translated !== key) return translated;
    }
    return sheetValue;
  }

  function categoryLabel(category) {
    // VI: show exact category text from the Sheet.
    if (lang === "vi") return category;
    const key = CATEGORY_I18N[category];
    if (!key) return category;
    const translated = t(key);
    return translated && translated !== key ? translated : category;
  }

  function productCardHtml(product, headingTag) {
    const titleTag = headingTag === "h3" ? "h3" : "h4";
    const price = formatPrice(product.priceRaw);
    const name = escapeHtml(productLabel(product, "name"));
    const desc = escapeHtml(productLabel(product, "desc"));
    const img = escapeHtml(product.image);
    const unit = escapeHtml(product.unit);
    const orderValue = escapeHtml(product.name);

    return `<li class="product-item" data-product data-product-id="${escapeHtml(product.id)}" data-order-value="${orderValue}" data-unit="${unit}" tabindex="0" role="button" aria-haspopup="dialog">
      <div class="media-slot ratio-1x1" data-ph="${name}">
        <img src="${img}" alt="${name}" width="400" height="400" loading="lazy" />
      </div>
      <${titleTag}>${name}</${titleTag}>
      <p>${desc}</p>
      <p class="price" data-price>${escapeHtml(price)}</p>
    </li>`;
  }

  function renderCatalog(products) {
    const bestGrid = document.getElementById("best-sellers-grid");
    const categoriesEl = document.getElementById("product-categories");

    catalogProducts = products;
    catalogById = new Map(products.map((p) => [p.id, p]));

    if (bestGrid) {
      const bestsellers = products.filter((p) => p.bestseller);
      bestGrid.innerHTML = bestsellers.length
        ? bestsellers.map((p) => productCardHtml(p, "h3")).join("")
        : `<li class="catalog-loading" data-i18n="catalog.empty">${escapeHtml(t("catalog.empty"))}</li>`;
    }

    if (categoriesEl) {
      if (!products.length) {
        categoriesEl.innerHTML = `<p class="catalog-loading" data-i18n="catalog.empty">${escapeHtml(t("catalog.empty"))}</p>`;
      } else {
        const order = [];
        const groups = new Map();
        products.forEach((p) => {
          if (!groups.has(p.category)) {
            groups.set(p.category, []);
            order.push(p.category);
          }
          groups.get(p.category).push(p);
        });

        categoriesEl.innerHTML = order
          .map((category) => {
            const title = escapeHtml(categoryLabel(category));
            const cards = groups
              .get(category)
              .slice()
              .sort(
                (a, b) =>
                  Number(b.promote) - Number(a.promote) ||
                  a.sort - b.sort ||
                  a.name.localeCompare(b.name, "vi")
              )
              .map((p) => productCardHtml(p, "h4"))
              .join("");
            return `<div class="product-category">
              <h3 class="category-title">${title}</h3>
              <ul class="product-grid">${cards}</ul>
            </div>`;
          })
          .join("");
      }
    }
  }

  function showCatalogError(message) {
    const el = document.getElementById("catalog-error");
    if (!el) return;
    el.hidden = false;
    el.textContent = message;
  }

  function hideCatalogError() {
    const el = document.getElementById("catalog-error");
    if (!el) return;
    el.hidden = true;
    el.textContent = "";
  }

  function wireCatalogImages() {
    document.querySelectorAll("#best-sellers-grid img, #product-categories img").forEach((img) => {
      const markMissing = () => img.setAttribute("data-missing", "");
      if (img.complete && img.naturalWidth === 0) {
        markMissing();
        return;
      }
      img.addEventListener("error", markMissing, { once: true });
    });
  }

  async function fetchCatalogText(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const json = await response.json();
      if (!Array.isArray(json)) throw new Error("Invalid JSON catalog");
      return { kind: "json", data: json };
    }
    const text = await response.text();
    const normalized =
      text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
    if (normalized.trim().startsWith("[")) {
      const json = JSON.parse(normalized);
      if (!Array.isArray(json)) throw new Error("Invalid JSON catalog");
      return { kind: "json", data: json };
    }
    return { kind: "csv", data: normalized };
  }

  async function loadCatalog() {
    hideCatalogError();
    let lastError = null;

    for (const source of CATALOG_SOURCES) {
      const url = source();
      try {
        const payload = await fetchCatalogText(url);
        const rows =
          payload.kind === "json" ? payload.data : parseCsv(payload.data);
        const products = rows
          .map(normalizeProduct)
          .filter(Boolean)
          .sort((a, b) => a.sort - b.sort || a.name.localeCompare(b.name, "vi"));

        if (!products.length) {
          throw new Error("Empty catalog");
        }

        renderCatalog(products);
        applyI18n();
        wireCatalogImages();
        renderCart();
        return;
      } catch (err) {
        lastError = err;
      }
    }

    console.error("Catalog load failed", lastError);
    showCatalogError(t("catalog.error"));
    const bestGrid = document.getElementById("best-sellers-grid");
    const categoriesEl = document.getElementById("product-categories");
    const empty = `<p class="catalog-loading" data-i18n="catalog.error">${escapeHtml(t("catalog.error"))}</p>`;
    if (bestGrid) {
      bestGrid.innerHTML = `<li class="catalog-loading" data-i18n="catalog.error">${escapeHtml(t("catalog.error"))}</li>`;
    }
    if (categoriesEl) categoriesEl.innerHTML = empty;
    applyI18n();
  }

  function initProductModal() {
    const modal = document.getElementById("product-modal");
    if (!modal) return;

    const titleEl = document.getElementById("product-modal-title");
    const descEl = document.getElementById("product-modal-desc");
    const detailEl = document.getElementById("product-modal-detail");
    const priceEl = document.getElementById("product-modal-price");
    const imgEl = document.getElementById("product-modal-img");
    const mediaEl = document.getElementById("product-modal-media");
    const qtyInput = document.getElementById("product-modal-qty");
    const qtyMinus = document.getElementById("product-modal-qty-minus");
    const qtyPlus = document.getElementById("product-modal-qty-plus");
    const unitText = document.getElementById("product-modal-unit");
    const orderBtn = document.getElementById("product-modal-order");
    const dialog = modal.querySelector(".product-modal-dialog");

    function readQty() {
      const raw = Number.parseInt(qtyInput?.value || "1", 10);
      if (!Number.isFinite(raw) || raw < 1) return 1;
      return raw;
    }

    function setQty(next) {
      if (!qtyInput) return;
      const value = Math.max(1, Math.floor(Number(next) || 1));
      qtyInput.value = String(value);
    }

    function setUnit(unit) {
      if (!unitText) return;
      unitText.textContent = unit || "cái";
    }

    function fillModal(product) {
      if (!product) return;
      if (titleEl) titleEl.textContent = productLabel(product, "name");
      if (descEl) descEl.textContent = productLabel(product, "desc");
      if (detailEl) {
        const detail = productLabel(product, "detail");
        detailEl.textContent = detail || "";
        detailEl.hidden = !detail;
      }
      if (priceEl) priceEl.textContent = formatPrice(product.priceRaw);
      if (mediaEl) mediaEl.setAttribute("data-ph", product.name || "");
      if (imgEl) {
        imgEl.removeAttribute("data-missing");
        imgEl.alt = productLabel(product, "name") || "";
        imgEl.src = product.image || "";
        const markMissing = () => imgEl.setAttribute("data-missing", "");
        if (!product.image) {
          markMissing();
        } else {
          imgEl.addEventListener("error", markMissing, { once: true });
          if (imgEl.complete && imgEl.naturalWidth === 0) markMissing();
        }
      }
    }

    refreshProductModal = () => {
      if (!modal.hidden && activeProduct) fillModal(activeProduct);
    };

    function openModal(item) {
      const id = item.getAttribute("data-product-id") || "";
      const fromCatalog = id ? catalogById.get(id) : null;

      if (fromCatalog) {
        activeProduct = fromCatalog;
      } else {
        const titleNode = item.querySelector("h3, h4");
        const descNode = item.querySelector("p:not(.price)");
        const priceNode = item.querySelector(".price");
        const imgNode = item.querySelector("img");
        activeProduct = {
          id: "",
          name: titleNode?.textContent?.trim() || "",
          category: "",
          unit: item.getAttribute("data-unit") || "cái",
          priceRaw: "",
          image: imgNode?.getAttribute("src") || "",
          desc: descNode?.textContent?.trim() || "",
          detail: "",
          bestseller: false,
          promote: false,
          sort: 0,
          nameKey: "",
          descKey: "",
          detailKey: "",
          orderValue: item.getAttribute("data-order-value") || "",
          _priceDisplay: priceNode?.textContent?.trim() || "",
        };
      }

      setQty(1);
      setUnit(activeProduct.unit);
      lastFocusedEl = document.activeElement;
      fillModal(activeProduct);
      if (activeProduct._priceDisplay && priceEl) {
        priceEl.textContent = activeProduct._priceDisplay;
      }
      modal.hidden = false;
      document.body.classList.add("modal-open");
      dialog?.focus?.();
      qtyInput?.focus();
    }

    function closeModal() {
      modal.hidden = true;
      if (!isCartOpen()) {
        document.body.classList.remove("modal-open");
      }
      activeProduct = null;
      if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
        lastFocusedEl.focus();
      }
    }

    function orderNow() {
      if (!activeProduct?.id || !activeProduct?.name) return;
      const qty = readQty();
      const product = {
        id: activeProduct.id,
        name: activeProduct.name,
        unit: activeProduct.unit || "",
        image: activeProduct.image || "",
        priceRaw: activeProduct.priceRaw || "",
      };
      closeModal();
      addToCart(product, qty);
    }

    qtyMinus?.addEventListener("click", () => setQty(readQty() - 1));
    qtyPlus?.addEventListener("click", () => setQty(readQty() + 1));
    qtyInput?.addEventListener("change", () => setQty(readQty()));
    qtyInput?.addEventListener("blur", () => setQty(readQty()));

    document.addEventListener("click", (e) => {
      const item = e.target.closest("[data-product]");
      if (!item) return;
      openModal(item);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const item = e.target.closest?.("[data-product]");
      if (!item || e.target !== item) return;
      e.preventDefault();
      openModal(item);
    });

    modal.querySelectorAll("[data-modal-close]").forEach((el) => {
      el.addEventListener("click", closeModal);
    });

    orderBtn?.addEventListener("click", orderNow);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) closeModal();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLang();
    initYear();
    initImagePlaceholders();
    initMobileNav();
    initCarousel();
    initCart();
    initProductModal();
    loadCatalog();
  });
})();
