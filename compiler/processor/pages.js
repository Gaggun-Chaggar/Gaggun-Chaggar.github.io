import frontmatter from "front-matter";
import { promises as fs } from "fs";
import { glob } from "glob";
import { createFullTemplate } from "./doc.js";
import { pagesPath } from "./folders.js";
import { utf8enc } from "./utils.js";

const pages = await glob(`${pagesPath}/**/*.html`);

export const processPages = async () => {
  for (const page of pages) {
    const file = await fs.readFile(page, utf8enc);
    const fileData = frontmatter(file, {
      allowUnsafe: true,
    });

    const doc = createFullTemplate({
      body: fileData.body,
      title: fileData.attributes.title,
      description: fileData.attributes.description,
      assets: fileData.attributes.assets,
    });

    const filePath = "public/" + page.replace("src/pages/", "");
    await fs.writeFile(filePath, doc, utf8enc);
  }
};
