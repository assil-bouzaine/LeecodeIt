import fs from "fs";
import path from "path";

const DB_FILE = path.join(process.cwd(), "otp_history.json");
const CODE_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

// Ensure JSON file exists
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([]), "utf-8");
}

export function generateCode() {
  const history = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
  let code;
  let attempts = 0;

  // Generate unique 6-digit code
  do {
    code = Math.floor(100000 + Math.random() * 900000);
    attempts++;
    if (attempts > 10) break; // avoid infinite loop
  } while (history.some(entry => entry.code === code && Date.now() < entry.expiry));

  const timestamp = Date.now();
  const expiry = timestamp + CODE_EXPIRY_MS;

  history.push({ code, timestamp, expiry });
  fs.writeFileSync(DB_FILE, JSON.stringify(history, null, 2), "utf-8");

  return code;
}

// Example usage
generateCode();

