import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { randomUUID } from "crypto";
import startWorkflow from "../workflows/graphs/startWorkflow.js";
import resumeWorkflow from "../workflows/graphs/resumeWorkflow.js";

const app = express();
app.use(cors({ origin: "http://localhost:4200" }));
app.use(bodyParser.json());

// -----------------------------
// 1️⃣ Start Workflow
// -----------------------------
app.post("/workflow/start", async (req, res) => {
  const { transactions, newTransfer } = req.body;
  const simplifiedTransactions = transactions.map(
    ({ sourceAccountNumber, amount, transactionDate, transactionType }) => ({
      sourceAccountNumber,
      amount,
      transactionDate: String(transactionDate),
      transactionType,
    })
  );

  const threadId = randomUUID();

  const result = await startWorkflow.invoke(
    { transactions: simplifiedTransactions, newTransfer },
    { configurable: { thread_id: threadId } }
  );

  if (result.waitForUserInput) {
    return res.json({
      status: "WAITING_FOR_OTP",
      message: "Workflow paused awaiting OTP",
      checkpoint: threadId,
    });
  }

  return res.json({ status: "COMPLETED", data: result });
});

// -----------------------------
// 2️⃣ Resume Workflow
// -----------------------------
app.post("/workflow/resume", async (req, res) => {
  const { otpProvided, checkpoint } = req.body;

  const result = await resumeWorkflow.invoke(
    { otpProvided },
    { configurable: { thread_id: checkpoint } }
  );

  if (result.waitForUserInput) {
    return res.json({
      status: "INVALID_OTP",
      message: "OTP verification failed, please try again",
      checkpoint,
    });
  }

  return res.json({ status: "COMPLETED", data: result });
});

// -----------------------------
// 🚀 Start Server
// -----------------------------
app.listen(5000, () =>
  console.log("🚀 LangGraph workflow server running on port 5000")
);
