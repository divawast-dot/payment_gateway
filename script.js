// ---- Product & vendor data ----
const PRODUCTS = [
  {
    id: "vitamin-c",
    name: "Vitamin C 1000mg",
    category: "Vitamins & Minerals",
    image: "images/vitamin-c.svg",
    description: "Immune-support tablets with 1000mg vitamin C per serving.",
    vendors: [
      { name: "NutriWorld", price: 349 },
      { name: "HealthHub", price: 399 },
      { name: "WellnessBox", price: 329 },
    ],
  },
  {
    id: "multivitamin",
    name: "Daily Multivitamin",
    category: "Vitamins & Minerals",
    image: "images/multivitamin.svg",
    description: "A daily blend of essential vitamins and minerals.",
    vendors: [
      { name: "NutriWorld", price: 449 },
      { name: "PureLife", price: 429 },
      { name: "FitFuel", price: 469 },
    ],
  },
  {
    id: "iron-folic",
    name: "Iron + Folic Acid",
    category: "Vitamins & Minerals",
    image: "images/iron-folic.svg",
    description: "Supports healthy red blood cell production.",
    vendors: [
      { name: "HealthHub", price: 299 },
      { name: "PureLife", price: 279 },
      { name: "NutriWorld", price: 309 },
    ],
  },
  {
    id: "whey-protein",
    name: "Whey Protein Isolate",
    category: "Protein",
    image: "images/whey-protein.svg",
    description: "25g protein per scoop to support muscle recovery.",
    vendors: [
      { name: "FitFuel", price: 2499 },
      { name: "NutriWorld", price: 2599 },
      { name: "ProteinPlus", price: 2399 },
    ],
  },
  {
    id: "plant-protein",
    name: "Plant Protein Blend",
    category: "Protein",
    image: "images/plant-protein.svg",
    description: "22g plant-based protein from pea and brown rice.",
    vendors: [
      { name: "ProteinPlus", price: 2199 },
      { name: "FitFuel", price: 2299 },
      { name: "WellnessBox", price: 2249 },
    ],
  },
  {
    id: "ashwagandha",
    name: "Ashwagandha Extract",
    category: "Herbal & Wellness",
    image: "images/ashwagandha.svg",
    description: "Adaptogenic herb extract to help manage stress.",
    vendors: [
      { name: "PureLife", price: 549 },
      { name: "NutriWorld", price: 519 },
      { name: "WellnessBox", price: 559 },
    ],
  },
  {
    id: "turmeric",
    name: "Turmeric Curcumin",
    category: "Herbal & Wellness",
    image: "images/turmeric.svg",
    description: "High-potency curcumin with black pepper extract.",
    vendors: [
      { name: "PureLife", price: 499 },
      { name: "WellnessBox", price: 479 },
      { name: "HealthHub", price: 519 },
    ],
  },
  {
    id: "omega-3",
    name: "Omega-3 Fish Oil",
    category: "Heart & Brain",
    image: "images/omega-3.svg",
    description: "Purified fish oil capsules rich in EPA and DHA.",
    vendors: [
      { name: "HealthHub", price: 599 },
      { name: "WellnessBox", price: 649 },
      { name: "PureLife", price: 579 },
    ],
  },
  {
    id: "coq10",
    name: "CoQ10 Softgels",
    category: "Heart & Brain",
    image: "images/coq10.svg",
    description: "Antioxidant support for heart and cellular energy.",
    vendors: [
      { name: "NutriWorld", price: 899 },
      { name: "HealthHub", price: 949 },
      { name: "FitFuel", price: 879 },
    ],
  },
  {
    id: "probiotics",
    name: "Probiotic Complex",
    category: "Gut & Digestive",
    image: "images/probiotics.svg",
    description: "10 billion CFU blend to support gut health.",
    vendors: [
      { name: "WellnessBox", price: 799 },
      { name: "HealthHub", price: 749 },
      { name: "ProteinPlus", price: 819 },
    ],
  },
  {
    id: "digestive-enzymes",
    name: "Digestive Enzymes",
    category: "Gut & Digestive",
    image: "images/digestive-enzymes.svg",
    description: "Enzyme blend to support healthy digestion.",
    vendors: [
      { name: "PureLife", price: 649 },
      { name: "WellnessBox", price: 629 },
      { name: "NutriWorld", price: 669 },
    ],
  },
];

