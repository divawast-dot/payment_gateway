require("dotenv").config();
const express = require("express");
const path = require("path");

const { getSession, CATEGORIES } = require("./store");
const { classifyIntent } = require("./langchain/intentClassifier");
const { extractPurchaseQuery, extractCouponCode, extractBookingDetails } = require("./langchain/extractors");
const { getChatReply } = require("./langchain/chatAdvisor");
const {
  searchProducts,
  addToCart,
  removeFromCart,
  applyCoupon,
  getCartSummary,
  checkoutVendor,
  bookDoctor
} = require("./tools");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function formatRecentHistory(history) {
  return history
    .slice(-6)
    .map((turn) => `${turn.role}: ${turn.content}`)
    .join("\n");
}

async function handleIntent(intent, message, session) {
  if (intent === "purchase") {
    const query = await extractPurchaseQuery(message);
    const products = searchProducts(query);
    const vendorNames = [...new Set(products.flatMap((p) => p.vendors.map((v) => v.name)))];
    const reply = products.length
      ? `Found "${query.item}" on ${vendorNames.join(", ")} — compare prices and reviews below, then add to cart.`
      : `No matches for "${query.item}" yet. Try a different name or category.`;
    return { reply, products };
  }

  if (intent === "view_cart") {
    const summary = getCartSummary(session);
    const reply = summary.itemCount
      ? `Your cart has ${summary.itemCount} item(s) totaling ₹${summary.total}.`
      : "Your cart is empty right now.";
    return { reply, cart: summary };
  }

  if (intent === "apply_coupon") {
    const { code } = await extractCouponCode(message);
    if (!code) {
      return {
        reply: "Which coupon code would you like to apply? Try DRTRACKER10, WELCOME50, or BULK15."
      };
    }
    const result = applyCoupon(session, code);
    return { reply: result.message, cart: result.summary };
  }

  if (intent === "book_consultation") {
    const details = await extractBookingDetails(message);
    const booking = bookDoctor(session, details);
    const reply =
      `Booked: ${booking.specialization} consultation with ${booking.doctor} on ${booking.time}. ` +
      "You'll get a reminder before the call.";
    return { reply };
  }

  const reply = await getChatReply(message);
  return { reply };
}

app.post("/api/chat", async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    if (!sessionId || !message) {
      return res.status(400).json({ error: "sessionId and message are required" });
    }

    const session = getSession(sessionId);
    const recentHistory = formatRecentHistory(session.history);

    const { intent, reason } = await classifyIntent(message, recentHistory);
    const { reply, products, cart } = await handleIntent(intent, message, session);

    session.history.push({ role: "user", content: message });
    session.history.push({ role: "assistant", content: reply });

    res.json({
      intent,
      reason,
      reply,
      products: products || null,
      cart: cart || getCartSummary(session)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong processing that message." });
  }
});

app.get("/api/catalog", (_req, res) => {
  res.json({ categories: CATEGORIES, products: searchProducts({}) });
});

app.get("/api/cart", (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId) return res.status(400).json({ error: "sessionId is required" });
  res.json(getCartSummary(getSession(sessionId)));
});

app.post("/api/cart/add", (req, res) => {
  try {
    const { sessionId, productId, vendorName } = req.body;
    if (!sessionId || !productId || !vendorName) {
      return res.status(400).json({ error: "sessionId, productId and vendorName are required" });
    }
    res.json(addToCart(getSession(sessionId), productId, vendorName));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/cart/remove", (req, res) => {
  const { sessionId, productId } = req.body;
  if (!sessionId || !productId) {
    return res.status(400).json({ error: "sessionId and productId are required" });
  }
  res.json(removeFromCart(getSession(sessionId), productId));
});

app.post("/api/coupon/apply", (req, res) => {
  const { sessionId, code } = req.body;
  if (!sessionId || !code) {
    return res.status(400).json({ error: "sessionId and code are required" });
  }
  const result = applyCoupon(getSession(sessionId), code);
  res.json(result);
});

app.post("/api/checkout", (req, res) => {
  try {
    const { sessionId, vendorName } = req.body;
    if (!sessionId || !vendorName) {
      return res.status(400).json({ error: "sessionId and vendorName are required" });
    }
    const order = checkoutVendor(getSession(sessionId), vendorName);
    res.json({ order, cart: getCartSummary(getSession(sessionId)) });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Dr. Tracker assistant running on http://localhost:${PORT}`);
});
