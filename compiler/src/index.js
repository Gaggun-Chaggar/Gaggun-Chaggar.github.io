import { processBlog } from "./processor/blog.js";
import { processCSS } from "./processor/css.js";

await processCSS();
await processBlog();
