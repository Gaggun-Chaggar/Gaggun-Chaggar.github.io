import { promises as fs } from "fs";
import { pages } from "../../src/pages/routes.js";
import { createFullTemplate } from "./doc.js";
import { utf8enc } from "./utils.js";

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