const CATEGORIES = ["All", ...new Set(PRODUCTS.map((p) => p.category))];

function formatPrice(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id);
}

// ---- Cart storage ----
const CART_KEY = "dr_tracker_cart";
const LAST_ORDER_KEY = "dr_tracker_last_order";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(productId, vendorName, price) {
  const cart = getCart();
  const existing = cart.find((item) => item.productId === productId);
  if (existing) {
    existing.vendorName = vendorName;
    existing.price = price;
  } else {
    cart.push({ productId, vendorName, price });
  }
  saveCart(cart);
}

function removeFromCart(productId) {
  saveCart(getCart().filter((i) => i.productId !== productId));
}

function checkoutVendor(vendorName) {
  const cart = getCart();
  const vendorItems = cart.filter((i) => i.vendorName === vendorName);

  const order = {
    vendor: vendorName,
    items: vendorItems.map((i) => {
      const product = getProductById(i.productId);
      return { name: product.name, image: product.image, price: i.price };
    }),
    total: vendorItems.reduce((sum, i) => sum + i.price, 0),
  };
  sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));

  saveCart(cart.filter((i) => i.vendorName !== vendorName));
  window.location.href = "confirmation.html";
}

function renderCartBadge() {
  const count = getCart().length;
  document.querySelectorAll(".cart-badge").forEach((el) => {
    el.textContent = String(count);
    el.hidden = count === 0;
  });
}

// ---- Wishlist storage ----
const WISHLIST_KEY = "dr_tracker_wishlist";

const HEART_ICON_SVG = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;

function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
  } catch {
    return [];
  }
}

function saveWishlist(list) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
}

function isWishlisted(productId) {
  return getWishlist().includes(productId);
}

function toggleWishlist(productId) {
  const list = getWishlist();
  const idx = list.indexOf(productId);
  if (idx === -1) list.push(productId);
  else list.splice(idx, 1);
  saveWishlist(list);
}

function renderWishlistBadge() {
  const count = getWishlist().length;
  document.querySelectorAll(".wishlist-badge").forEach((el) => {
    el.textContent = String(count);
    el.hidden = count === 0;
  });
}

// ---- Home page: render category tabs + product cards ----
function renderHomePage() {
  const tabsEl = document.getElementById("category-tabs");
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  let activeCategory = "All";

  function renderTabs() {
    if (!tabsEl) return;
    tabsEl.innerHTML = CATEGORIES.map(
      (category) => `
        <button
          type="button"
          class="tab${category === activeCategory ? " active" : ""}"
          role="tab"
          aria-selected="${category === activeCategory}"
          data-category="${category}"
        >
          ${category}
        </button>
      `
    ).join("");
  }

  function renderGrid() {
    const filtered =
      activeCategory === "All"
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === activeCategory);

    grid.innerHTML = filtered
      .map(
        (product) => `
          <article class="product-card">
            <div class="product-image-wrap">
              <img class="product-image" src="${product.image}" alt="${product.name}" />
              <button
                type="button"
                class="wishlist-toggle${isWishlisted(product.id) ? " active" : ""}"
                data-product-id="${product.id}"
                aria-label="Toggle wishlist for ${product.name}"
              >
                ${HEART_ICON_SVG}
              </button>
            </div>
            <h3 class="product-name">${product.name}</h3>
            <a class="btn btn-secondary" href="product.html?id=${encodeURIComponent(product.id)}">
              Choose Vendor
            </a>
          </article>
        `
      )
      .join("");
  }

  if (tabsEl) {
    tabsEl.addEventListener("click", (event) => {
      const tab = event.target.closest(".tab");
      if (!tab) return;
      activeCategory = tab.dataset.category;
      renderTabs();
      renderGrid();
    });
  }

  grid.addEventListener("click", (event) => {
    const btn = event.target.closest(".wishlist-toggle");
    if (!btn) return;
    toggleWishlist(btn.dataset.productId);
    btn.classList.toggle("active");
    renderWishlistBadge();
  });

  renderTabs();
  renderGrid();
}

