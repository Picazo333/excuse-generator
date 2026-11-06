import "./style.css";
import { generateExcuse } from "./excuse.js";
import { markSuccess, markError, bindMotion } from "./render.js";

function writeExcuse() {
  const excuse = document.querySelector("#excuse");
  const status = document.querySelector("#status");
  if (!excuse) return;
  try {
    excuse.innerHTML = generateExcuse();
    markSuccess(excuse, status);
  } catch (error) {
    markError(excuse, status);
  }
}

window.onload = function () {
  bindMotion(window, document);
  const excuse = document.querySelector("#excuse");
  if (!excuse) return;
  writeExcuse();
  const button = document.querySelector("#new-excuse");
  if (!button) return;
  button.addEventListener("click", function () {
    if (button.disabled) return;
    button.disabled = true;
    writeExcuse();
    button.disabled = false;
  });
};
