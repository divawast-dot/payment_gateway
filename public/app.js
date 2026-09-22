const sessionId = crypto.randomUUID();

const messagesEl = document.getElementById("messages");
const chatFormEl = document.getElementById("chat-form");
const chatInputEl = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");

const chatView = document.getElementById("chat-view");
const shopView = document.getElementById("shop-view");
const chatToggleBtn = document.getElementById("chat-toggle");
const shopToggleBtn = document.getElementById("shop-toggle");
const backToChatBtn = document.getElementById("back-to-chat");
const logoBtn = document.getElementById("logo-btn");

const shopHeading = document.getElementById("shop-heading");
const shopSubheading = document.getElementById("shop-subheading");
const categoryTabsEl = document.getElementById("category-tabs");
const productGridEl = document.getElementById("product-grid");

const cartContentEl = document.getElementById("cart-content");
const cartBadgeEl = document.getElementById("cart-badge");
const cartTotalsEl = document.getElementById("cart-totals");
const cartSubtotalEl = document.getElementById("cart-subtotal");
const cartDiscountEl = document.getElementById("cart-discount");
const cartGrandTotalEl = document.getElementById("cart-grand-total");
const couponInputEl = document.getElementById("coupon-input");
const couponApplyBtn = document.getElementById("coupon-apply");
const toastEl = document.getElementById("toast");

let allProducts = [];
let allCategories = [];
let activeCategory = "All";
let displayedProducts = [];

function formatPrice(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

function showToast(text) {
  toastEl.textContent = text;
  toastEl.classList.add("show");
  setTimeout(() => toastEl.classList.remove("show"), 2200);
}

// ---- View switching ----
function showChat() {
  chatView.classList.remove("hidden");
  shopView.classList.add("hidden");
  chatToggleBtn.classList.add("active");
  shopToggleBtn.classList.remove("active");
}

function showShop() {
  chatView.classList.add("hidden");
  shopView.classList.remove("hidden");
  chatToggleBtn.classList.remove("active");
  shopToggleBtn.classList.add("active");
}

chatToggleBtn.addEventListener("click", showChat);
logoBtn.addEventListener("click", showChat);
backToChatBtn.addEventListener("click", showChat);
shopToggleBtn.addEventListener("click", () => {
  shopHeading.textContent = "Shop";
  shopSubheading.textContent = "Browse products or compare vendor prices.";
  displayedProducts = allCategories.length
    ? allProducts
    : allProducts;
  renderProductGrid();
  showShop();
});

// ---- Chat ----
function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = "msg " + role;
  div.textContent = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function addIntentTag(intent) {
  const div = document.createElement("div");
  div.className = "intent-tag";
  div.textContent = "detected intent: " + intent;
  messagesEl.appendChild(div);
}

function showTypingIndicator() {
  const div = document.createElement("div");
  div.className = "msg assistant typing-indicator";
  div.id = "typing-indicator";
  div.innerHTML = "<span></span><span></span><span></span>";
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function hideTypingIndicator() {
  const el = document.getElementById("typing-indicator");
  if (el) el.remove();
}

chatFormEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = chatInputEl.value.trim();
  if (!message) return;

  addMessage("user", message);
  chatInputEl.value = "";
  sendBtn.disabled = true;
  showTypingIndicator();

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, message })
    });
    const data = await res.json();

    hideTypingIndicator();

    if (data.error) {
      addMessage("assistant", "Error: " + data.error);
      return;
    }

    addIntentTag(data.intent);
    addMessage("assistant", data.reply);

    if (data.cart) renderCart(data.cart);

    if (data.intent === "purchase" && data.products && data.products.length) {
      shopHeading.textContent = "Search results";
      shopSubheading.textContent = data.reply;
      displayedProducts = data.products;
      renderProductGrid();
      showShop();
    }
  } catch (err) {
    hideTypingIndicator();
    addMessage("assistant", "Network error, please try again.");
  } finally {
    sendBtn.disabled = false;
    chatInputEl.focus();
  }
});

// ---- Catalog / product grid ----
async function loadCatalog() {
  const res = await fetch("/api/catalog");
  const data = await res.json();
  allProducts = data.products;
  allCategories = data.categories;
  renderCategoryTabs();
}

function renderCategoryTabs() {
  const tabs = ["All", ...allCategories];
  categoryTabsEl.innerHTML = tabs
    .map(
      (category) => `
        <button type="button" class="tab${category === activeCategory ? " active" : ""}" data-category="${category}">
          ${category}
        </button>
      `
    )
    .join("");
}

categoryTabsEl.addEventListener("click", (event) => {
  const tab = event.target.closest(".tab");
  if (!tab) return;
  activeCategory = tab.dataset.category;
  renderCategoryTabs();
  displayedProducts =
    activeCategory === "All" ? allProducts : allProducts.filter((p) => p.category === activeCategory);
  shopHeading.textContent = "Shop";
  shopSubheading.textContent = "Browse products or compare vendor prices.";
  renderProductGrid();
});