// ---- Product page: render details, vendor options, handle selection ----
function renderProductPage() {
  const detailEl = document.getElementById("product-detail");
  const vendorListEl = document.getElementById("vendor-list");
  const continueBtn = document.getElementById("continue-btn");
  const summaryEl = document.getElementById("selection-summary");
  if (!detailEl || !vendorListEl || !continueBtn) return;

  const params = new URLSearchParams(window.location.search);
  const product = getProductById(params.get("id"));

  if (!product) {
    detailEl.innerHTML = `<p>Product not found. <a href="index.html">Go back</a>.</p>`;
    vendorListEl.innerHTML = "";
    continueBtn.style.display = "none";
    return;
  }

  detailEl.innerHTML = `
    <div class="product-detail-info">
      <span class="product-category">${product.category}</span>
      <div class="product-title-row">
        <h2 class="product-title">${product.name}</h2>
        <button
          type="button"
          class="wishlist-toggle${isWishlisted(product.id) ? " active" : ""}"
          data-product-id="${product.id}"
          aria-label="Toggle wishlist for ${product.name}"
        >
          ${HEART_ICON_SVG}
        </button>
      </div>
      <p class="product-oneliner">${product.description}</p>
    </div>
    <img class="product-detail-image" src="${product.image}" alt="${product.name}" />
  `;

  detailEl.querySelector(".wishlist-toggle").addEventListener("click", (event) => {
    toggleWishlist(product.id);
    event.currentTarget.classList.toggle("active");
    renderWishlistBadge();
  });

  vendorListEl.innerHTML = product.vendors
    .map(
      (vendor, index) => `
        <label class="vendor-option" for="vendor-${index}">
          <input type="radio" name="vendor" id="vendor-${index}" value="${index}" />
          <span class="vendor-name">${vendor.name}</span>
          <span class="vendor-price">${formatPrice(vendor.price)}</span>
        </label>
      `
    )
    .join("");

  let selectedVendorIndex = null;

  vendorListEl.addEventListener("change", (event) => {
    if (event.target.name !== "vendor") return;
    selectedVendorIndex = Number(event.target.value);

    vendorListEl.querySelectorAll(".vendor-option").forEach((el) => el.classList.remove("selected"));
    event.target.closest(".vendor-option").classList.add("selected");

    const vendor = product.vendors[selectedVendorIndex];
    summaryEl.textContent = `Selected: ${vendor.name} - ${formatPrice(vendor.price)}`;
    continueBtn.disabled = false;
  });

  continueBtn.addEventListener("click", () => {
    if (selectedVendorIndex === null) return;
    const vendor = product.vendors[selectedVendorIndex];
    addToCart(product.id, vendor.name, vendor.price);
    renderCartBadge();
    window.location.href = "cart.html";
  });
}

// ---- Cart page: render vendor groups with quantity controls ----
function renderCartPage() {
  const cartEl = document.getElementById("cart-content");
  if (!cartEl) return;

  function draw() {
    const cart = getCart();

    if (cart.length === 0) {
      cartEl.innerHTML = `
        <div class="empty-cart">
          <p>Your cart is empty.</p>
          <a class="btn btn-secondary" href="index.html">Browse products</a>
        </div>
      `;
      return;
    }

    const vendorOrder = [];
    const groups = {};
    cart.forEach((item) => {
      if (!groups[item.vendorName]) {
        groups[item.vendorName] = [];
        vendorOrder.push(item.vendorName);
      }
      groups[item.vendorName].push(item);
    });

    cartEl.innerHTML = vendorOrder
      .map((vendorName) => {
        const items = groups[vendorName];
        const vendorTotal = items.reduce((sum, item) => sum + item.price, 0);

        return `
          <section class="vendor-group">
            <div class="vendor-banner">
              <span class="vendor-banner-name">${vendorName}</span>
              <span class="vendor-banner-count">${items.length} item${items.length > 1 ? "s" : ""}</span>
            </div>
            <div class="cart-items">
              ${items
                .map((item) => {
                  const product = getProductById(item.productId);
                  return `
                    <div class="cart-item">
                      <img class="cart-item-image" src="${product.image}" alt="${product.name}" />
                      <div class="cart-item-info">
                        <p class="cart-item-name">${product.name}</p>
                        <p class="cart-item-price">${formatPrice(item.price)}</p>
                      </div>
                      <button type="button" class="remove-btn" data-product-id="${item.productId}" aria-label="Remove ${product.name}">&times;</button>
                    </div>
                  `;
                })
                .join("")}
            </div>
            <div class="vendor-checkout-bar">
              <span class="vendor-total">Total: ${formatPrice(vendorTotal)}</span>
              <button type="button" class="btn btn-primary vendor-checkout-btn" data-vendor="${vendorName}">
                Checkout with ${vendorName}
              </button>
            </div>
          </section>
        `;
      })
      .join("");
  }

  cartEl.addEventListener("click", (event) => {
    const removeBtn = event.target.closest(".remove-btn");
    if (removeBtn) {
      removeFromCart(removeBtn.dataset.productId);
      draw();
      renderCartBadge();
      return;
    }

    const checkoutBtn = event.target.closest(".vendor-checkout-btn");
    if (checkoutBtn) {
      checkoutVendor(checkoutBtn.dataset.vendor);
    }
  });

  draw();
}

