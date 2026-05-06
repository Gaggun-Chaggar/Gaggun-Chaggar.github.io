const createAboutDetailsLinkSection = (id, icon, text, href) => {
  const aboutDetails = document.getElementById("about-details");
  const existingEl = document.getElementById(id);

  if (existingEl) {
    return;
  }

  const p = document.createElement("p");
  p.id = id;
  p.className = "print-only";

  const i = document.createElement("i");
  i.role = "img";
  i.ariaLabel = "Website Link";
  i.className = `fas fa-${icon} mr-half fg-bold-light`;

  const a = document.createElement("a");
  a.href = href;
  a.target = "_blank";
  const textNode = new Text(text);
  a.appendChild(textNode);

  p.appendChild(i);
  p.appendChild(a);
  aboutDetails.prepend(p);
};

window.printCV = ({ phone, email }) => {
  createAboutDetailsLinkSection("details-at", "at", email, `mailto:${email}`);
  createAboutDetailsLinkSection(
    "details-phone",
    "phone",
    phone,
    `tel:${phone}`,
  );
  print();
};
