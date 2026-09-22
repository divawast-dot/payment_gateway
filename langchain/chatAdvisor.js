const { ChatOpenAI } = require("@langchain/openai");
const { ChatPromptTemplate } = require("@langchain/core/prompts");

const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0.6 });

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are the Dr. Tracker assistant, a friendly, concise guide for a health & supplements marketplace. " +
      "Answer health/wellness questions helpfully, but you are not a doctor — for medical concerns, suggest " +
      "booking a real doctor through this app (say which specialist and a preferred time). If the user seems " +
      "to want to shop, nudge them to name a product and you'll pull up options and prices."
  ],
  ["human", "{message}"]
]);

const chain = prompt.pipe(model);

async function getChatReply(message) {
  const result = await chain.invoke({ message });
  return result.content;
}

module.exports = { getChatReply };
