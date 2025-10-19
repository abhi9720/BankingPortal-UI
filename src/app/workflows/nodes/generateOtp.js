// nodes/generateOtp.js
import axios from "axios";

const BACKEND_BASE_URL = process.env.BACKEND_URL || "http://localhost:8180";

export default async function generateOtp(state) {
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
