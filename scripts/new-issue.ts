#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { kebabCase } from "change-case";

const issuesDir = path.resolve(".issues");
const templateFile = path.join(issuesDir, "template.md");

function getNextSlug(): string {
  const files = fs.existsSync(issuesDir) ? fs.readdirSync(issuesDir) : [];
  const slugs = files.map((f) => Number(f.match(/^(\d+)-/)?.[1]) || 0);
  return String(Math.max(0, ...slugs) + 1).padStart(3, "0");
}

async function getTitle(): Promise<string> {
  const arg = process.argv.slice(2).join(" ").trim();
  if (arg) return arg;

  const rl = readline.createInterface({ input, output });
  try {
    const answer = await rl.question("Enter issue title: ");
    return answer.trim();
  } finally {
    rl.close();
  }
}

function renderContent(slug: string, title: string): string {
  const date = new Date().toLocaleDateString("en-CA");

  return `---
id: ${slug}
title: ${title}
status: open # open | in-progress | closed
priority: medium # low | medium | high
assignee:
labels: []
created: ${date}
---

# ${slug} - ${title}
`;
}

async function main(): Promise<void> {
  const title = await getTitle();
  if (!title) {
    console.log("No issue title provided. Creation cancelled.");
    return;
  }

  fs.mkdirSync(issuesDir, { recursive: true });

  const slug = getNextSlug();
  const filename = `${kebabCase(`${slug} ${title}`.slice(0, 25))}.md`;
  const filePath = path.join(issuesDir, filename);
  const body = fs.readFileSync(templateFile, "utf8");
  const header = renderContent(slug, title);
  const template = `${header}\n${body}`;

  fs.writeFileSync(filePath, template, "utf8");
  console.log(`Created issue #${slug}: .issues/${filename}`);
}

main().catch((err) => {
  console.error("Error creating issue:", err);
  process.exit(1);
});
