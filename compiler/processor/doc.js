import { promises as fs } from "fs";
import mustache from "mustache";
import { templatesPath } from "./folders.js";
import { utf8enc } from "./utils.js";

const docTemplate = await fs.readFile(`${templatesPath}/doc.html`, utf8enc);

/**
 *
 * @param {{title: string; description?: string; body: string; assets?: string}} view
 * @returns
 */
export const createFullTemplate = (view) => mustache.render(docTemplate, view);
