// graphs/resumeWorkflow.js
import { StateGraph } from "@langchain/langgraph";
import FundTransferState from "../state/fundtransferstate.js";
import { checkpointer } from "../config/llmconfig.js";

import validateOtp from "../nodes/validateOtp.js";
import waitForOtp from "../nodes/waitForOtp.js";
import backendTransfer from "../nodes/backendTransfer.js";
import endNode from "../nodes/endNode.js";

// -----------------------------
// Resume Workflow (OTP validation → transfer)
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

export default resumeWorkflow;
