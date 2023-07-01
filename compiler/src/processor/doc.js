import { promises as fs } from "fs";
import mustache from "mustache";
import { utf8enc } from "./utils.js";

const docTemplate = await fs.readFile("src/templates/doc.html", utf8enc);

export const createFullTemplate = (view) => mustache.render(docTemplate, view);
