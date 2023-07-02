/**
 * @type {HTMLDivElement}
 */
const memoji = document.querySelector(".memoji > div");

const animationLength = 300;
const endDegree = 170;

let startTime, previousTimestamp, done;

const animateBorder = (timestamp) => {
  if (startTime === undefined) {
    startTime = timestamp;
  }

  const elapsed = timestamp - startTime;

  if (timestamp !== previousTimestamp) {
    const deg = Math.min((elapsed / animationLength) * endDegree, endDegree);
    memoji.style.borderImageSource = `linear-gradient(${deg}deg, var(--grad-colours))`;
    if (deg === 170) {
      done = true;
    }
  }

  if (done) {
    return;
  }

  if (elapsed < 300) {
    previousTimestamp = timestamp;
    window.requestAnimationFrame(animateBorder);
  }
};

window.requestAnimationFrame(animateBorder);
