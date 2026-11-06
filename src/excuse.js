let who = ['The dog', 'My grandma', 'The mailman', 'My bird'];
let action = ['ate', 'peed', 'crushed', 'broke'];
let what = ['my homework', 'my phone', 'the car'];
let when = ['before the class', 'when I was sleeping', 'while I was exercising', 'during my lunch', 'while I was praying'];

function pick(list, rng) {
  if (!list || list.length === 0) {
    throw new Error("Cannot build an excuse from an empty list.");
  }
  const value = rng();
  if (typeof value !== "number" || !(value >= 0 && value < 1)) {
    throw new Error("Random source must return a number from 0 inclusive to 1 exclusive.");
  }
  const index = Math.floor(value * list.length);
  return list[index];
}

function generateExcuse(rng = Math.random) {
  return pick(who, rng) + " " + pick(action, rng) + " " + pick(what, rng) + " " + pick(when, rng);
}

export { who, action, what, when, pick, generateExcuse };
