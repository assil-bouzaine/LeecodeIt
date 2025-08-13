import fs from "fs";
import path from "path";

const DB_FILE = path.join(process.cwd(), "otp_history.json");

export function verifyCode(inputCode) {
  if (!fs.existsSync(DB_FILE)) return false;

  let history = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
  const now = Date.now();

  // Remove expired codes
  const activeCodes = history.filter(entry => now <= entry.expiry);
  if (activeCodes.length !== history.length) {
    fs.writeFileSync(DB_FILE, JSON.stringify(activeCodes, null, 2), "utf-8");
  }

  // Check if code exists among active codes
  return activeCodes.some(entry => entry.code === inputCode);
}

// Example usage
console.log(verifyCode(902215)); // true or false

