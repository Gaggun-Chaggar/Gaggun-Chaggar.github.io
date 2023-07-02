/**
 * @type {HTMLDivElement}
 */
const memoji = document.querySelector(".memoji > div");

const increment = 8;
const start = -30;
const frames = 24;

const animateBorder = (i) => {
  const deg = i * increment + start;
  memoji.style.borderImageSource = `linear-gradient(${deg}deg, var(--grad-colours))`;

  if (i <= frames) {
    window.requestAnimationFrame(() => animateBorder(i + 1));
  }
};

window.requestAnimationFrame(() => animateBorder(1));
