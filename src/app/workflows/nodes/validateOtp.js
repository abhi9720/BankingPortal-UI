// nodes/validateOtp.js
import axios from "axios";

const BACKEND_BASE_URL = process.env.BACKEND_URL || "http://localhost:8180";

export default async function validateOtp(state) {
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
