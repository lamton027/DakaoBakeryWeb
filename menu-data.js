(() => {
  "use strict";

  const SHEET_ID = "16anggRO2SLUId43IIVhlD-iwn0UUuH06cWrxA8XdIuo";
  const REFRESH_INTERVAL = 5 * 60 * 1000;
  const statusNode = document.querySelector("[data-menu-status]");
  const countNode = document.querySelector("[data-menu-count]");
  const boardNode = document.querySelector(".menu-board");

  function setStatus(message, state) {
    if (!statusNode) return;
    statusNode.textContent = message;
    statusNode.dataset.state = state;
    document.dispatchEvent(new CustomEvent("dakao:menu-rendered"));
  }

  function slugify(value) {
    return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/gi, "d").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function formatPrice(value) {
    const price = Number(value);
    return Number.isFinite(price) ? `${new Intl.NumberFormat("vi-VN").format(price)}₫` : "Liên hệ";
  }

  function productInitials(name) {
    return String(name || "M").trim().split(/\s+/).slice(0, 2)
      .map((part) => part.charAt(0).toLocaleUpperCase("vi")).join("");
  }

  function localImageFor(product) {
    const name = product.name.toLocaleLowerCase("vi");
    if (name.includes("bánh mì tươi")) return "assets/hero-banh-mi.jpg";
    if (name.includes("bánh mì")) return "assets/product-banh-mi.jpg";
    return "";
  }

  function makeThumb(product) {
    const thumb = document.createElement("figure");
    thumb.className = "menu-item-thumb";
    const initials = document.createElement("span");
    initials.setAttribute("aria-hidden", "true");
    initials.textContent = productInitials(product.name);
    thumb.append(initials);

    const source = localImageFor(product);
    if (!source) return thumb;
    const image = document.createElement("img");
    image.alt = product.name;
    image.loading = "lazy";
    image.src = source;
    image.addEventListener("error", () => {
      image.remove();
      thumb.classList.remove("has-image");
    });
    thumb.classList.add("has-image");
    thumb.append(image);
    return thumb;
  }

  function makeItem(product) {
    const article = document.createElement("article");
    article.className = "menu-item";
    article.dataset.productId = slugify(product.name);

    const main = document.createElement("div");
    main.className = "menu-item-main";
    const copy = document.createElement("div");
    copy.className = "menu-item-copy";
    const title = document.createElement("h3");
    title.textContent = product.name;
    copy.append(title);
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

  function makeCategory(category, products, index) {
    const section = document.createElement("section");
    const titleId = `category-${slugify(category)}`;
    section.className = "menu-category is-visible";
    section.id = slugify(category);
    section.setAttribute("aria-labelledby", titleId);

    const heading = document.createElement("div");
    heading.className = "category-heading";
    const number = document.createElement("span");
    number.textContent = String(index + 1).padStart(2, "0");
    const headingCopy = document.createElement("div");
    const eyebrow = document.createElement("p");
    eyebrow.textContent = "Fresh daily";
    const title = document.createElement("h2");
    title.id = titleId;
    title.textContent = category;
    headingCopy.append(eyebrow, title);
    heading.append(number, headingCopy);

    const items = document.createElement("div");
    items.className = "menu-items";
    items.append(...products.map(makeItem));
    section.append(heading, items);
    return section;
  }

  function render(products, displayOrder) {
    const availableCategories = [...new Set(products.map((product) => product.category))];
    const orderedCategories = [
      ...displayOrder.filter((category) => availableCategories.includes(category)),
      ...availableCategories.filter((category) => !displayOrder.includes(category)),
    ];
    boardNode.replaceChildren(...orderedCategories.map((category, index) => {
      return makeCategory(category, products.filter((product) => product.category === category), index);
    }));
    if (countNode) countNode.textContent = String(products.length);
    document.dispatchEvent(new CustomEvent("dakao:menu-rendered"));
  }

  function loadSheet(sheetName, query) {
    return new Promise((resolve, reject) => {
      const callbackName = `__dakaoSheet_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const script = document.createElement("script");
      const timeout = window.setTimeout(() => finish(new Error(`Timeout: ${sheetName}`)), 15000);

      function cleanup() {
        window.clearTimeout(timeout);
        script.remove();
        try { delete window[callbackName]; } catch (_) { window[callbackName] = undefined; }
      }
      function finish(error, payload) {
        cleanup();
        if (error) reject(error);
        else resolve(payload);
      }

      window[callbackName] = (payload) => {
        if (payload?.status !== "ok" || !payload?.table) {
          finish(new Error(payload?.errors?.[0]?.detailed_message || `Invalid sheet: ${sheetName}`));
          return;
        }
        finish(null, payload.table);
      };
      script.onerror = () => finish(new Error(`Cannot load sheet: ${sheetName}`));
      const params = new URLSearchParams({ sheet: sheetName, tqx: `responseHandler:${callbackName}`, tq: query, t: String(Date.now()) });
      script.src = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?${params}`;
      document.head.append(script);
    });
  }

  function tableRows(table) {
    const labels = table.cols.map((column) => String(column.label || column.id || "").trim());
    return table.rows.map((row) => Object.fromEntries(labels.map((label, index) => [label, row.c?.[index]?.v ?? ""])));
  }

  async function syncMenu() {
    boardNode.replaceChildren();
    if (countNode) countNode.textContent = "0";
    setStatus("Đang đồng bộ từ Google Sheet…", "loading");
    try {
      const [catalogTable, orderTable] = await Promise.all([
        loadSheet("products-catalog", "select A,B,C,D"),
        loadSheet("products-display-order", "select A,B"),
      ]);
      const products = tableRows(catalogTable).map((row) => ({
        name: String(row.name || "").trim(),
        category: String(row.category || "").trim(),
        unit: String(row.unit || "").trim(),
        price: Number(row.price),
      })).filter((product) => product.name && product.category);
      const displayOrder = tableRows(orderTable).filter((row) => row.category)
        .sort((a, b) => Number(a.order) - Number(b.order)).map((row) => String(row.category).trim());

      render(products, displayOrder);
      setStatus(products.length ? `Đã cập nhật ${products.length} món từ Google Sheet` : "Google Sheet chưa có món để hiển thị", products.length ? "live" : "empty");
    } catch (error) {
      console.error("Không thể đọc menu từ Google Sheet", error);
      setStatus("Không thể tải thực đơn · Vui lòng thử lại", "error");
    }
  }

  syncMenu();
  window.setInterval(syncMenu, REFRESH_INTERVAL);
})();
