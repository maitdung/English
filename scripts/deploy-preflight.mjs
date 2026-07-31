import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();

const files = [
  {
    source: ".env.production.example",
    target: ".env.production",
  },
  {
    source: path.join("server", ".env.production.example"),
    target: path.join("server", ".env.production"),
  },
];

function ensureFileFromExample(source, target) {
  const sourcePath = path.join(rootDir, source);
  const targetPath = path.join(rootDir, target);

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing example file: ${source}`);
  }

  if (!fs.existsSync(targetPath)) {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`Created ${target} from ${source}`);
    return;
  }

  console.log(`Exists: ${target}`);
}

function checkRequiredPairs(filePath, requiredKeys) {
  const absolutePath = path.join(rootDir, filePath);
  const content = fs.readFileSync(absolutePath, "utf8");
  const missing = [];

  for (const key of requiredKeys) {
    const regex = new RegExp(`^${key}=([^\\n]*)`, "m");
    const match = content.match(regex);

    if (!match) {
      missing.push(key);
      continue;
    }

    const value = match[1].trim();
    if (
      !value ||
      value.includes("replace-with") ||
      value.includes("your-domain") ||
      value.includes("USERNAME:PASSWORD@HOST") ||
      value.includes("localhost:3001/api")
    ) {
      missing.push(key);
    }
  }

  return missing;
}

for (const file of files) {
  ensureFileFromExample(file.source, file.target);
}

const frontendMissing = checkRequiredPairs(".env.production", ["VITE_API_URL"]);
const serverMissing = checkRequiredPairs("server/.env.production", [
  "DATABASE_URL",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "FRONTEND_URL",
]);

const problems = [
  ...(frontendMissing.length > 0
    ? [`Frontend env missing or placeholder: ${frontendMissing.join(", ")}`]
    : []),
  ...(serverMissing.length > 0
    ? [`Server env missing or placeholder: ${serverMissing.join(", ")}`]
    : []),
];

if (problems.length > 0) {
  console.log("\nPreflight warnings:");
  for (const problem of problems) {
    console.log(`- ${problem}`);
  }
  console.log(
    "\nEdit the production env files, then run npm run deploy:check again.",
  );
  process.exitCode = 1;
} else {
  console.log("\nPreflight OK: production env files look ready.");
}
