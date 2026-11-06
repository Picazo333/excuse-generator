import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import axe from "axe-core";
import puppeteer from "puppeteer-core";

const base = process.env.PREVIEW_URL || "http://127.0.0.1:4173";
const outDir = "/opt/cursor/artifacts/screenshots";
const videoPath = "/opt/cursor/artifacts/excuse-interaction.webm";
const reportPath = "/opt/cursor/artifacts/browser-report.json";

const chromePath = "/usr/bin/google-chrome";
const failures = [];

function fail(message) {
  failures.push(message);
  console.error("FAIL", message);
}

async function overflow(page) {
  return page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
}

async function shot(page, name, fullPage = true) {
  await page.screenshot({ path: `${outDir}/${name}.png`, fullPage });
}

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--force-device-scale-factor=1"],
});

await mkdir(outDir, { recursive: true });

const report = { base, checks: {} };

try {
  const page = await browser.newPage();
  const consoleErrors = [];
  const failedRequests = [];
  const httpErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(String(error)));
  page.on("requestfailed", (request) => {
    failedRequests.push(request.url() + " " + (request.failure()?.errorText || ""));
  });
  page.on("response", (response) => {
    if (response.status() >= 400) httpErrors.push(response.status() + " " + response.url());
  });

  async function openAt(width, height) {
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    const response = await page.goto(base + "/", { waitUntil: "networkidle0" });
    return response.status();
  }

  const homeStatus = await openAt(390, 844);
  report.checks.homeStatus = homeStatus;
  if (homeStatus !== 200) fail("home status " + homeStatus);

  const beforeClick = await page.$eval("#excuse", (el) => el.textContent);
  report.checks.excuseAfterLoad = beforeClick;
  if (beforeClick === "My dog ate my homework") fail("onload did not replace the hardcoded excuse");
  if (!/^(The dog|My grandma|The mailman|My bird) /.test(beforeClick)) fail("excuse does not start with a who-item: " + beforeClick);

  const box = await overflow(page);
  report.checks.overflow390 = box;
  if (box.scrollWidth > box.clientWidth + 1) fail("overflow at 390: " + JSON.stringify(box));

  const lockup390 = await page.$eval(".lockup-stacked", (el) => {
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return { width: rect.width, display: style.display, alt: el.alt };
  });
  const hiddenHorizontal = await page.$eval(".lockup-horizontal", (el) => getComputedStyle(el).display);
  report.checks.lockup390 = { stacked: lockup390, horizontalDisplay: hiddenHorizontal };
  if (lockup390.width < 280) fail("stacked lockup narrower than 280 at 390");
  if (hiddenHorizontal !== "none") fail("horizontal lockup still visible at 390");
  if (lockup390.alt !== "4Geeks por Divinivid") fail("lockup alt");

  await shot(page, "390");

  const motion = await page.evaluate(() => {
    const el = document.querySelector("#excuse");
    const style = getComputedStyle(el);
    return {
      dataset: document.documentElement.dataset.motion,
      animationName: style.animationName,
      reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    };
  });
  report.checks.motionDefault = motion;

  await page.click("#new-excuse");
  await new Promise((resolve) => setTimeout(resolve, 250));
  const afterClick = await page.$eval("#excuse", (el) => el.textContent);
  const status = await page.$eval("#status", (el) => el.textContent);
  report.checks.afterClick = { text: afterClick, status };
  if (!status.includes("new excuse")) fail("status was not announced: " + status);
  await shot(page, "390-after-click", false);

  await page.evaluate(() => document.querySelector(".skip").focus());
  await page.keyboard.press("Tab");
  const focusRing = await page.evaluate(() => {
    const button = document.querySelector("#new-excuse");
    const style = getComputedStyle(button);
    return {
      active: document.activeElement === button,
      outline: style.outlineStyle,
      width: style.outlineWidth,
      color: style.outlineColor,
    };
  });
  report.checks.focusRing = focusRing;
  await shot(page, "390-focus", false);
  if (!focusRing.active) fail("Tab did not reach the new-excuse button");
  if (focusRing.outline === "none" || focusRing.width === "0px") fail("button focus ring missing");
  await page.keyboard.press("Enter");
  await new Promise((resolve) => setTimeout(resolve, 200));
  const afterKey = await page.$eval("#excuse", (el) => el.textContent);
  report.checks.afterKeyboard = afterKey;
  if (!/^(The dog|My grandma|The mailman|My bird) /.test(afterKey)) fail("keyboard did not generate an excuse");

  await page.evaluate(axe.source);
  const axeResult = await page.evaluate(async () => {
    const result = await axe.run(document, { resultTypes: ["violations"] });
    return result.violations.map((item) => ({
      id: item.id,
      impact: item.impact,
      help: item.help,
      nodes: item.nodes.length,
    }));
  });
  report.checks.axe390 = axeResult;
  const serious = axeResult.filter((item) => item.impact === "serious" || item.impact === "critical");
  if (serious.length) fail("axe serious/critical: " + JSON.stringify(serious));

  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.reload({ waitUntil: "networkidle0" });
  const reduced = await page.evaluate(() => {
    const el = document.querySelector("#excuse");
    const style = getComputedStyle(el);
    return {
      dataset: document.documentElement.dataset.motion,
      animationName: style.animationName,
      transform: style.transform,
      transition: style.transitionDuration,
    };
  });
  report.checks.reducedOnLoad = reduced;
  if (reduced.dataset !== "reduced") fail("data-motion was not reduced on load");
  if (reduced.animationName !== "none") fail("animation still active under reduced motion: " + reduced.animationName);
  await shot(page, "390-reduced");

  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
  await page.reload({ waitUntil: "networkidle0" });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await new Promise((resolve) => setTimeout(resolve, 50));
  const changed = await page.evaluate(() => document.documentElement.dataset.motion);
  report.checks.reducedAfterChange = changed;
  if (changed !== "reduced") fail("data-motion did not follow a change");

  await page.setJavaScriptEnabled(false);
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
  await page.goto(base + "/", { waitUntil: "networkidle0" });
  const noJs = await page.$eval("#excuse", (el) => el.textContent);
  report.checks.noJsExcuse = noJs;
  if (noJs !== "My dog ate my homework") fail("no-JS excuse changed: " + noJs);
  await shot(page, "390-nojs", false);
  await page.setJavaScriptEnabled(true);

  await openAt(768, 1024);
  const box768 = await overflow(page);
  const lockup768 = await page.$eval(".lockup-horizontal", (el) => ({
    width: el.getBoundingClientRect().width,
    display: getComputedStyle(el).display,
  }));
  report.checks.overflow768 = box768;
  report.checks.lockup768 = lockup768;
  if (box768.scrollWidth > box768.clientWidth + 1) fail("overflow at 768");
  if (lockup768.display === "none" || lockup768.width < 400) fail("horizontal lockup missing at 768: " + JSON.stringify(lockup768));
  await shot(page, "768");

  await openAt(1280, 800);
  const box1280 = await overflow(page);
  const lockup1280 = await page.$eval(".lockup-horizontal", (el) => el.getBoundingClientRect().width);
  report.checks.overflow1280 = box1280;
  report.checks.lockup1280 = lockup1280;
  if (box1280.scrollWidth > box1280.clientWidth + 1) fail("overflow at 1280");
  if (lockup1280 < 400) fail("horizontal lockup under 400 at 1280");
  await shot(page, "1280");

  await openAt(320, 800);
  const box320 = await overflow(page);
  report.checks.overflow320 = box320;
  if (box320.scrollWidth > box320.clientWidth + 1) fail("overflow at 320");
  await shot(page, "320");

  await openAt(390, 844);
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "32px";
  });
  await new Promise((resolve) => setTimeout(resolve, 50));
  const box200 = await overflow(page);
  report.checks.overflow390Text200 = box200;
  if (box200.scrollWidth > box200.clientWidth + 1) fail("overflow at 390 with 200% root font");
  await shot(page, "390-text-200");

  const homeConsoleErrors = consoleErrors.slice();
  const homeHttpErrors = httpErrors.slice();
  const homeFailed = failedRequests.slice();
  if (homeConsoleErrors.length) fail("console errors on the home page: " + JSON.stringify(homeConsoleErrors));
  if (homeFailed.length) fail("failed requests on the home page: " + JSON.stringify(homeFailed));
  if (homeHttpErrors.length) fail("http errors on the home page: " + JSON.stringify(homeHttpErrors));

  const missing = await page.goto(base + "/no-such-page", { waitUntil: "networkidle0" });
  report.checks.missingStatus = missing.status();
  report.checks.missingTitle = await page.title();
  if (missing.status() !== 404) fail("missing route status " + missing.status());
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await shot(page, "404-390");

  report.checks.consoleErrors = homeConsoleErrors;
  report.checks.failedRequests = homeFailed;
  report.checks.httpErrors = homeHttpErrors;
  report.checks.expected404Console = consoleErrors.slice(homeConsoleErrors.length);

  const hashes = {};
  for (const name of ["signal-horizontal.svg", "signal-stacked.svg"]) {
    const body = readFileSync("dist/brand/lockups/" + name);
    hashes[name] = createHash("sha256").update(body).digest("hex");
  }
  report.checks.distLockupSha256 = hashes;
  if (hashes["signal-horizontal.svg"] !== "85459232bf51e7bf7c94225fd4f2cd6b71a681b6d701cb4ffd6d2a142cf57a81") {
    fail("dist horizontal hash drifted");
  }

  const videoPage = await browser.newPage();
  await videoPage.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  const recorder = await videoPage.screencast({ path: videoPath });
  await videoPage.goto(base + "/", { waitUntil: "networkidle0" });
  await new Promise((resolve) => setTimeout(resolve, 1200));
  await videoPage.click("#new-excuse");
  await new Promise((resolve) => setTimeout(resolve, 1400));
  await videoPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise((resolve) => setTimeout(resolve, 1800));
  await videoPage.evaluate(() => window.scrollTo(0, 0));
  await new Promise((resolve) => setTimeout(resolve, 800));
  await videoPage.click("#new-excuse");
  await new Promise((resolve) => setTimeout(resolve, 1400));
  await recorder.stop();
  await videoPage.close();
} finally {
  await browser.close();
}

report.failures = failures;
await writeFile(reportPath, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exit(1);
