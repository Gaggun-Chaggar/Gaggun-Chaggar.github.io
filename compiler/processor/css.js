import { promises as fs } from "fs";
import { glob } from "glob";
import { utf8enc } from "./utils.js";

const cssPath = "src/css";

export const processCSS = async () => {
  const css = await fs.readFile(`${cssPath}/min.css`);
  const htmlFileNames = await glob("public/**/*.html");

  for (const fileName of htmlFileNames) {
    const file = await fs.readFile(fileName, utf8enc);

    const newHtml = file.replace(
      `<link rel="stylesheet" href="/css/min.css" />`,
      `<style>${css}</style>`
    );

    fs.writeFile(fileName, newHtml, utf8enc);
  }
};
