#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { kebabCase } from "change-case";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const issuesDir = path.join(projectRoot, ".issues");
const templateFile = path.join(issuesDir, "template.md");

interface RenderContext {
  slug: string;
  title: string;
  date: string;
}

function getHighestSlug(dir: string): number {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    return 0;
  }

  const files = fs.readdirSync(dir);
  let maxSlug = 0;

  for (const file of files) {
    const match = file.match(/^(\d+)-.*\.md$/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (!Number.isNaN(num) && num > maxSlug) {
        maxSlug = num;
      }
    }
  }

  return maxSlug;
}

function promptDialogWindows(
  promptText: string,
  dialogTitle: string,
): string | null {
  if (process.platform !== "win32") return null;

  const escapedPrompt = promptText.replace(/'/g, "''");
  const escapedTitle = dialogTitle.replace(/'/g, "''");
  const psCommand = `Add-Type -AssemblyName Microsoft.VisualBasic; [Microsoft.VisualBasic.Interaction]::InputBox('${escapedPrompt}', '${escapedTitle}', '')`;

  try {
    const result = execFileSync(
      "powershell",
      ["-NoProfile", "-Command", psCommand],
      { encoding: "utf8", stdio: ["inherit", "pipe", "ignore"] },
    );
    return result.trim();
  } catch {
    return null;
  }
}

async function getTitle(): Promise<string> {
  // 1. Check CLI arguments (excluding flags like --cli)
  const args = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
  if (args.length > 0) {
    const cliTitle = args.join(" ").trim();
    if (cliTitle) return cliTitle;
  }

  // 2. Open GUI dialog on Windows unless --cli is specified
  const isCliOnly = process.argv.includes("--cli");
  if (process.platform === "win32" && !isCliOnly) {
    const dialogResult = promptDialogWindows("Enter issue title:", "New Issue");
    if (dialogResult !== null) {
      return dialogResult;
    }
  }

  // 3. Fallback to terminal readline
  if (input.isTTY) {
    const rl = readline.createInterface({ input, output });
    try {
      const answer = await rl.question("Enter issue title: ");
      return answer.trim();
    } finally {
      rl.close();
    }
  }

  return "";
}

function getLocalDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function renderContent(
  template: string,
  { slug, title, date }: RenderContext,
): string {
  const slugTitle = `${slug} - ${title}`;

  const replacements: Record<string, string> = {
    id: slug,
    slug: slug,
    title: title,
    date: date,
    slug_and_title: slugTitle,
    slug_title: slugTitle,
  };

  const placeholderRegex = /\{\s*\{\s*([a-zA-Z0-9_-]+)\s*\}\s*\}/gi;
  let hasPlaceholders = false;

  let content = template.replace(placeholderRegex, (match, rawKey: string) => {
    const key = rawKey.toLowerCase().replace(/-/g, "_");
    if (key in replacements) {
      hasPlaceholders = true;
      return replacements[key];
    }
    return match;
  });

  if (hasPlaceholders) {
    return content;
  }

  // If no placeholders, handle frontmatter or prepend
  if (content.startsWith("---")) {
    const endFmIndex = content.indexOf("\n---", 3);
    if (endFmIndex !== -1) {
      const frontmatter = content.slice(0, endFmIndex + 4);
      const rest = content.slice(endFmIndex + 4).trimStart();
      let updatedFm = frontmatter;
      if (!/^id:/m.test(updatedFm)) {
        updatedFm = updatedFm.replace(/^---\r?\n/, `---\nid: ${slug}\n`);
      }
      if (!/^title:/m.test(updatedFm)) {
        updatedFm = updatedFm.replace(
          /^---\r?\n/,
          `---\ntitle: "${title.replace(/"/g, '\\"')}"\n`,
        );
      }
      if (!/^created:/m.test(updatedFm)) {
        updatedFm = updatedFm.replace(/^---\r?\n/, `---\ncreated: ${date}\n`);
      }
      return `${updatedFm}\n\n# ${slugTitle}\n\n${rest}`;
    }
  }

  return `# ${slugTitle}\n\n${template}`;
}

async function main(): Promise<void> {
  if (!fs.existsSync(issuesDir)) {
    fs.mkdirSync(issuesDir, { recursive: true });
  }

  const title = await getTitle();
  if (!title) {
    console.log("No issue title provided. Creation cancelled.");
    return;
  }

  const highestSlug = getHighestSlug(issuesDir);
  const nextNum = highestSlug + 1;
  const slug = String(nextNum).padStart(3, "0");

  const slugPlusTitle = `${slug} ${title}`;
  const first25 = slugPlusTitle.slice(0, 25);
  const kebab = kebabCase(first25).slice(0, 25).replace(/-+$/, "");
  let filename = `${kebab}.md`;
  let filePath = path.join(issuesDir, filename);

  // Guard against rare collision
  let counter = 1;
  while (fs.existsSync(filePath)) {
    filename = `${kebab}-${counter}.md`;
    filePath = path.join(issuesDir, filename);
    counter++;
  }

  let template = "";
  if (fs.existsSync(templateFile)) {
    template = fs.readFileSync(templateFile, "utf8");
  } else {
    template = `---
id: {{ID}}
title: {{TITLE}}
status: open # open | in-progress | closed
priority: medium # low | medium | high
assignee:
labels: []
created: {{DATE}}
---

# {{SLUG}} - {{TITLE}}

## Description


## Acceptance Criteria
- [ ]
`;
    fs.writeFileSync(templateFile, template, "utf8");
  }

  const content = renderContent(template, {
    slug,
    title,
    date: getLocalDateString(),
  });

  fs.writeFileSync(filePath, content, "utf8");
  console.log(`Created issue #${slug}: .issues/${filename}`);
  console.log(`Path: ${filePath}`);
}

main().catch((err) => {
  console.error("Error creating issue:", err);
  process.exit(1);
});
