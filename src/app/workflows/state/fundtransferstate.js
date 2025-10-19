// fundtransferstate.js
import { z } from "zod";

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

export default FundTransferState;
