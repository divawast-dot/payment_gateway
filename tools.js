const { PRODUCTS, COUPONS, SPECIALIZATIONS, DOCTORS_BY_SPECIALIZATION, getProductById } = require("./store");

function withPriceStats(product) {
  const prices = product.vendors.map((v) => v.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const bestVendor = product.vendors.find((v) => v.price === minPrice).name;
  return {
    ...product,
    minPrice,
    maxPrice,
    savings: maxPrice - minPrice,
    bestVendor
  };
}

function searchProducts(query) {
  const item = (query.item || "").toLowerCase();
  const category = (query.category || "").toLowerCase();

  const matches = PRODUCTS.filter((product) => {
    const matchesText =
      !item ||
      product.name.toLowerCase().includes(item) ||
      product.category.toLowerCase().includes(item) ||
      product.description.toLowerCase().includes(item);
    const matchesCategory = !category || product.category.toLowerCase().includes(category);
    const matchesBudget = query.maxBudget
      ? product.vendors.some((v) => v.price <= query.maxBudget)
      : true;
    return matchesText && matchesCategory && matchesBudget;
  });

  return matches.map(withPriceStats);
}

function addToCart(session, productId, vendorName) {
  const product = getProductById(productId);
  if (!product) throw new Error("Unknown product");
  const vendor = product.vendors.find((v) => v.name === vendorName);
  if (!vendor) throw new Error("Unknown vendor for this product");

  const existing = session.cart.find((i) => i.productId === productId);
  if (existing) {
    existing.vendorName = vendorName;
    existing.price = vendor.price;
  } else {
    session.cart.push({ productId, vendorName, price: vendor.price });
  }
  return getCartSummary(session);
}

function removeFromCart(session, productId) {
  session.cart = session.cart.filter((i) => i.productId !== productId);
  return getCartSummary(session);
}

function applyCoupon(session, code) {
  const normalized = (code || "").trim().toUpperCase();
  const coupon = COUPONS[normalized];
  if (!coupon) {
    return { ok: false, message: `"${code}" isn't a valid Dr. Tracker coupon.`, summary: getCartSummary(session) };
  }

  const subtotal = session.cart.reduce((sum, i) => sum + i.price, 0);
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
    return {
      ok: false,
      message: `${normalized} needs a cart subtotal of at least ₹${coupon.minSubtotal}.`,
      summary: getCartSummary(session)
    };
  }

  session.appliedCoupon = normalized;
  return { ok: true, message: `Applied ${normalized}: ${coupon.description}.`, summary: getCartSummary(session) };
}

function getCartSummary(session) {
  const items = session.cart.map((i) => ({ ...i, product: getProductById(i.productId) }));
  const vendorOrder = [];
  const groups = {};
  items.forEach((item) => {
    if (!groups[item.vendorName]) {
      groups[item.vendorName] = [];
      vendorOrder.push(item.vendorName);
    }
    groups[item.vendorName].push(item);
  });

  const vendorGroups = vendorOrder.map((vendorName) => ({
    vendorName,
    items: groups[vendorName],
    vendorTotal: groups[vendorName].reduce((sum, i) => sum + i.price, 0)
  }));

  const subtotal = items.reduce((sum, i) => sum + i.price, 0);
  let discount = 0;
  const coupon = session.appliedCoupon ? COUPONS[session.appliedCoupon] : null;
  if (coupon) {
    discount = coupon.type === "percent" ? Math.round((subtotal * coupon.value) / 100) : coupon.value;
    discount = Math.min(discount, subtotal);
  }

  return {
    vendorGroups,
    itemCount: items.length,
    subtotal,
    appliedCoupon: session.appliedCoupon,
    discount,
    total: subtotal - discount
  };
}

function checkoutVendor(session, vendorName) {
  const vendorItems = session.cart.filter((i) => i.vendorName === vendorName);
  if (vendorItems.length === 0) throw new Error("No items in cart for that vendor");

  const order = {
    orderId: `DRT-${Date.now().toString(36).toUpperCase()}`,
    vendor: vendorName,
    items: vendorItems.map((i) => {
      const product = getProductById(i.productId);
      return { name: product.name, image: product.image, price: i.price };
    }),
    total: vendorItems.reduce((sum, i) => sum + i.price, 0)
  };

  session.cart = session.cart.filter((i) => i.vendorName !== vendorName);
  return order;
}

function matchSpecialization(requested) {
  const text = (requested || "").toLowerCase();
  return SPECIALIZATIONS.find((s) => s.toLowerCase().includes(text) || text.includes(s.toLowerCase()));
}

function bookDoctor(session, details) {
  const specialization = matchSpecialization(details.specialization) || "General Physician";
  const doctor = DOCTORS_BY_SPECIALIZATION[specialization];

  const slot =
    details.preferredTime && doctor.slots.includes(details.preferredTime)
      ? details.preferredTime
      : doctor.slots[Math.floor(Math.random() * doctor.slots.length)];

  const booking = { doctor: doctor.name, specialization, time: slot };
  session.bookings.push(booking);
  return booking;
}

module.exports = {
  searchProducts,
  addToCart,
  removeFromCart,
  applyCoupon,
  getCartSummary,
  checkoutVendor,
  bookDoctor
};
