import { promises as fs } from "fs";
import { glob } from "glob";
import { utf8enc } from "./utils";

const css = await fs.readFile("public/css/min.css");
const htmlFileNames = await glob("**/*.html");

htmlFileNames.forEach(async (fileName) => {
  const file = await fs.readFile(fileName, utf8enc);

  const newHtml = file.replace(
    `<link rel="stylesheet" href="/css/min.css" />`,
    `<style>${css}</style>`
  );

  fs.writeFile(fileName, newHtml, utf8enc);
});
