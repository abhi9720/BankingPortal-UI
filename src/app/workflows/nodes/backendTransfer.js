// nodes/backendTransfer.js
export default async function backendTransfer(state) {
  console.log("💸 Delegating fund transfer to Angular frontend...");

  const payload = {
    sourceAccountNumber: state.newTransfer.sourceAccountNumber,
    targetAccountNumber: state.newTransfer.targetAccountNumber,
    amount: state.newTransfer.amount,
    pin: state.newTransfer.pin,
  };

  console.log("---------Transfer Instruction-------------", payload);

  return { waitForUserInput: false, transferInstruction: payload };
}
