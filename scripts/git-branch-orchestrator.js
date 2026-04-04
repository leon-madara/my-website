#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..");
const registryPath = path.join(repoRoot, "docs", "git", "branch-registry.json");
const activePlansRoot = path.join(repoRoot, "docs", "exec-plans", "active");

function parseArgs(argv) {
  const args = {
    mode: "entry",
    json: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--json") {
      args.json = true;
      continue;
    }

    if (!token.startsWith("--")) {
      continue;
    }

    const key = token.slice(2);
    const value = argv[index + 1];

    if (!value || value.startsWith("--")) {
      args[key] = true;
      continue;
    }

    args[key] = value;
    index += 1;
  }

  return args;
}

function runGit(args, options = {}) {
  try {
    return execFileSync("git", ["-C", repoRoot, ...args], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"]
    }).trim();
  } catch (error) {
    if (options.allowFailure) {
      return null;
    }

    const stderr = error.stderr ? String(error.stderr).trim() : error.message;
    throw new Error(`git ${args.join(" ")} failed: ${stderr}`);
  }
}

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function loadRegistry() {
  if (!fs.existsSync(registryPath)) {
    throw new Error(`Missing branch registry: ${registryPath}`);
  }

  const registry = loadJson(registryPath);
  const branchMap = new Map();
  const featureMap = new Map();

  for (const entry of registry.branches || []) {
    branchMap.set(entry.branch, entry);
    if (entry.feature_slug) {
      featureMap.set(entry.feature_slug, entry);
    }
  }

  return { registry, branchMap, featureMap };
}

function loadFeatureContexts() {
  const contexts = [];

  if (!fs.existsSync(activePlansRoot)) {
    return contexts;
  }

  const featureDirs = fs.readdirSync(activePlansRoot, { withFileTypes: true });
  for (const featureDir of featureDirs) {
    if (!featureDir.isDirectory()) {
      continue;
    }

    const filePath = path.join(activePlansRoot, featureDir.name, "branch-context.json");
    if (!fs.existsSync(filePath)) {
      continue;
    }

    const context = loadJson(filePath);
    context.__file = filePath;
    contexts.push(context);
  }

  return contexts;
}

function getCurrentBranch() {
  return runGit(["rev-parse", "--abbrev-ref", "HEAD"]);
}

function getWorktreeFiles() {
  const output = runGit(["status", "--porcelain"], { allowFailure: true }) || "";
  if (!output) {
    return [];
  }

  return output
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => ({
      status: line.slice(0, 2),
      path: line.charAt(2) === " " ? line.slice(3) : line.slice(2)
    }));
}

function getUpstream(branch) {
  return runGit(["rev-parse", "--abbrev-ref", `${branch}@{upstream}`], {
    allowFailure: true
  });
}

