import { createHash } from "node:crypto";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const UPSTREAM_COMMIT = "d4e45b75b38f27b30dfc5c44d8c571aec7e7092f";
const UPSTREAM_RAW_ROOT = `https://raw.githubusercontent.com/openlanguageprofiles/olp-en-cefrj/${UPSTREAM_COMMIT}`;

const profiles = [
  {
    filename: "cefrj-vocabulary-profile-1.5.csv",
    header: "headword,pos,CEFR,CoreInventory 1,CoreInventory 2,Threshold",
    rowCount: 7_799,
    levelColumn: "CEFR",
    levelCounts: { A1: 1_164, A2: 1_411, B1: 2_446, B2: 2_778 },
    unlabeledCount: 0,
    sha256: "b0dd3c635f1c9a4fdf1490c7e5b7c48e8bbe55b652ad0c9860a95f98e10ae498",
  },
  {
    filename: "octanove-vocabulary-profile-c1c2-1.0.csv",
    header: "headword,pos,CEFR,notes",
    rowCount: 2_136,
    levelColumn: "CEFR",
    levelCounts: { C1: 1_111, C2: 1_025 },
    unlabeledCount: 0,
    sha256: "18c33a407f2f89f7b8de9671c6d45fe3ea0bce45e7d2d7dcaab48d73e0f7b380",
  },
  {
    filename: "cefrj-grammar-profile-20180315.csv",
    header:
      "ID,Shorthand Code,Grammatical Item,Sentence Type,CEFR-J Level,FREQ*DISP,Core Inventory,EGP,GSELO,Notes",
    rowCount: 500,
    levelColumn: "CEFR-J Level",
    levelCounts: { A1: 63, A2: 32, B1: 41, B2: 34 },
    unlabeledCount: 330,
    populatedColumnCounts: {
      "Core Inventory": 270,
      EGP: 469,
      GSELO: 215,
      Notes: 394,
    },
    sha256: "94953af376c1336166257e56c78d2139697b40ad8cf6f1235d8f9e89c2efc428",
  },
];

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const destinationDirectory = path.join(repositoryRoot, "public/data/cefrj");

function calculateSha256(content) {
  return createHash("sha256").update(content).digest("hex");
}

function parseCsv(csv) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];

    if (inQuotes) {
      if (character === '"' && csv[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        inQuotes = false;
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"') {
      inQuotes = true;
    } else if (character === ",") {
      row.push(field.trim());
      field = "";
    } else if (character === "\n") {
      row.push(field.trim());
      field = "";
      if (row.some(Boolean)) {
        rows.push(row);
      }
      row = [];
    } else if (character !== "\r") {
      field += character;
    }
  }

  if (field || row.length > 0) {
    row.push(field.trim());
    if (row.some(Boolean)) {
      rows.push(row);
    }
  }

  return rows;
}

function normalizeLevel(value) {
  return value.toUpperCase().match(/\b(A1|A2|B1|B2|C1|C2)\b/)?.[1] ?? null;
}

function validateProfileStatistics(profile, content) {
  const [headers = [], ...rows] = parseCsv(content.toString("utf8"));
  const levelColumnIndex = headers.indexOf(profile.levelColumn);

  if (levelColumnIndex < 0) {
    throw new Error(
      `${profile.filename}: missing level column "${profile.levelColumn}".`,
    );
  }

  const actualLevelCounts = {};
  let actualUnlabeledCount = 0;

  for (const row of rows) {
    const level = normalizeLevel(row[levelColumnIndex] ?? "");

    if (level) {
      actualLevelCounts[level] = (actualLevelCounts[level] ?? 0) + 1;
    } else {
      actualUnlabeledCount += 1;
    }
  }

  for (const [level, expectedCount] of Object.entries(profile.levelCounts)) {
    const actualCount = actualLevelCounts[level] ?? 0;
    if (actualCount !== expectedCount) {
      throw new Error(
        `${profile.filename}: expected ${expectedCount} ${level} rows, received ${actualCount}.`,
      );
    }
  }

  const unexpectedLevels = Object.keys(actualLevelCounts).filter(
    (level) => !(level in profile.levelCounts),
  );
  if (unexpectedLevels.length > 0) {
    throw new Error(
      `${profile.filename}: unexpected CEFR levels: ${unexpectedLevels.join(", ")}.`,
    );
  }

  if (actualUnlabeledCount !== profile.unlabeledCount) {
    throw new Error(
      `${profile.filename}: expected ${profile.unlabeledCount} unlabeled rows, received ${actualUnlabeledCount}.`,
    );
  }

  for (const [column, expectedCount] of Object.entries(
    profile.populatedColumnCounts ?? {},
  )) {
    const columnIndex = headers.indexOf(column);
    const actualCount = rows.filter((row) => row[columnIndex]?.trim()).length;

    if (columnIndex < 0 || actualCount !== expectedCount) {
      throw new Error(
        `${profile.filename}: expected ${expectedCount} populated "${column}" rows, received ${actualCount}.`,
      );
    }
  }
}

