/**
 * @type {HTMLDivElement}
 */
const memoji = document.querySelector(".memoji > div");

const animationLength = 300;
const endDegree = 135;
const start = 45;

let startTime, previousTimestamp, done;

const animateBorder = (timestamp) => {
  if (startTime === undefined) {
    startTime = timestamp;
  }

  const elapsed = timestamp - startTime;

  const deg = Math.min(
    ((start + elapsed) * endDegree) / animationLength,
    endDegree
  );

  if (timestamp !== previousTimestamp) {
    memoji.style.borderImageSource = `linear-gradient(${deg}deg, var(--grad-colours))`;
  }

  if (deg === endDegree) {
    return;
  }

  previousTimestamp = timestamp;
  window.requestAnimationFrame(animateBorder);
};

window.requestAnimationFrame(animateBorder);
