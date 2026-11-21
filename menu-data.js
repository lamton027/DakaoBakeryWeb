(() => {
  "use strict";

  const API_URL = String(window.DAKAO_MENU_API_URL || "").trim();
  const CACHE_KEY = "dakao-menu-last-good-v1";
  const REFRESH_INTERVAL = 5 * 60 * 1000;
  const statusNode = document.querySelector("[data-menu-status]");
  const countNode = document.querySelector("[data-menu-count]");

  const englishNames = {
    "banh-mi": "Vietnamese baguette",
    "banh-mi-tuoi": "Fresh bread",
    "banh-bao": "Steamed bun",
    "banh-bao-tuoi": "Fresh steamed bun",
    "da-bao": "Bun wrapper",
    "sandwich-ngot": "Sweet sandwich",
    "sandwich-lat": "Savoury sandwich",
    "sandwich-nguyen-cam": "Whole-wheat",
    "cha-gio": "Spring rolls",
    "banh-gio": "Rice dumpling",
    "cha-lua": "Vietnamese pork roll",
    "xoi": "Sticky rice",
  };

  const fallbackImages = {
    "banh-mi": "assets/product-banh-mi.jpg",
    "banh-mi-tuoi": "assets/hero-banh-mi.jpg",
    "da-bao": "assets/product-da-bao.jpg",
    "sandwich-ngot": "assets/product-sandwich.jpg",
    "sandwich-lat": "assets/product-sandwich.jpg",
    "sandwich-nguyen-cam": "assets/product-sandwich.jpg",
    "cha-lua": "assets/product-cha-lua.jpg",
  };

  function setStatus(message, state) {
    if (!statusNode) return;
    statusNode.textContent = message;
    statusNode.dataset.state = state;
    document.dispatchEvent(new CustomEvent("dakao:menu-rendered"));
  }

  function normalizeCategory(value) {
    const category = String(value || "").trim().toLocaleLowerCase("vi");
    if (category.includes("bánh mì")) return "Bánh Mì";
    if (category.includes("bánh bao")) return "Bánh Bao";
    if (category.includes("sandwich") || category.includes("hot dog") || category.includes("burger")) {
      return "Sandwich - Hot dog - Burger";
    }
    return "Các món ăn kèm";
  }

  function parseBoolean(value, fallback = false) {
    if (typeof value === "boolean") return value;
    const normalized = String(value ?? "").trim().toLowerCase();
    if (["true", "1", "yes", "y", "có"].includes(normalized)) return true;
    if (["false", "0", "no", "n", "không"].includes(normalized)) return false;
    return fallback;
  }

  function normalizeProduct(raw, index) {
    const digits = String(raw.price ?? "").replace(/[^0-9]/g, "");
    return {
      id: String(raw.id || `menu-${index}`).trim(),
      name: String(raw.name || "").trim(),
      category: normalizeCategory(raw.category),
      unit: String(raw.unit || "").trim(),
      price: digits ? Number.parseInt(digits, 10) : null,
      image: String(raw.image || "").trim(),
      desc: String(raw.desc || "").trim(),
      bestseller: parseBoolean(raw.bestseller),
      active: parseBoolean(raw.active, true),
      sort: Number.parseFloat(raw.sort) || index,
    };
  }

  function formatPrice(value) {
    if (!Number.isFinite(value)) return "Liên hệ";
    return `${new Intl.NumberFormat("vi-VN").format(value)}₫`;
  }

  function resolveImage(value) {
    const source = String(value || "").trim();
    if (!source) return "";
    if (/^https?:\/\//i.test(source)) {
      const driveId = source.match(/\/file\/d\/([^/?]+)/)?.[1]
        || source.match(/[?&]id=([^&]+)/)?.[1];
      return driveId ? `https://lh3.googleusercontent.com/d/${driveId}` : source;
    }
    if (source.startsWith("../") || source.startsWith("./") || source.startsWith("/")) return source;
    if (source.startsWith("assets/")) return source;
    return `assets/${source}`;
  }

  function productInitials(name) {
    return String(name || "M")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toLocaleUpperCase("vi"))
      .join("");
  }

  function makeThumb(product) {
    const thumb = document.createElement("figure");
    thumb.className = "menu-item-thumb";

    const initials = document.createElement("span");
    initials.setAttribute("aria-hidden", "true");
    initials.textContent = productInitials(product.name);
    thumb.append(initials);

    const requested = resolveImage(product.image);
    const fallback = fallbackImages[product.id] || "";
    const firstSource = requested || fallback;
    if (!firstSource) return thumb;

    const image = document.createElement("img");
    image.alt = product.name;
    image.loading = "lazy";
    image.src = firstSource;
    thumb.classList.add("has-image");

    image.addEventListener("error", () => {
      if (fallback && image.src !== new URL(fallback, document.baseURI).href) {
        image.src = fallback;
        return;
      }
      image.remove();
      thumb.classList.remove("has-image");
    });
    thumb.append(image);
    return thumb;
  }

  function makeItem(product) {
    const article = document.createElement("article");
    article.className = `menu-item${product.bestseller ? " menu-item-highlight" : ""}`;
    article.dataset.productId = product.id;

    const main = document.createElement("div");
    main.className = "menu-item-main";
    const copy = document.createElement("div");
    copy.className = "menu-item-copy";
    const title = document.createElement("h3");
    title.append(document.createTextNode(product.name));

    const english = englishNames[product.id];
    if (english) {
      const translation = document.createElement("span");
      translation.lang = "en";
      translation.textContent = ` · ${english}`;
      title.append(translation);
    }

    const description = document.createElement("p");
    description.textContent = product.desc;
    copy.append(title, description);
    main.append(makeThumb(product), copy);

    const price = document.createElement("div");
    price.className = "menu-price";
    const value = document.createElement("strong");
    value.textContent = formatPrice(product.price);
    const unit = document.createElement("span");
    unit.textContent = product.unit ? `/ ${product.unit}` : "";
    price.append(value, unit);

    article.append(main, price);
    return article;
  }

  function render(products) {
    const normalized = products
      .map(normalizeProduct)
      .filter((product) => product.active && product.name)
      .sort((a, b) => a.sort - b.sort);

    document.querySelectorAll("[data-menu-category]").forEach((section) => {
      const category = section.dataset.menuCategory;
      const items = normalized.filter((product) => product.category === category);
      const container = section.querySelector("[data-menu-items]");
      section.hidden = items.length === 0;
      if (!container || items.length === 0) return;
      container.replaceChildren(...items.map(makeItem));
    });

    if (countNode) countNode.textContent = String(normalized.length);
    document.dispatchEvent(new CustomEvent("dakao:menu-rendered"));
    return normalized.length;
  }

  function readCached() {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
      return Array.isArray(cached?.products) ? cached : null;
    } catch {
      return null;
    }
  }

  function writeCached(payload) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
    } catch {
      // A blocked/full localStorage must not prevent the menu from rendering.
    }
  }

  async function syncMenu() {
    if (!API_URL || API_URL.includes("PASTE_")) {
      setStatus("Giá tham khảo · Vui lòng liên hệ để xác nhận", "partial");
      return;
    }

    setStatus("Đang đồng bộ từ Google Sheet…", "loading");
    try {
      const separator = API_URL.includes("?") ? "&" : "?";
      const response = await fetch(`${API_URL}${separator}t=${Date.now()}`, {
        cache: "no-store",
        redirect: "follow",
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const payload = await response.json();
      if (!payload?.ok || !Array.isArray(payload.products)) {
        throw new Error(payload?.error || "Dữ liệu API không hợp lệ");
      }

      const total = render(payload.products);
      writeCached(payload);
      if (total === 0) {
        setStatus("Sheet chưa có món active để hiển thị", "empty");
        return;
      }
      const updated = payload.updatedAt
        ? new Date(payload.updatedAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
        : "vừa xong";
      setStatus(`Đã đồng bộ ${total} món · ${updated}`, "live");
    } catch (error) {
      console.warn("Không thể đồng bộ menu từ Google Sheet", error);
      const cached = readCached();
      if (cached) {
        const total = render(cached.products);
        setStatus(`Mất kết nối · Đang dùng ${total} món đã lưu gần nhất`, "error");
      } else {
        setStatus("Mất kết nối · Đang dùng thực đơn dự phòng", "error");
      }
    }
  }

  syncMenu();
  window.setInterval(syncMenu, REFRESH_INTERVAL);
})();
