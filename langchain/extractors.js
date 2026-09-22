const { z } = require("zod");
const { ChatOpenAI } = require("@langchain/openai");
const { ChatPromptTemplate } = require("@langchain/core/prompts");

const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 });

const purchaseSchema = z.object({
  item: z.string().describe("The product or keyword the user wants, e.g. 'vitamin c' or 'protein'"),
  category: z
    .string()
    .nullable()
    .describe("Product category if mentioned, e.g. 'Vitamins & Minerals', 'Protein', else null"),
  maxBudget: z.number().nullable().describe("Maximum budget in rupees if mentioned, else null")
});
const purchaseChain = ChatPromptTemplate.fromMessages([
  ["system", "Extract the product/category the user wants to buy or browse, and their budget if mentioned."],
  ["human", "{message}"]
]).pipe(model.withStructuredOutput(purchaseSchema, { name: "purchase_query" }));

const couponSchema = z.object({
  code: z.string().nullable().describe("The coupon/promo code mentioned by the user, uppercase, else null")
});
const couponChain = ChatPromptTemplate.fromMessages([
  ["system", "Extract any coupon or promo code the user mentions. If none is mentioned, return null."],
  ["human", "{message}"]
]).pipe(model.withStructuredOutput(couponSchema, { name: "coupon_code" }));

const bookingSchema = z.object({
  specialization: z
    .string()
    .describe(
      "The kind of doctor/specialist the user wants, e.g. 'general physician', 'dietician', " +
        "'cardiologist', 'nutritionist', 'ayurveda specialist'. Best guess if not explicit."
    ),
  preferredTime: z.string().nullable().describe("Preferred day or time if mentioned, else null")
});
const bookingChain = ChatPromptTemplate.fromMessages([
  ["system", "Extract what kind of doctor/specialist the user wants to consult and any preferred time."],
  ["human", "{message}"]
]).pipe(model.withStructuredOutput(bookingSchema, { name: "booking_details" }));

async function extractPurchaseQuery(message) {
  return purchaseChain.invoke({ message });
}

async function extractCouponCode(message) {
  return couponChain.invoke({ message });
}

async function extractBookingDetails(message) {
  return bookingChain.invoke({ message });
}

module.exports = { extractPurchaseQuery, extractCouponCode, extractBookingDetails };
