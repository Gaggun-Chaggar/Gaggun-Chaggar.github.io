import { promises as fs } from "fs";
import { createFullTemplate } from "./doc.js";
import { utf8enc } from "./utils.js";

const pages = [
  {
    src: "src/pages/404.html",
    title: "404",
    description: "Not Found",
    assets: `<link rel="stylesheet" href="/css/font-awesome.css" />
     <link rel="stylesheet" href="/css/error-page.css" />`,
  },
  {
    src: "src/pages/index.html",
    title: "Gaggun Chaggar",
    description: "I'm him",
    assets: `<link rel="preload" href="/static/me.webp" as="image" />`,
  },
];

export const processPages = async () => {
  for (const page of pages) {
    const doc = createFullTemplate({
      body: await fs.readFile(page.src, utf8enc),
      title: page.title,
      description: page.description,
      assets: page.assets,
    });

    const filePath = "public/" + page.src.replace("src/pages/", "");
    await fs.writeFile(filePath, doc, utf8enc);
  }
};
