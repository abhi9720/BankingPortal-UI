import { StateGraph, MemorySaver } from "@langchain/langgraph";
import { z } from "zod";
import { ChatGroq } from "@langchain/groq";
import "dotenv/config";
import axios from "axios";

// ==============================
// 🧩 Define the State Schema
// ==============================
const FundTransferState = z.object({
  transactions: z.array(
    z.object({
      amount: z.number(),
      transactionDate: z.string(),
      transactionType: z.string().optional(),
    })
  ),
  newTransfer: z
    .object({
      amount: z.number(),
      pin: z.string(),
      targetAccountNumber: z.string(),
      sourceAccountNumber: z.string(),
    })
    .optional(),
  isSuspicious: z.boolean().optional(),
  otpGenerated: z.string().optional(),
  otpProvided: z.string().optional(),
  otpValid: z.boolean().optional(),
  transferInstruction: z.any().optional(),
  waitForUserInput: z.boolean().optional(),
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

const BACKEND_BASE_URL = process.env.BACKEND_URL || "http://localhost:8180";

async function generateOtp(state) {
  console.log("📡 Requesting backend to generate OTP...");
  const payload = { identifier: state.newTransfer.sourceAccountNumber };
  try {
    const response = await axios.post(
      `${BACKEND_BASE_URL}/api/users/generate-otp`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );
    console.log(`✅ OTP generated and sent: ${response.data.message}`);
    return { otpGenerated: "SERVER_MANAGED" };
  } catch (err) {
    console.error("❌ OTP generation failed:", err.message);
    throw new Error("OTP generation failed");
  }
}

async function waitForOtp(state) {
  console.log("⏸️ Pausing workflow: waiting for user OTP input from frontend...");
  return { waitForUserInput: true };
}

async function validateOtp(state) {
  console.log("🔍 Validating OTP via backend...");
  const payload = {
    identifier: state.newTransfer.sourceAccountNumber,
    otp: state.otpProvided,
  };

  try {
    await axios.post(`${BACKEND_BASE_URL}/api/users/verify-otp`, payload);
    console.log("✅ OTP verified successfully");
    return { otpValid: true };
  } catch (err) {
    console.error("❌ OTP verification failed:", err.message);
    return { otpValid: false };
  }
}

async function backendTransfer(state) {
  console.log("💸 Delegating fund transfer to Angular frontend...");

  const payload = {
    sourceAccountNumber: state.newTransfer.sourceAccountNumber,
    targetAccountNumber: state.newTransfer.targetAccountNumber,
    amount: state.newTransfer.amount,
    pin: state.newTransfer.pin,
  };

  console.log("---------Transfer Instruction-------------", payload);

  return { waitForUserInput:false,transferInstruction: payload };
}

async function endNode(state) {
  console.log("🏁 Workflow complete. Instruction:", state.transferInstruction);
  return {};
}

// ==============================
// 🔀 Define Graph and Edges
// ==============================
// -----------------------------
// Start Workflow (with OTP generation)
// -----------------------------
const startWorkflow = new StateGraph(FundTransferState)
  .addNode("llmCheck", llmUnusualityCheck)
  .addNode("generateOtp", generateOtp)
  .addNode("waitForOtp", waitForOtp)
  .addNode("backendTransfer", backendTransfer)
  .addNode("end", endNode)

  .addConditionalEdges("llmCheck", (s) =>
    s.isSuspicious ? "generateOtp" : "backendTransfer"
  )
  .addEdge("generateOtp", "waitForOtp")
  .addEdge("backendTransfer", "end")

  .setEntryPoint("llmCheck")
  .setFinishPoint("end")
  .compile({ checkpointer });

// -----------------------------
// Resume Workflow (only OTP validation → transfer)
// -----------------------------
const resumeWorkflow = new StateGraph(FundTransferState)
  .addNode("validateOtp", validateOtp)
  .addNode("waitForOtp", waitForOtp)
  .addNode("backendTransfer", backendTransfer)
  .addNode("end", endNode)

  .addConditionalEdges("validateOtp", (s) =>
    s.otpValid ? "backendTransfer" : "waitForOtp"
  )
  .addEdge("backendTransfer", "end")

  .setEntryPoint("validateOtp")
  .setFinishPoint("end")
  .compile({ checkpointer });


export { startWorkflow, resumeWorkflow };
