#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = process.cwd();
const DEFAULT_ENV_FILE = path.join(ROOT, "apps", "api", ".env");
const DEFAULT_IMPORT_CSV = path.join(ROOT, "docs", "stage-3-build", "jira-AAA-import.csv");
const DEFAULT_KEY_MAP = path.join(ROOT, "docs", "stage-3-build", "jira-key-map.json");

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith("--")) {
        args[key] = true;
      } else {
        args[key] = next;
        i += 1;
      }
    }
  }
  return args;
}

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

function getCfg() {
  const baseUrl = process.env.JIRA_BASE_URL;
  const email = process.env.JIRA_EMAIL;
  const token = process.env.JIRA_API_TOKEN;
  const project = process.env.JIRA_PROJECT_KEY;
  if (!baseUrl || !email || !token || !project) {
    throw new Error(
      "Missing Jira env vars. Required: JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN, JIRA_PROJECT_KEY"
    );
  }
  return { baseUrl, email, token, project };
}

function authHeader(email, token) {
  return `Basic ${Buffer.from(`${email}:${token}`).toString("base64")}`;
}

async function jiraFetch(cfg, endpoint, opts = {}) {
  const res = await fetch(`${cfg.baseUrl}${endpoint}`, {
    ...opts,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: authHeader(cfg.email, cfg.token),
      ...(opts.headers || {})
    }
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    throw new Error(`Jira API ${res.status} ${res.statusText}: ${JSON.stringify(data)}`);
  }
  return data;
}

function extractIssues(data) {
  if (!data) return [];
  if (Array.isArray(data.issues)) return data.issues;
  if (Array.isArray(data.values)) return data.values;
  return [];
}

function parseCsv(filePath) {
  const raw = fs.readFileSync(filePath, "utf8").trim();
  const lines = raw.split(/\r?\n/);
  const headers = splitCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const vals = splitCsvLine(line);
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = vals[i] ?? "";
    });
    return obj;
  });
}

function splitCsvLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}

async function searchIssues(cfg, jql, maxResults = 50) {
  try {
    const legacyPost = await jiraFetch(cfg, `/rest/api/3/search`, {
      method: "POST",
      body: JSON.stringify({
        jql,
        maxResults,
        startAt: 0,
        fields: ["summary"]
      })
    });
    const issues = extractIssues(legacyPost);
    if (issues.length > 0) return legacyPost;
  } catch {
    // Fall back to newer endpoints.
  }

  try {
    const postData = await jiraFetch(cfg, `/rest/api/3/search/jql`, {
      method: "POST",
      body: JSON.stringify({
        jql,
        maxResults,
        fields: ["summary"]
      })
    });
    const issues = extractIssues(postData);
    if (issues.length > 0) return postData;
  } catch {
    // Try GET style fallback below.
  }

  return jiraFetch(
    cfg,
    `/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}&maxResults=${maxResults}&fields=summary`,
    { method: "GET" }
  );
}

async function fetchBoardIssues(cfg, boardId, maxResults = 500) {
  let startAt = 0;
  const all = [];
  while (all.length < maxResults) {
    const pageSize = Math.min(100, maxResults - all.length);
    const data = await jiraFetch(
      cfg,
      `/rest/agile/1.0/board/${boardId}/issue?startAt=${startAt}&maxResults=${pageSize}&fields=summary`,
      { method: "GET" }
    );
    const issues = Array.isArray(data.issues) ? data.issues : [];
    all.push(...issues);
    if (issues.length === 0 || data.isLast) break;
    startAt += issues.length;
  }
  return all;
}

