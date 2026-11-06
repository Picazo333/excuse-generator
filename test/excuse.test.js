import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { action, generateExcuse, pick, what, when, who } from "../src/excuse.js";

const excuseSource = readFileSync(new URL("../src/excuse.js", import.meta.url), "utf8");
const appSource = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
const indexSource = readFileSync(new URL("../src/index.html", import.meta.url), "utf8");

test("the four lists match the exercise statement", () => {
  assert.deepEqual(who, ["The dog", "My grandma", "The mailman", "My bird"]);
  assert.deepEqual(action, ["ate", "peed", "crushed", "broke"]);
  assert.deepEqual(what, ["my homework", "my phone", "the car"]);
  assert.deepEqual(when, [
    "before the class",
    "when I was sleeping",
    "while I was exercising",
    "during my lunch",
    "while I was praying",
  ]);
  assert.match(excuseSource, /let who = \['The dog', 'My grandma', 'The mailman', 'My bird'\];/);
  assert.match(excuseSource, /let action = \['ate', 'peed', 'crushed', 'broke'\];/);
  assert.match(excuseSource, /let what = \['my homework', 'my phone', 'the car'\];/);
  assert.match(
    excuseSource,
    /let when = \['before the class', 'when I was sleeping', 'while I was exercising', 'during my lunch', 'while I was praying'\];/,
  );
});

test("generateExcuse returns one item from each list in order", () => {
  for (let i = 0; i < who.length; i += 1) {
    for (let j = 0; j < action.length; j += 1) {
      for (let k = 0; k < what.length; k += 1) {
        for (let n = 0; n < when.length; n += 1) {
          const values = [
            (i + 0.25) / who.length,
            (j + 0.25) / action.length,
            (k + 0.25) / what.length,
            (n + 0.25) / when.length,
          ];
          let cursor = 0;
          const text = generateExcuse(() => values[cursor++]);
          assert.equal(text, who[i] + " " + action[j] + " " + what[k] + " " + when[n]);
          assert.equal(cursor, 4);
        }
      }
    }
  }
});

test("the default generator stays inside the lists", () => {
  const excuses = new Set();
  for (const person of who) {
    for (const verb of action) {
      for (const object of what) {
        for (const moment of when) {
          excuses.add(person + " " + verb + " " + object + " " + moment);
        }
      }
    }
  }
  assert.equal(excuses.size, 240);
  for (let n = 0; n < 40; n += 1) {
    assert.equal(excuses.has(generateExcuse()), true);
  }
});

test("pick uses the random index and rejects an empty list or a bad roll", () => {
  assert.equal(pick(["only"], () => 0), "only");
  assert.equal(pick(["a", "b", "c"], () => 0.999), "c");
  assert.throws(() => pick([], () => 0), /empty list/);
  assert.throws(() => generateExcuse(() => 1), /0 inclusive to 1 exclusive/);
  assert.throws(() => generateExcuse(() => -0.01), /0 inclusive to 1 exclusive/);
  assert.throws(() => generateExcuse(() => Number.NaN), /0 inclusive to 1 exclusive/);
});

test("the page calls the generator from onload and writes innerHTML", () => {
  assert.match(appSource, /window\.onload\s*=\s*function\s*\(\)\s*\{/);
  assert.match(appSource, /excuse\.innerHTML\s*=\s*generateExcuse\(\)/);
  assert.match(appSource, /writeExcuse\(\)/);
  assert.match(indexSource, /id="excuse"/);
  assert.match(indexSource, /My dog ate my homework/);
  assert.equal(indexSource.includes("<script"), false);
});

test("the new-excuse button is present in the page", () => {
  assert.match(indexSource, /id="new-excuse"/);
  assert.match(indexSource, /Generate a new excuse/);
  assert.match(appSource, /#new-excuse/);
  assert.match(appSource, /addEventListener\("click"/);
});
