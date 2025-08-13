import puppeteer from "puppeteer";
import dotenv from "dotenv";
dotenv.config();

const bravePath = "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe";
const baseURL = "https://leetcode.com";

// Ensure env vars exist
if (!process.env.SESSION || !process.env.CSRF) {
  console.warn("⚠️ SESSION or CSRF missing in .env");
}

const sessionCookies = [
  {
    name: "LEETCODE_SESSION",
    value: process.env.SESSION,
    url: baseURL,
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
  },
  {
    name: "csrftoken",
    value: process.env.CSRF,
    url: baseURL,
    httpOnly: false,
    secure: true,
    sameSite: "Lax",
  },
];

export async function openBrave(problemSlug) {
  const problemURL = `${baseURL}/problems/${problemSlug}/`;

  const browser = await puppeteer.launch({
    headless: false,
    executablePath: bravePath,
    args: [
      "--kiosk",
      "--no-first-run",
      "--disable-extensions",
      "--disable-infobars",
      "--disable-session-crashed-bubble",
      "--disable-features=TranslateUI",
    ],
    defaultViewport: null,
  });

  const [page] = await browser.pages();

  // Allow all LeetCode & assets requests
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    try {
      const { hostname } = new URL(req.url());
      const allowed =
        hostname === "leetcode.com" ||
        hostname.endsWith(".leetcode.com") ||
        hostname === "assets.leetcode.com";
      allowed ? req.continue() : req.abort();
    } catch {
      req.abort();
    }
  });

  // Inject cookies before navigating
  await page.setCookie(...sessionCookies);

  // Go to the problem
  await page.goto(problemURL, { waitUntil: "domcontentloaded" });

  // Lock shortcuts and right-click
  await page.evaluate(() => {
    const block = (e) => {
      const k = (e.key || "").toLowerCase();
      if (e.ctrlKey || e.metaKey) {
        if (["t", "n", "w", "r", "i", "o", "p", "s"].includes(k)) e.preventDefault();
      }
      if (e.key === "F12") e.preventDefault();
    };
    document.addEventListener("keydown", block, true);
    document.addEventListener("contextmenu", (e) => e.preventDefault(), true);
  });

  // Soft exit with Ctrl+Q
  await page.exposeFunction("softExit", () => process.exit(0));
  await page.evaluate(() => {
    document.addEventListener(
      "keydown",
      (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key || "").toLowerCase() === "q") {
          // @ts-ignore
          window.softExit();
        }
      },
      true
    );
  });

  console.log(`✅ Brave opened and locked on: ${problemURL}`);
  console.log("Press Ctrl+Q (soft exit) or Ctrl+C in terminal to quit.");
}

// Example usage:
openBrave("two-sum");
// openBrave("add-two-numbers");