async function findIssueBySummary(cfg, project, summary) {
  const escaped = summary.replace(/"/g, '\\"');
  const queries = [
    `project = ${project} AND summary ~ "\\"${escaped}\\"" ORDER BY created DESC`,
    `project = ${project} AND summary ~ "${escaped}" ORDER BY created DESC`,
    `summary ~ "\\"${escaped}\\"" ORDER BY created DESC`,
    `summary ~ "${escaped}" ORDER BY created DESC`
  ];

  for (const jql of queries) {
    const data = await searchIssues(cfg, jql, 50);
    const issues = extractIssues(data);
    const exact = issues.find((i) => i.fields?.summary === summary);
    if (exact) return exact;
    if (issues.length > 0) return issues[0];
  }

  return null;
}

function commitMessages(fromRef, toRef) {
  const hasFrom = hasGitRef(fromRef);
  const hasTo = hasGitRef(toRef);
  if (!hasTo) {
    throw new Error(`Invalid git ref for --to: ${toRef}`);
  }

  // For repos with a single commit, HEAD~1 doesn't exist. Fall back to just --to commit.
  const cmd = hasFrom
    ? `git log --pretty=format:%s ${fromRef}..${toRef}`
    : `git log --pretty=format:%s -1 ${toRef}`;
  const out = execSync(cmd, { encoding: "utf8" });
  return out.split(/\r?\n/).filter(Boolean);
}

function hasGitRef(ref) {
  try {
    execSync(`git rev-parse --verify ${ref}^{commit}`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function extractKeysFromText(text) {
  const jiraKeys = new Set(
    (text.match(/\b[A-Z][A-Z0-9]+-\d+\b/g) || []).filter((k) => !/^TKT-\d+$/.test(k))
  );
  const ticketIds = new Set(text.match(/\bTKT-\d+\b/g) || []);
  return { jiraKeys, ticketIds };
}

async function getTransitionId(cfg, issueKey, transitionName) {
  const data = await jiraFetch(cfg, `/rest/api/3/issue/${issueKey}/transitions`);
  const transition = (data.transitions || []).find(
    (t) => (t.name || "").toLowerCase() === transitionName.toLowerCase()
  );
  if (!transition) {
    const names = (data.transitions || []).map((t) => t.name).join(", ");
    throw new Error(`Transition '${transitionName}' not found for ${issueKey}. Available: ${names}`);
  }
  return transition.id;
}

async function transitionIssue(cfg, issueKey, transitionId) {
  await jiraFetch(cfg, `/rest/api/3/issue/${issueKey}/transitions`, {
    method: "POST",
    body: JSON.stringify({ transition: { id: transitionId } })
  });
}

async function addComment(cfg, issueKey, bodyText) {
  await jiraFetch(cfg, `/rest/api/3/issue/${issueKey}/comment`, {
    method: "POST",
    body: JSON.stringify({
      body: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: bodyText }]
          }
        ]
      }
    })
  });
}

async function bootstrapMap(cfg, importCsvPath, outputMapPath) {
  const rows = parseCsv(importCsvPath);
  const candidates = rows
    .filter((r) => r["Original Ticket ID"] && r["Issue Type"] !== "Epic")
    .map((r) => ({ originalId: r["Original Ticket ID"], summary: r["Summary"] }));

  const boardId = process.env.JIRA_BOARD_ID;
  let boardIssues = [];
  if (boardId) {
    try {
      boardIssues = await fetchBoardIssues(cfg, boardId, 1000);
      console.log(`board fallback loaded: ${boardIssues.length} issues from board ${boardId}`);
    } catch (err) {
      console.log(`board fallback unavailable: ${err.message}`);
    }
  }

  const map = {};
  let mappedCount = 0;
  for (const c of candidates) {
    let found = await findIssueBySummary(cfg, cfg.project, c.summary);
    if (!found && boardIssues.length > 0) {
      found = boardIssues.find((i) => i.fields?.summary === c.summary) || null;
    }
    if (found?.key) {
      map[c.originalId] = found.key;
      console.log(`mapped ${c.originalId} -> ${found.key}`);
      mappedCount += 1;
    } else {
      console.log(`no match for ${c.originalId} (${c.summary})`);
    }
  }

  fs.writeFileSync(outputMapPath, JSON.stringify(map, null, 2) + "\n", "utf8");
  console.log(`mapped ${mappedCount}/${candidates.length} ticket IDs`);
  console.log(`wrote key map: ${outputMapPath}`);
}

