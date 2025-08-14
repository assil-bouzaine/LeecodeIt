import { openBrave } from './openBrave.js';
import { openvscode } from './openvscode.js';
import { getRandomProblem } from './randomProblem.js';
import { renderProblemDescription } from './render.js';
import readline from "readline";
import { verifyCode } from "./verifyCode.js";
import { sendEmail } from './sendEmail.js'
// Setup readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

async function main() {
  console.clear();

  console.log("===========================================");
  console.log("       🚀 Welcome to the LeetCode CLI       ");
  console.log("===========================================\n");

  console.log("Please choose an option:\n");

  console.log("1- Request a verification code");
  console.log("2- Solve a LeetCode problem\n");

  console.log("Type 1 or 2 and press Enter to continue.\n");

  const choice = await ask("> ");

  if (choice === "1") {

    // Send email
    sendEmail();

    console.log("\nA verification code has been sent! Please enter it below.\n");

    // Loop until code is valid
    while (true) {
      const userCode = await ask("Enter code: ");
      if (verifyCode(Number(userCode))) {
        console.log("✅ Verification successful!");
        break;
      } else {
        console.log("❌ Verification failed. Try again.\n");
      }
    }
    rl.close();
  } else if (choice === "2") {
    console.log("🔥 Let's solve some problems! (Feature not implemented yet)");
    getRandomProblem()
      .then(problem => {
        console.log(renderProblemDescription(problem.content));
        openBrave(problem.titleSlug);
        openvscode(problem.titleSlug, 'python');
      })
      .catch(console.error)

  } else {
    console.log("❌ Invalid choice. Exiting.");
    rl.close();
  }
}

main();