function renderProductGrid() {
  if (!displayedProducts.length) {
    productGridEl.innerHTML = `<p class="empty-cart">No products match. Try another search.</p>`;
    return;
  }

  productGridEl.innerHTML = displayedProducts
    .map((product) => {
      const stars = "★".repeat(Math.round(product.rating)) + "☆".repeat(5 - Math.round(product.rating));
      return `
        <article class="product-card" data-product-id="${product.id}">
          <img class="product-image" src="${product.image}" alt="${product.name}" />
          <h3 class="product-name">${product.name}</h3>
          <p class="product-rating"><span class="stars">${stars}</span> ${product.rating} (${product.reviewCount} reviews)</p>
          <div class="product-price-row">
            <span class="product-price-range">${formatPrice(product.minPrice)}${
        product.minPrice !== product.maxPrice ? " – " + formatPrice(product.maxPrice) : ""
      }</span>
            ${product.savings > 0 ? `<span class="product-savings">Save ${formatPrice(product.savings)}</span>` : ""}
          </div>
          <button type="button" class="btn btn-secondary btn-sm toggle-vendors" data-product-id="${product.id}">
            Compare ${product.vendors.length} vendors
          </button>
          <div class="vendor-list hidden" data-vendors-for="${product.id}">
            ${product.vendors
              .map(
                (vendor) => `
                  <div class="vendor-option">
                    <span class="vendor-name">${vendor.name}</span>
                    <span class="vendor-price">${formatPrice(vendor.price)}</span>
                    <button type="button" class="btn btn-primary btn-sm add-to-cart" data-product-id="${product.id}" data-vendor="${vendor.name}">
                      Add
                    </button>
                  </div>
                `
              )
              .join("")}
          </div>
        </article>
      `;
    })
    .join("");
}

productGridEl.addEventListener("click", async (event) => {
  const toggleBtn = event.target.closest(".toggle-vendors");
  if (toggleBtn) {
    const list = productGridEl.querySelector(`[data-vendors-for="${toggleBtn.dataset.productId}"]`);
    list.classList.toggle("hidden");
    return;
  }

  const addBtn = event.target.closest(".add-to-cart");
  if (addBtn) {
    const { productId, vendor } = addBtn.dataset;
    const res = await fetch("/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, productId, vendorName: vendor })
    });
    const summary = await res.json();
    renderCart(summary);
    showToast(`Added to cart · ${vendor}`);
  }
});

// ---- Cart ----
function renderCart(summary) {
  cartBadgeEl.textContent = String(summary.itemCount);
  cartBadgeEl.hidden = summary.itemCount === 0;

  if (summary.itemCount === 0) {
    cartContentEl.innerHTML = `<div class="empty-cart">Your cart is empty.</div>`;
    cartTotalsEl.classList.add("hidden");
    return;
  }

  cartContentEl.innerHTML = summary.vendorGroups
    .map(
      (group) => `
        <div class="vendor-group" style="margin-bottom:10px;">
          <div class="vendor-banner">
            <span>${group.vendorName}</span>
            <span>${group.items.length} item${group.items.length > 1 ? "s" : ""}</span>
          </div>
          ${group.items
            .map(
              (item) => `
                <div class="cart-item">
                  <img class="cart-item-image" src="${item.product.image}" alt="${item.product.name}" />
                  <div class="cart-item-info">
                    <p class="cart-item-name">${item.product.name}</p>
                    <p class="cart-item-price">${formatPrice(item.price)}</p>
                  </div>
                  <button type="button" class="remove-btn" data-product-id="${item.productId}" aria-label="Remove">&times;</button>
                </div>
              `
            )
            .join("")}
          <div class="vendor-checkout-bar">
            <span class="vendor-total">${formatPrice(group.vendorTotal)}</span>
            <button type="button" class="btn btn-primary btn-sm checkout-vendor" data-vendor="${group.vendorName}">
              Checkout
            </button>
          </div>
        </div>
      `
    )
    .join("");

  cartTotalsEl.classList.remove("hidden");
  cartSubtotalEl.textContent = formatPrice(summary.subtotal);
  cartDiscountEl.textContent = "-" + formatPrice(summary.discount);
  cartGrandTotalEl.textContent = formatPrice(summary.total);
}

cartContentEl.addEventListener("click", async (event) => {
  const removeBtn = event.target.closest(".remove-btn");
  if (removeBtn) {
    const res = await fetch("/api/cart/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, productId: removeBtn.dataset.productId })
    });
    renderCart(await res.json());
    return;
  }

  const checkoutBtn = event.target.closest(".checkout-vendor");
  if (checkoutBtn) {
    const vendorName = checkoutBtn.dataset.vendor;
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, vendorName })
    });
    const data = await res.json();
    if (data.error) {
      showToast(data.error);
      return;
    }
    renderCart(data.cart);
    showToast(`Order ${data.order.orderId} placed with ${vendorName} · ${formatPrice(data.order.total)}`);
  }
});

couponApplyBtn.addEventListener("click", async () => {
  const code = couponInputEl.value.trim();
  if (!code) return;
  const res = await fetch("/api/coupon/apply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, code })
  });
  const data = await res.json();
  showToast(data.message);
  renderCart(data.summary);
  couponInputEl.value = "";
});

// ---- Init ----
async function init() {
  await loadCatalog();
  const cartRes = await fetch(`/api/cart?sessionId=${sessionId}`);
  renderCart(await cartRes.json());
  addMessage(
    "assistant",
    "Hi! I'm the Dr. Tracker assistant. Ask a health question, tell me what supplement you're looking for, or book a doctor consultation."
  );
  showChat();
}

init();