function getAheadBehind(left, right) {
  const output = runGit(["rev-list", "--left-right", "--count", `${left}...${right}`], {
    allowFailure: true
  });

  if (!output) {
    return null;
  }

  const [leftOnly, rightOnly] = output.split(/\s+/).map((value) => Number(value));

  return {
    left_only: Number.isFinite(leftOnly) ? leftOnly : 0,
    right_only: Number.isFinite(rightOnly) ? rightOnly : 0
  };
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function inferFeatureFromTask(task, registryBranches) {
  const normalizedTask = normalizeText(task);
  if (!normalizedTask) {
    return { matches: [] };
  }

  const scored = [];

  for (const entry of registryBranches) {
    const phrases = []
      .concat(entry.scope_hint || [])
      .concat(entry.feature_slug || [])
      .concat(entry.branch || []);

    let score = 0;
    for (const phrase of phrases) {
      const normalizedPhrase = normalizeText(phrase);
      if (!normalizedPhrase) {
        continue;
      }

      if (normalizedTask.includes(normalizedPhrase)) {
        score += Math.max(2, normalizedPhrase.split(" ").length);
      } else {
        const words = normalizedPhrase.split(" ").filter(Boolean);
        const partialHits = words.filter((word) => word.length > 2 && normalizedTask.includes(word)).length;
        score += partialHits;
      }
    }

    if (score > 0) {
      scored.push({ entry, score });
    }
  }

  scored.sort((left, right) => right.score - left.score || left.entry.branch.localeCompare(right.entry.branch));

  return {
    matches: scored
  };
}

function buildContextMap(contexts) {
  const byBranch = new Map();
  const byFeature = new Map();

  for (const context of contexts) {
    if (context.branch) {
      byBranch.set(context.branch, context);
    }
    if (context.feature_slug) {
      byFeature.set(context.feature_slug, context);
    }
  }

  return { byBranch, byFeature };
}

function compareRegistryToContexts(registryBranches, contextMap) {
  const issues = [];

  for (const entry of registryBranches) {
    const context = contextMap.byBranch.get(entry.branch);
    if (!context) {
      continue;
    }

    if (context.parent_branch !== entry.parent_branch) {
      issues.push({
        branch: entry.branch,
        type: "parent_branch_mismatch",
        registry: entry.parent_branch,
        context: context.parent_branch
      });
    }

    if (context.default_promotion_target !== entry.default_promotion_target) {
      issues.push({
        branch: entry.branch,
        type: "promotion_target_mismatch",
        registry: entry.default_promotion_target,
        context: context.default_promotion_target
      });
    }
  }

  return issues;
}

function findManagedEntry(args, currentBranch, registryState, inferred) {
  if (args.branch && registryState.branchMap.has(args.branch)) {
    return { entry: registryState.branchMap.get(args.branch), reason: `explicit branch ${args.branch}` };
  }

  if (args.feature && registryState.featureMap.has(args.feature)) {
    return { entry: registryState.featureMap.get(args.feature), reason: `explicit feature ${args.feature}` };
  }

  if (inferred.matches.length === 1) {
    return { entry: inferred.matches[0].entry, reason: `task matched ${inferred.matches[0].entry.feature_slug}` };
  }

  if (inferred.matches.length > 1 && inferred.matches[0].score > inferred.matches[1].score) {
    return { entry: inferred.matches[0].entry, reason: `task best matched ${inferred.matches[0].entry.feature_slug}` };
  }

  if (!args.task && registryState.branchMap.has(currentBranch)) {
    return { entry: registryState.branchMap.get(currentBranch), reason: `current branch ${currentBranch} is managed` };
  }

  return null;
}

function buildEntryResult(args, currentBranch, worktreeFiles, registryState, contextMap) {
  const inferred = inferFeatureFromTask(args.task, registryState.registry.branches || []);
  const mismatchIssues = compareRegistryToContexts(registryState.registry.branches || [], contextMap);

  if (mismatchIssues.length > 0) {
    return {
      status: "refuse",
      reason: "Registry and feature context metadata disagree",
      conflicts: mismatchIssues,
      requires_approval: false
    };
  }

  if (inferred.matches.length > 1 && inferred.matches[0].score === inferred.matches[1].score) {
    return {
      status: "refuse",
      reason: "Task maps equally well to multiple managed branches",
      candidates: inferred.matches.slice(0, 5).map((match) => ({
        branch: match.entry.branch,
        feature_slug: match.entry.feature_slug,
        score: match.score
      })),
      requires_approval: false
    };
  }

  const managed = findManagedEntry(args, currentBranch, registryState, inferred);
  if (!managed) {
    return {
      status: "refuse",
      reason: "No managed branch match found for the requested work",
      requires_approval: false
    };
  }

  const entry = managed.entry;
  const siblings = (registryState.registry.branches || [])
    .filter((candidate) => candidate.parent_branch === entry.parent_branch && candidate.branch !== entry.branch)
    .map((candidate) => candidate.branch);

  if (entry.branch !== currentBranch && worktreeFiles.length > 0) {
    return {
      status: "refuse",
      action: "switch",
      target_branch: entry.branch,
      reason: "Worktree is dirty, so switching branches would mix unrelated changes",
      worktree_files: worktreeFiles,
      blocked_branches: siblings,
      requires_approval: false
    };
  }

  return {
    status: "allow",
    action: entry.branch === currentBranch ? "stay" : "switch",
    current_branch: currentBranch,
    target_branch: entry.branch,
    feature_slug: entry.feature_slug,
    parent_branch: entry.parent_branch,
    default_promotion_target: entry.default_promotion_target,
    reason: managed.reason,
    blocked_branches: siblings,
    requires_approval: entry.branch !== currentBranch,
    worktree_dirty: worktreeFiles.length > 0
  };
}

function buildExitResult(currentBranch, worktreeFiles, registryState, contextMap) {
  const mismatchIssues = compareRegistryToContexts(registryState.registry.branches || [], contextMap);
  if (mismatchIssues.length > 0) {
    return {
      status: "refuse",
      reason: "Registry and feature context metadata disagree",
      conflicts: mismatchIssues,
      requires_approval: false
    };
  }

  const entry = registryState.branchMap.get(currentBranch);
  if (!entry) {
    return {
      status: "refuse",
      reason: `Current branch ${currentBranch} is not in the managed branch registry`,
      requires_approval: false
    };
  }

  const upstreamBranch = getUpstream(currentBranch);
  const upstreamDivergence = upstreamBranch
    ? getAheadBehind(upstreamBranch, currentBranch)
    : null;
  const parentBranch = entry.default_promotion_target || entry.parent_branch;
  const parentDivergence = parentBranch ? getAheadBehind(parentBranch, currentBranch) : null;
  const siblings = (registryState.registry.branches || [])
    .filter((candidate) => candidate.parent_branch === entry.parent_branch && candidate.branch !== entry.branch)
    .map((candidate) => candidate.branch);

  const recommendations = [];
  if (upstreamBranch) {
    recommendations.push({
      type: "push",
      target: upstreamBranch,
      reason: "Keep the remote branch aligned before integration",
      requires_approval: true
    });
  } else {
    recommendations.push({
      type: "push",
      target: `origin/${currentBranch}`,
      reason: "Create or update the matching remote branch before integration",
      requires_approval: true
    });
  }

  if (parentBranch) {
    recommendations.push({
      type: "merge",
      target: parentBranch,
      reason: "Default promotion target is the parent branch",
      requires_approval: true
    });
  }

  if (worktreeFiles.length > 0) {
    return {
      status: "refuse",
      reason: "Worktree is dirty; review, commit, or stash changes before promotion",
      current_branch: currentBranch,
      worktree_files: worktreeFiles,
      blocked_branches: siblings,
      requires_approval: false
    };
  }

  return {
    status: "allow",
    action: "review-promotion",
    current_branch: currentBranch,
    feature_slug: entry.feature_slug,
    parent_branch: entry.parent_branch,
    default_promotion_target: parentBranch,
    blocked_branches: siblings,
    upstream: upstreamBranch
      ? {
          branch: upstreamBranch,
          divergence: upstreamDivergence
        }
      : null,
    parent_divergence: parentDivergence,
    recommended_sequence: recommendations,
    requires_approval: true
  };
}

function renderHumanReadable(result, mode) {
  if (mode === "entry") {
    if (result.status === "allow") {
      const lines = [
        `Mode: entry`,
        `Status: allow`,
        `Action: ${result.action}`,
        `Current branch: ${result.current_branch}`,
        `Target branch: ${result.target_branch}`,
        `Feature: ${result.feature_slug}`,
        `Parent branch: ${result.parent_branch || "none"}`,
        `Default promotion target: ${result.default_promotion_target || "none"}`,
        `Reason: ${result.reason}`,
        `Approval required: ${result.requires_approval ? "yes" : "no"}`
      ];

      if (result.blocked_branches && result.blocked_branches.length > 0) {
        lines.push(`Blocked sibling branches: ${result.blocked_branches.join(", ")}`);
      }

      return lines.join("\n");
    }

    return [
      `Mode: entry`,
      `Status: refuse`,
      `Reason: ${result.reason}`
    ].join("\n");
  }

  if (result.status === "allow") {
    const lines = [
      `Mode: exit`,
      `Status: allow`,
      `Action: ${result.action}`,
      `Current branch: ${result.current_branch}`,
      `Feature: ${result.feature_slug}`,
      `Parent branch: ${result.parent_branch || "none"}`,
      `Default promotion target: ${result.default_promotion_target || "none"}`,
      `Approval required: ${result.requires_approval ? "yes" : "no"}`
    ];

    if (result.recommended_sequence) {
      lines.push("Recommended sequence:");
      for (const recommendation of result.recommended_sequence) {
        lines.push(`- ${recommendation.type} -> ${recommendation.target} (${recommendation.reason})`);
      }
    }

    if (result.blocked_branches && result.blocked_branches.length > 0) {
      lines.push(`Blocked sibling branches: ${result.blocked_branches.join(", ")}`);
    }

    return lines.join("\n");
  }

  return [
    `Mode: exit`,
    `Status: refuse`,
    `Reason: ${result.reason}`
  ].join("\n");
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const mode = args.mode === "exit" ? "exit" : "entry";
  const registryState = loadRegistry();
  const contexts = loadFeatureContexts();
  const contextMap = buildContextMap(contexts);
  const currentBranch = getCurrentBranch();
  const worktreeFiles = getWorktreeFiles();

  const result = mode === "exit"
    ? buildExitResult(currentBranch, worktreeFiles, registryState, contextMap)
    : buildEntryResult(args, currentBranch, worktreeFiles, registryState, contextMap);

  const payload = {
    mode,
    timestamp: new Date().toISOString(),
    current_branch: currentBranch,
    registry_path: registryPath,
    result
  };

  if (args.json) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  console.log(renderHumanReadable(result, mode));
}

main();