async function syncFromCommits(cfg, args) {
  const fromRef = args.from || "HEAD~1";
  const toRef = args.to || "HEAD";
  const transitionName = args.transition || "Done";
  const addCommitComment = args["comment"] !== "false";
  const keyMapPath = args["key-map"] || DEFAULT_KEY_MAP;

  const msgs = commitMessages(fromRef, toRef);
  const allText = msgs.join("\n");
  const extracted = extractKeysFromText(allText);

  let issueKeys = new Set(extracted.jiraKeys);
  if (fs.existsSync(keyMapPath)) {
    const keyMap = JSON.parse(fs.readFileSync(keyMapPath, "utf8"));
    for (const tkt of extracted.ticketIds) {
      if (keyMap[tkt]) issueKeys.add(keyMap[tkt]);
    }
  }

  if (issueKeys.size === 0) {
    console.log("No issue keys found in commit range.");
    return;
  }

  const keys = Array.from(issueKeys);
  console.log(`resolved issue keys: ${keys.join(", ")}`);

  let transitioned = 0;
  for (const issueKey of keys) {
    try {
      const transitionId = await getTransitionId(cfg, issueKey, transitionName);
      await transitionIssue(cfg, issueKey, transitionId);
      console.log(`transitioned ${issueKey} -> ${transitionName}`);
      transitioned += 1;
      if (addCommitComment) {
        const body = `Auto-sync update from git commits ${fromRef}..${toRef}.`;
        try {
          await addComment(cfg, issueKey, body);
          console.log(`commented on ${issueKey}`);
        } catch (err) {
          console.log(`comment failed ${issueKey}: ${err.message}`);
        }
      }
    } catch (err) {
      console.log(`failed ${issueKey}: ${err.message}`);
    }
  }

  console.log(`sync complete: transitioned ${transitioned}/${keys.length} issues`);
}

async function debugProject(cfg, args) {
  const jql = args.jql || `project = ${cfg.project} ORDER BY created DESC`;
  const maxResults = Number(args.max || 20);
  const data = await searchIssues(cfg, jql, maxResults);
  const issues = extractIssues(data);
  console.log(`project=${cfg.project} jql="${jql}" total_returned=${issues.length}`);
  for (const i of issues) {
    console.log(`${i.key} | ${i.fields?.summary || ""}`);
  }
}

async function debugAccess(cfg, args) {
  const me = await jiraFetch(cfg, `/rest/api/3/myself`);
  console.log(`authenticated_as=${me.accountId} email=${me.emailAddress || "<hidden>"} display=${me.displayName}`);

  const projects = await jiraFetch(cfg, `/rest/api/3/project/search?maxResults=100`);
  const values = projects.values || [];
  console.log(`visible_projects=${values.length}`);
  for (const p of values.slice(0, 20)) {
    console.log(`project ${p.key} | ${p.name}`);
  }

  const issueKey = args["issue-key"];
  if (issueKey) {
    try {
      const issue = await jiraFetch(cfg, `/rest/api/3/issue/${issueKey}?fields=summary,status,project`);
      console.log(
        `issue_lookup_ok ${issue.key} | ${issue.fields?.project?.key} | ${issue.fields?.status?.name} | ${issue.fields?.summary}`
      );
    } catch (err) {
      console.log(`issue_lookup_failed ${issueKey} -> ${err.message}`);
    }
  }
}

async function main() {
  const args = parseArgs(process.argv);
  const mode = args.mode || "sync";
  const envFile = args["env-file"] || DEFAULT_ENV_FILE;

  loadDotEnv(envFile);
  const cfg = getCfg();

  if (mode === "bootstrap-map") {
    const importCsv = args["import-csv"] || DEFAULT_IMPORT_CSV;
    const out = args.out || DEFAULT_KEY_MAP;
    await bootstrapMap(cfg, importCsv, out);
    return;
  }

  if (mode === "sync") {
    await syncFromCommits(cfg, args);
    return;
  }

  if (mode === "debug-project") {
    await debugProject(cfg, args);
    return;
  }

  if (mode === "debug-access") {
    await debugAccess(cfg, args);
    return;
  }

  throw new Error(
    `Unknown mode: ${mode}. Use --mode bootstrap-map, --mode sync, --mode debug-project, or --mode debug-access`
  );
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
