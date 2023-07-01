import { processBlog } from "./processor/blog.js";
import { processCSS } from "./processor/css.js";
import { processPages } from "./processor/pages.js";

await processPages();
await processBlog();
await processCSS();
