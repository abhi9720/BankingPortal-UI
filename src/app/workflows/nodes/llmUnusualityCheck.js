// nodes/llmUnusualityCheck.js
import { llm } from "../config/llmconfig.js";

export default async function llmUnusualityCheck(state) {
  const { transactions, newTransfer } = state;

  const prompt = `
You are a fraud detection system. 
Given the user's past transactions and a new transfer, decide if it's unusual.
Return ONLY "true" (if suspicious) or "false" (if normal).

Transactions: ${JSON.stringify(transactions, null, 2)}
New Transfer: ${JSON.stringify(newTransfer, null, 2)}
`;

  const res = await llm.invoke([{ role: "user", content: prompt }]);
  const output = res.content.toString().toLowerCase().includes("true");
  return { isSuspicious: output, transactions, newTransfer };
}
