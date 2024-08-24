import frontmatter from "front-matter";
import { promises as fs } from "fs";
import { glob } from "glob";
import { createFullTemplate } from "./doc.js";
import { utf8enc } from "./utils.js";

const pagesPath = "src/pages";

const pages = await glob(`${pagesPath}/**/*.html`);

export const processPages = async () => {
  for (const page of pages) {
    const file = await fs.readFile(page, utf8enc);
    const fileData = frontmatter(file, {
      allowUnsafe: true,
    });

    const doc = createFullTemplate({
      body: fileData.body,
      ...fileData.attributes,
    });

    const filePath = "public/" + page.replace(pagesPath + "/", "");
    fs.writeFile(filePath, doc, utf8enc);
  }
};
