const anchorsWithBlankTarget = document.querySelectorAll("a[target='_blank']");

const createExternalLinkIcon = () => {
  const icon = document.createElement("i");
  icon.classList = "fas fa-external-link-alt";
  icon.setAttribute("aria-hidden", "true");
  return icon;
};

const createOpensInNewWindowSRText = () => {
  const span = document.createElement("span");
  span.classList = "sr-only";
  span.appendChild(new Text("(opens in a new window)"));
  return span;
};

const tooltipId = (index) => `anchor-tooltip-${index}`;

const createTooltip = (index) => {
  const div = document.createElement("div");
  div.appendChild(new Text("opens in a new window"));
  div.setAttribute("role", "tooltip");
  div.setAttribute("id", tooltipId(index));

  const arrow = document.createElement("div");
  arrow.setAttribute("data-popper-arrow", "");

  div.appendChild(arrow);

  return div;
};

anchorsWithBlankTarget.forEach((a, i) => {
  const icon = createExternalLinkIcon();
  const srText = createOpensInNewWindowSRText();
  const tooltip = createTooltip(i);

  a.setAttribute("id", `anchor-${i}`);
  a.setAttribute("aria-describedby", tooltipId(i));
  a.appendChild(icon);
  a.appendChild(srText);
  document.body.appendChild(tooltip);

  popper = Popper.createPopper(a, tooltip, {
    placement: "top",
  });

  const show = () => {
    tooltip.setAttribute("data-show", "");
    tooltip.setAttribute("aria-hidden", "false");
    popper.update();
  };

  const hide = () => {
    tooltip.removeAttribute("data-show");
    tooltip.setAttribute("aria-hidden", "true");
  };

  a.addEventListener("mouseenter", show);
  a.addEventListener("mouseleave", hide);
});
