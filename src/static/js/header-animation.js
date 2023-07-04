const header = document.querySelector("header");

let lastScrollValue = 0;
document.addEventListener("scroll", () => {
  const down = window.scrollY > lastScrollValue;
  const up = window.scrollY < lastScrollValue;

  lastScrollValue = window.scrollY;

  if (up && window.scrollY < 200) {
    header.classList.remove("shrink");
    return;
  }

  if (down && window.scrollY >= 200) {
    header.classList.add("shrink");
    return;
  }
});
