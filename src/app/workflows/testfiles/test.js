import { StateGraph, MemorySaver } from "@langchain/langgraph";
import { z } from "zod";
import { ChatGroq } from "@langchain/groq";
import "dotenv/config";
import readline from "readline";

// ==============================
// 🧩 Define the State Schema
// ==============================
const FundTransferState = z.object({
  transactions: z.array(
    z.object({
      amount: z.number(),
      date: z.string(),
      type: z.string().optional(),
    })
  ),
  newTransfer: z.object({
    amount: z.number(),
    pin: z.string(),
    targetAccountNumber: z.string(),
  }),
  isSuspicious: z.boolean().optional(),
  otpGenerated: z.string().optional(),
  otpProvided: z.string().optional(),
  otpValid: z.boolean().optional(),
  transferResult: z.any().optional(),
});

// ==============================
// ⚙️ Setup Core Dependencies
// ==============================
const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0,
  apiKey: process.env.GROQ_API_KEY,
});

const checkpointer = new MemorySaver();

// ==============================
// 🧠 Node Implementations
// ==============================
async function llmUnusualityCheck(state) {
  const { transactions, newTransfer } = state;
  const prompt = `You are a fraud detection system. Given the user's past transactions and a new transfer, decide if it's unusual. Return ONLY "true" (if suspicious) or "false" (if normal).
Transactions: ${JSON.stringify(transactions, null, 2)}
New Transfer: ${JSON.stringify(newTransfer, null, 2)}`;
  const res = await llm.invoke([{ role: "user", content: prompt }]);
  const output = res.content.toString().toLowerCase().includes("true");
  return { isSuspicious: output };
}

async function generateOtp() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`✅ OTP Generated: ${otp}`);
  return { otpGenerated: otp };
}

async function sendOtp(state) {
  console.log(`📩 Sending OTP ${state.otpGenerated} to user...`);
  return {};
}

async function waitForOtp(state) {
  console.log("⏳ Waiting for user to enter OTP...");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const otpProvided = await new Promise((resolve) => {
    rl.question("👉 Please enter the OTP: ", (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
  return { otpProvided };
}

async function validateOtp(state) {
  const otpValid = state.otpProvided === state.otpGenerated;
  console.log(`🔍 OTP Validation: ${otpValid}`);
  return { otpValid };
}

async function backendTransfer(state) {
  console.log("💸 Calling backend transfer controller...");
  const transferResult = {
    status: "success",
    msg: "Funds transferred successfully!",
    amount: state.newTransfer.amount,
  };
  return { transferResult };
}

async function endNode(state) {
  console.log("🏁 Workflow complete:", state.transferResult);
  return {};
}

// ==============================
// 🔀 Define Graph and Edges
// ==============================
const workflow = new StateGraph(FundTransferState)
  .addNode("llmCheck", llmUnusualityCheck)
  .addNode("generateOtp", generateOtp)
  .addNode("sendOtp", sendOtp)
  .addNode("waitForOtp", waitForOtp)
  .addNode("validateOtp", validateOtp)
  .addNode("backendTransfer", backendTransfer)
  .addNode("end", endNode)
  .addConditionalEdges("llmCheck", (s) => {
    return s.isSuspicious ? "generateOtp" : "backendTransfer";
  })
  .addEdge("generateOtp", "sendOtp")
  .addEdge("sendOtp", "waitForOtp")
  .addEdge("waitForOtp", "validateOtp")
  .addConditionalEdges("validateOtp", (s) => {
    return s.otpValid ? "backendTransfer" : "waitForOtp";
  })
  .addEdge("backendTransfer", "end")
  .setEntryPoint("llmCheck")
  .setFinishPoint("end");

// ==============================
// 🚀 Create Runnable Agent
// ==============================
export const fundTransferAgent = workflow.compile({ checkpointer });

// ==============================
// 🧪 Example Usage
// ==============================
(async () => {
  const initialState = {
    transactions: [
      { amount: 500, date: "2025-10-01" },
      { amount: 700, date: "2025-10-05" },
    ],
    newTransfer: {
      amount: 50000,
      pin: "1234",
      targetAccountNumber: "XYZ123",
    },
  };

  const result = await fundTransferAgent.invoke(initialState, {
    configurable: { thread_id: "adi-thread-1" },
  });

  console.log("✅ Final State:", result);
})();
