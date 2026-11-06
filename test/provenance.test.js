import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";

function sha256(file) {
  return createHash("sha256").update(readFileSync(new URL(file, import.meta.url))).digest("hex");
}

test("lockup and token files keep the SIGNAL bytes", () => {
  assert.equal(
    sha256("../brand/lockups/signal-horizontal.svg"),
    "85459232bf51e7bf7c94225fd4f2cd6b71a681b6d701cb4ffd6d2a142cf57a81",
  );
  assert.equal(
    sha256("../brand/lockups/signal-stacked.svg"),
    "11314b300284db342bc15a7c7695c23199f65f68178af45586b62d01e9ea133a",
  );
  assert.equal(
    sha256("../src/styles/tokens.css"),
    "9b1f68b4a44d79f0990778953c208af96c08e5bd8bd4f70b16697fbb24f51e52",
  );
  assert.equal(
    sha256("../src/styles/motion.css"),
    "36b2f4d56439871d1ae46d4e2ad3e3d0d0b5da7a2700c503d4382247784b2f5c",
  );
});

test("official statement copies match PROVENANCE.json", () => {
  const provenance = JSON.parse(readFileSync(new URL("../source/PROVENANCE.json", import.meta.url), "utf8"));
  const paths = {
    "OFFICIAL_README.md": "../source/OFFICIAL_README.md",
    "OFFICIAL_README.es.md": "../source/OFFICIAL_README.es.md",
    "learn.json": "../source/learn.json",
  };
  assert.equal(provenance.length, 3);
  for (const entry of provenance) {
    assert.equal(sha256(paths[entry.file]), entry.sha256);
    assert.equal(entry.commit, "b74fb88e5b90dfefc0229eb0827b3b194b91706e");
    assert.equal(entry.source_repo, "4GeeksAcademy/tutorial-project-excuse-generator-javascript");
  }
});

test("README documents license and does not invent collaborators", () => {
  const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");
  assert.match(readme, /ISC/);
  assert.match(readme, /b74fb88e5b90dfefc0229eb0827b3b194b91706e/);
  assert.match(readme, /85459232bf51e7bf7c94225fd4f2cd6b71a681b6d701cb4ffd6d2a142cf57a81/);
  assert.equal(/co-authored-by/i.test(readme), false);
  assert.equal(/colaborador/i.test(readme), false);
});
