// nodes/endNode.js
export default async function endNode(state) {
  console.log("🏁 Workflow complete. Instruction:", state.transferInstruction);
  return {};
}
