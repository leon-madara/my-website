import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const BASE_URL = process.env.BASE_URL ?? "http://127.0.0.1:5173";
const TARGET_PATH = process.env.TARGET_PATH ?? "/contact";
const TARGET_URL = new URL(TARGET_PATH, BASE_URL).toString();

const OUT_DIR = process.env.OUT_DIR
  ? path.resolve(process.env.OUT_DIR)
  : path.resolve("output/playwright/contact");

const executableCandidates = [
  process.env.CHROMIUM_EXECUTABLE,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe"
].filter(Boolean);

function pickExecutablePath() {
  for (const candidate of executableCandidates) {
    if (candidate && fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return undefined;
}

async function captureSection(page, selector, outPath) {
  const locator = page.locator(selector);
  if (!(await locator.count())) {
    return;
  }
  await locator.first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(150);
  await locator.first().screenshot({ path: outPath });
}

async function runScenario({ name, viewport, contextOptions = {} }) {
  const executablePath = pickExecutablePath();
  const browser = await chromium.launch({ headless: true, executablePath });
  const context = await browser.newContext({ viewport, ...contextOptions });
  const page = await context.newPage();

  await page.goto(TARGET_URL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(900);

  const prefix = path.join(OUT_DIR, name);
  await page.screenshot({ path: `${prefix}.full.png`, fullPage: true });
  await captureSection(page, "#hero", `${prefix}.hero.png`);
  await captureSection(page, "#contact-cards", `${prefix}.cards.png`);
  await captureSection(page, "#contact-form", `${prefix}.form.png`);
  await captureSection(page, "#location", `${prefix}.location.png`);
  await captureSection(page, "#faq", `${prefix}.faq.png`);

  await context.close();
  await browser.close();
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log("Target:", TARGET_URL);
  console.log("Output:", OUT_DIR);

  await runScenario({
    name: "desktop-1600",
    viewport: { width: 1600, height: 900 }
  });
  await runScenario({
    name: "tablet-1024",
    viewport: { width: 1024, height: 800 }
  });
  await runScenario({
    name: "mobile-390",
    viewport: { width: 390, height: 844 }
  });
  await runScenario({
    name: "reduced-motion-1600",
    viewport: { width: 1600, height: 900 },
    contextOptions: { reducedMotion: "reduce" }
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

