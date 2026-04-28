import { processCSS } from "./processor/css.js";
import { processPages } from "./processor/pages.js";

await processPages();
processCSS();
