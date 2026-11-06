import { mkdir, writeFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import { readdirSync, readFileSync } from "node:fs";
import { launch as launchChrome } from "chrome-launcher";
import lighthouse from "lighthouse";

const url = process.env.PREVIEW_URL || "http://127.0.0.1:4173/";
const artifactDir = "/opt/cursor/artifacts/lighthouse";
const summaryPath = new URL("../lighthouse-summary.json", import.meta.url);

const profiles = {
  mobile: {
    formFactor: "mobile",
    throttlingMethod: "simulate",
    screenEmulation: {
      mobile: true,
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      disabled: false,
    },
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4,
      requestLatencyMs: 562.5,
      downloadThroughputKbps: 1474.56,
      uploadThroughputKbps: 675,
    },
  },
  desktop: {
    formFactor: "desktop",
    throttlingMethod: "simulate",
    screenEmulation: {
      mobile: false,
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
      disabled: false,
    },
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
  },
};

function assertProfile(name, settings) {
  const expected = profiles[name];
  const problems = [];
  if (settings.formFactor !== expected.formFactor) problems.push("formFactor " + settings.formFactor);
  if (settings.throttlingMethod !== "simulate") problems.push("throttlingMethod " + settings.throttlingMethod);
  const screen = settings.screenEmulation || {};
  if (screen.width !== expected.screenEmulation.width || screen.height !== expected.screenEmulation.height) {
    problems.push("screen " + screen.width + "x" + screen.height);
  }
  if (Boolean(screen.mobile) !== expected.screenEmulation.mobile) problems.push("screen.mobile " + screen.mobile);
  const throttling = settings.throttling || {};
  if (throttling.rttMs !== expected.throttling.rttMs) problems.push("rttMs " + throttling.rttMs);
  if (throttling.throughputKbps !== expected.throttling.throughputKbps) problems.push("throughput " + throttling.throughputKbps);
  if (throttling.cpuSlowdownMultiplier !== expected.throttling.cpuSlowdownMultiplier) {
    problems.push("cpu " + throttling.cpuSlowdownMultiplier);
  }
  if (problems.length) {
    throw new Error(name + " configSettings mismatch: " + problems.join(", ") + "\n" + JSON.stringify(settings, null, 2));
  }
}

function metric(lhr, id) {
  const audit = lhr.audits[id];
  if (!audit) return null;
  return audit.numericValue;
}

function middle(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

await mkdir(artifactDir, { recursive: true });

const chrome = await launchChrome({
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
});

const summary = {
  url,
  generated_at: new Date().toISOString(),
  throttling_method: "simulate",
  chrome_path: chrome.chromePath || null,
  runs: { mobile: [], desktop: [] },
};

try {
  for (const name of ["mobile", "desktop"]) {
    for (let index = 1; index <= 3; index += 1) {
      const result = await lighthouse(
        url,
        {
          port: chrome.port,
          output: "json",
          logLevel: "error",
          onlyCategories: ["performance"],
        },
        {
          extends: "lighthouse:default",
          settings: {
            onlyCategories: ["performance"],
            ...profiles[name],
          },
        },
      );
      const lhr = result.lhr;
      assertProfile(name, lhr.configSettings);
      const run = {
        index,
        lcp_ms: metric(lhr, "largest-contentful-paint"),
        cls: metric(lhr, "cumulative-layout-shift"),
        tbt_ms: metric(lhr, "total-blocking-time"),
        inp_ms: metric(lhr, "interaction-to-next-paint"),
        performance_score: lhr.categories.performance.score,
        configSettings: {
          formFactor: lhr.configSettings.formFactor,
          throttlingMethod: lhr.configSettings.throttlingMethod,
          screenEmulation: lhr.configSettings.screenEmulation,
          throttling: lhr.configSettings.throttling,
        },
        lighthouseVersion: lhr.lighthouseVersion,
        requestedUrl: lhr.requestedUrl,
        finalDisplayedUrl: lhr.finalDisplayedUrl,
      };
      summary.runs[name].push(run);
      const file = `${artifactDir}/${name}-${index}.json`;
      await writeFile(file, result.report);
      console.log(name, index, "LCP", run.lcp_ms, "CLS", run.cls, "TBT", run.tbt_ms, "INP", run.inp_ms);
    }
  }
} finally {
  await chrome.kill();
}

for (const name of ["mobile", "desktop"]) {
  const runs = summary.runs[name];
  const pack = (key) => {
    const values = runs.map((run) => run[key]).filter((value) => typeof value === "number");
    return {
      median: values.length ? middle(values) : null,
      worst: values.length ? Math.max(...values) : null,
      values,
    };
  };
  summary[name] = {
    lcp_ms: pack("lcp_ms"),
    cls: pack("cls"),
    tbt_ms: pack("tbt_ms"),
    inp_ms: pack("inp_ms"),
    targets: { lcp_ms: 2500, cls: 0.1, tbt_ms: 200 },
  };
}

summary.inp_note =
  "Lighthouse laboratory JSON has no Interaction to Next Paint audit in this run when inp_ms is null. Total blocking time is the laboratory proxy. INP was not invented.";
const distFiles = readdirSync(new URL("../dist", import.meta.url));
function gzipSize(name) {
  const file = distFiles.find((entry) => entry.startsWith(name) && entry.endsWith(name === "app" ? ".js" : ".css"));
  const bytes = readFileSync(new URL("../dist/" + file, import.meta.url));
  return { file, raw_bytes: bytes.length, gzip_bytes: gzipSync(bytes).length };
}
summary.budgets = {
  js: gzipSize("app"),
  css: gzipSize("style"),
  limits: { js_gzip_bytes: 170 * 1024, css_gzip_bytes: 40 * 1024 },
};
summary.budgets.js_within_limit = summary.budgets.js.gzip_bytes <= summary.budgets.limits.js_gzip_bytes;
summary.budgets.css_within_limit = summary.budgets.css.gzip_bytes <= summary.budgets.limits.css_gzip_bytes;

await writeFile(summaryPath, JSON.stringify(summary, null, 2));
console.log("wrote", summaryPath.pathname);
