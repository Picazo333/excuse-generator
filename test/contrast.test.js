import assert from "node:assert/strict";
import { test } from "node:test";

function channel(value) {
  const c = value / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const h = hex.slice(1);
  const r = channel(parseInt(h.slice(0, 2), 16));
  const g = channel(parseInt(h.slice(2, 4), 16));
  const b = channel(parseInt(h.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(foreground, background) {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

test("text and control colors used on the page meet WCAG AA ratios", () => {
  const text = [
    ["#18202B", "#FFFFFF", 4.5],
    ["#18202B", "#F7F8FA", 4.5],
    ["#18202B", "#E7ECF2", 4.5],
    ["#18202B", "#FCEDE6", 4.5],
    ["#505E70", "#FFFFFF", 4.5],
    ["#505E70", "#F7F8FA", 4.5],
    ["#FFFFFF", "#B53A17", 4.5],
    ["#FFFFFF", "#8F2D12", 4.5],
    ["#FFFFFF", "#73230E", 4.5],
    ["#A32A26", "#F7F8FA", 4.5],
    ["#A32A26", "#FFFFFF", 4.5],
    ["#B53A17", "#FFFFFF", 4.5],
  ];
  const nonText = [
    ["#788598", "#FFFFFF", 3],
    ["#164DCC", "#FFFFFF", 3],
    ["#164DCC", "#F7F8FA", 3],
  ];
  for (const [foreground, background, minimum] of [...text, ...nonText]) {
    const ratio = contrast(foreground, background);
    assert.ok(
      ratio >= minimum,
      foreground + " on " + background + " is " + ratio.toFixed(2) + ", minimum " + minimum,
    );
  }
});