function validateProfile(profile, content) {
  const actualSha256 = calculateSha256(content);
  if (actualSha256 !== profile.sha256) {
    throw new Error(
      `${profile.filename}: SHA-256 mismatch. Expected ${profile.sha256}, received ${actualSha256}.`,
    );
  }

  const lines = content.toString("utf8").split(/\r?\n/);
  if (lines.at(-1) === "") {
    lines.pop();
  }

  const header = lines.shift();
  if (header !== profile.header) {
    throw new Error(
      `${profile.filename}: invalid CSV header. Expected "${profile.header}", received "${header ?? ""}".`,
    );
  }

  if (lines.length !== profile.rowCount) {
    throw new Error(
      `${profile.filename}: expected exactly ${profile.rowCount} data rows, received ${lines.length}.`,
    );
  }

  validateProfileStatistics(profile, content);
}

async function readVendoredProfile(profile) {
  const destinationPath = path.join(destinationDirectory, profile.filename);

  try {
    return await readFile(destinationPath);
  } catch (error) {
    if (error && typeof error === "object" && error.code === "ENOENT") {
      throw new Error(
        `${profile.filename}: vendored file is missing. Run this script without --check to download it.`,
      );
    }
    throw error;
  }
}

async function downloadProfile(profile) {
  const sourceUrl = `${UPSTREAM_RAW_ROOT}/${profile.filename}`;
  const response = await fetch(sourceUrl, {
    headers: { "User-Agent": "mtd-lingo-pro-cefrj-sync" },
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    throw new Error(
      `${profile.filename}: download failed with HTTP ${response.status} ${response.statusText}.`,
    );
  }

  const content = Buffer.from(await response.arrayBuffer());
  validateProfile(profile, content);
  return content;
}

async function checkProfiles() {
  for (const profile of profiles) {
    const content = await readVendoredProfile(profile);
    validateProfile(profile, content);
    console.log(
      `Verified ${profile.filename}: ${profile.rowCount.toLocaleString("en-US")} rows (${Object.entries(
        profile.levelCounts,
      )
        .map(([level, count]) => `${level} ${count.toLocaleString("en-US")}`)
        .join(
          ", ",
        )}; unlabeled ${profile.unlabeledCount.toLocaleString("en-US")}), SHA-256 ${profile.sha256}.`,
    );
  }
}

async function syncProfiles() {
  const downloadedProfiles = await Promise.all(
    profiles.map(async (profile) => ({
      content: await downloadProfile(profile),
      profile,
    })),
  );

  await mkdir(destinationDirectory, { recursive: true });
  const temporaryPaths = [];

  try {
    for (const { content, profile } of downloadedProfiles) {
      const destinationPath = path.join(destinationDirectory, profile.filename);
      const temporaryPath = `${destinationPath}.tmp-${process.pid}`;
      await writeFile(temporaryPath, content);
      temporaryPaths.push(temporaryPath);
    }

    for (const { profile } of downloadedProfiles) {
      const destinationPath = path.join(destinationDirectory, profile.filename);
      const temporaryPath = `${destinationPath}.tmp-${process.pid}`;
      await rename(temporaryPath, destinationPath);
    }
  } catch (error) {
    await Promise.all(
      temporaryPaths.map((temporaryPath) =>
        unlink(temporaryPath).catch(() => undefined),
      ),
    );
    throw error;
  }

  for (const { profile } of downloadedProfiles) {
    console.log(
      `Synced ${profile.filename}: ${profile.rowCount.toLocaleString("en-US")} rows.`,
    );
  }
  console.log(`Pinned upstream revision: ${UPSTREAM_COMMIT}`);
}

const argumentsList = process.argv.slice(2);
const isCheck = argumentsList.length === 1 && argumentsList[0] === "--check";

if (argumentsList.length > 1 || (argumentsList.length === 1 && !isCheck)) {
  console.error("Usage: node scripts/sync-cefrj-profiles.mjs [--check]");
  process.exitCode = 1;
} else {
  try {
    if (isCheck) {
      await checkProfiles();
    } else {
      await syncProfiles();
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
