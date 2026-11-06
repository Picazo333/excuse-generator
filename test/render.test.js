import assert from "node:assert/strict";
import { test } from "node:test";
import { bindMotion, ERROR_TEXT, markError, markSuccess, SUCCESS_TEXT } from "../src/render.js";

function element() {
  const classes = new Set();
  return {
    dataset: {},
    textContent: "",
    classList: {
      add(name) {
        classes.add(name);
      },
      remove(name) {
        classes.delete(name);
      },
      has(name) {
        return classes.has(name);
      },
    },
    offsetWidth: 0,
    setAttribute(name, value) {
      this[name] = value;
    },
  };
}

test("markSuccess announces the excuse and restarts the motion class", () => {
  const excuse = element();
  const status = element();
  excuse.classList.add("is-updated");
  markSuccess(excuse, status);
  assert.equal(excuse.dataset.state, "success");
  assert.equal(excuse["data-motion-node"], "");
  assert.equal(excuse.classList.has("is-updated"), true);
  assert.equal(status.textContent, SUCCESS_TEXT);
});

test("markError keeps a readable recovery message", () => {
  const excuse = element();
  const status = element();
  markError(excuse, status);
  assert.equal(excuse.dataset.state, "error");
  assert.equal(status.textContent, ERROR_TEXT);
  assert.match(status.textContent, /Generate a new excuse/);
});

test("bindMotion follows prefers-reduced-motion and later changes", () => {
  let listener = null;
  const doc = { documentElement: { dataset: {} } };
  const win = {
    matchMedia() {
      return {
        matches: true,
        addEventListener(_name, fn) {
          listener = fn;
        },
      };
    },
  };
  bindMotion(win, doc);
  assert.equal(doc.documentElement.dataset.motion, "reduced");
  listener();
  assert.equal(doc.documentElement.dataset.motion, "reduced");
});
