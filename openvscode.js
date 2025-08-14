import { getSnippet } from './getSnippet.js'
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import * as os from 'os';

export async function openvscode(file_name, lang) {
  let extension = null
  const snippet = await getSnippet(file_name, lang);
  switch (lang) {
    case 'python': extension = 'py'; break;
    case 'typescript': extension = 'ts'; break;
    default: console.log('langage not supported yet!!');
  }
  if (!file_name) {
    console.error("❌ Please provide a file name inside the function call.");
    process.exit(1);
  }

  const desktopPath = path.join(os.homedir(), "Desktop");
  const folderPath = path.join(desktopPath, "leetcodeProblems");
  const filePath = path.join(folderPath, `${file_name}.${extension}`);

  // Ensure folder exists
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`📁 Created folder: ${folderPath}`);
  }

  // Create the file if it doesn't exist
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, snippet);
    console.log(`📝 Created file: ${filePath}`);
  } else {
    console.log(`⚠ File already exists: ${filePath}`);
  }

  // Open the file in VS Code
  exec(`code -n "${filePath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error opening VS Code: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`🚀 VS Code opened with: ${filePath}`);
  });
}

// Call your function here
openvscode("two-sum", "typescript"); // change this name to whatever you want