// ---- Confirmation page: render the just-placed order summary ----
function renderConfirmationPage() {
  const cardEl = document.getElementById("confirmation-card");
  if (!cardEl) return;

  let order = null;
  try {
    order = JSON.parse(sessionStorage.getItem(LAST_ORDER_KEY));
  } catch {
    order = null;
  }

  if (!order) {
    cardEl.innerHTML = `<p>We couldn't find that order. <a href="index.html">Go back to products</a>.</p>`;
    return;
  }

  cardEl.innerHTML = `
    <h2>Order Placed</h2>
    <p class="confirmation-vendor">Vendor: <strong>${order.vendor}</strong></p>
    <div class="confirmation-items">
      ${order.items
        .map(
          (item) => `
            <div class="confirmation-item">
              <img src="${item.image}" alt="${item.name}" />
              <span class="confirmation-item-name">${item.name}</span>
              <span class="confirmation-item-price">${formatPrice(item.price)}</span>
            </div>
          `
        )
        .join("")}
    </div>
    <p class="confirmation-total">Total: <strong>${formatPrice(order.total)}</strong></p>
    <a class="btn btn-secondary" href="index.html">Back to products</a>
  `;
}

// ---- Wishlist page: render saved products, vendor-selection-style ----
function renderWishlistPage() {
  const listEl = document.getElementById("wishlist-content");
  if (!listEl) return;

  function draw() {
    const products = getWishlist()
      .map((id) => getProductById(id))
      .filter(Boolean);

    if (products.length === 0) {
      listEl.innerHTML = `
        <div class="empty-cart">
          <p>Your wishlist is empty.</p>
          <a class="btn btn-secondary" href="index.html">Browse products</a>
        </div>
      `;
      return;
    }

    listEl.innerHTML = products
      .map(
        (product) => `
          <article class="wishlist-item">
            <div class="wishlist-item-info">
              <span class="product-category">${product.category}</span>
              <h3 class="wishlist-item-name">${product.name}</h3>
              <p class="wishlist-item-desc">${product.description}</p>
              <div class="wishlist-item-actions">
                <a class="btn btn-primary" href="product.html?id=${encodeURIComponent(product.id)}">
                  Choose Vendor
                </a>
                <button type="button" class="wishlist-remove-btn" data-product-id="${product.id}">
                  ${HEART_ICON_SVG} Remove
                </button>
              </div>
            </div>
            <img class="wishlist-item-image" src="${product.image}" alt="${product.name}" />
          </article>
        `
      )
      .join("");
  }

  listEl.addEventListener("click", (event) => {
    const removeBtn = event.target.closest(".wishlist-remove-btn");
    if (!removeBtn) return;
    toggleWishlist(removeBtn.dataset.productId);
    draw();
    renderWishlistBadge();
  });

  draw();
}

// ---- Page router ----
document.addEventListener("DOMContentLoaded", () => {
  renderCartBadge();
  renderWishlistBadge();
  const page = document.body.dataset.page;
  if (page === "home") renderHomePage();
  else if (page === "product") renderProductPage();
  else if (page === "cart") renderCartPage();
  else if (page === "wishlist") renderWishlistPage();
  else if (page === "confirmation") renderConfirmationPage();
});
