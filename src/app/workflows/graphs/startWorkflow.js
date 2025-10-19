// graphs/startWorkflow.js
import { StateGraph } from "@langchain/langgraph";
import FundTransferState from "../state/fundtransferstate.js";
import { checkpointer } from "../config/llmconfig.js";

import llmUnusualityCheck from "../nodes/llmUnusualityCheck.js";
import generateOtp from "../nodes/generateOtp.js";
import waitForOtp from "../nodes/waitForOtp.js";
import backendTransfer from "../nodes/backendTransfer.js";
import endNode from "../nodes/endNode.js";

// -----------------------------
// Start Workflow (with OTP generation if suspicious)
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

export default startWorkflow;
