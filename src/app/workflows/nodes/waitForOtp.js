// nodes/waitForOtp.js
export default async function waitForOtp(state) {
  console.log("⏸️ Pausing workflow: waiting for user OTP input from frontend...");
  return { waitForUserInput: true };
}
