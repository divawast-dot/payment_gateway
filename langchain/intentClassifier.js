const { z } = require("zod");
const { ChatOpenAI } = require("@langchain/openai");
const { ChatPromptTemplate } = require("@langchain/core/prompts");

const intentSchema = z.object({
  intent: z
    .enum(["general_chat", "purchase", "view_cart", "apply_coupon", "book_consultation"])
    .describe("The single best matching intent for the user's message"),
  reason: z.string().describe("One short sentence explaining why this intent was picked")
});

const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 });
const structuredModel = model.withStructuredOutput(intentSchema, { name: "intent_classification" });

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You classify a message from a user chatting with the Dr. Tracker assistant, a health and " +
      "supplements guide. Pick exactly one intent: " +
      "general_chat (health questions, small talk, anything not about buying or the cart), " +
      "purchase (user wants to find, compare, or buy a supplement/product), " +
      "view_cart (user asks what's in their cart or its total), " +
      "apply_coupon (user mentions a coupon/promo code or asks about discounts), " +
      "book_consultation (user wants to book, schedule, or talk to a doctor/specialist for a " +
      "consultation or checkup). " +
      "Use the recent conversation only to resolve ambiguity, the message itself decides the intent."
  ],
  ["human", "Recent conversation:\n{recentHistory}\n\nNew message: {message}"]
]);

const chain = prompt.pipe(structuredModel);

async function classifyIntent(message, recentHistory) {
  return chain.invoke({ message, recentHistory: recentHistory || "none" });
}

module.exports = { classifyIntent };
