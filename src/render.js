const SUCCESS_TEXT = "A new excuse is on the page.";
const ERROR_TEXT = "The excuse could not be built. Use Generate a new excuse to try again.";

function markSuccess(excuse, status) {
  excuse.dataset.state = "success";
  excuse.setAttribute("data-motion-node", "");
  if (excuse.classList) {
    excuse.classList.remove("is-updated");
    if ("offsetWidth" in excuse) {
      void excuse.offsetWidth;
    }
    excuse.classList.add("is-updated");
  }
  if (status) status.textContent = SUCCESS_TEXT;
}

function markError(excuse, status) {
  if (excuse) excuse.dataset.state = "error";
  if (status) status.textContent = ERROR_TEXT;
}

function bindMotion(win, doc) {
  const motion = win.matchMedia("(prefers-reduced-motion: reduce)");
  const apply = function () {
    doc.documentElement.dataset.motion = motion.matches ? "reduced" : "full";
  };
  apply();
  if (typeof motion.addEventListener === "function") {
    motion.addEventListener("change", apply);
  }
  return apply;
}

export { SUCCESS_TEXT, ERROR_TEXT, markSuccess, markError, bindMotion };
