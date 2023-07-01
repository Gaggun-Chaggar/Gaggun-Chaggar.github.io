import { processBlog } from "./blog.js";
import { processCSS } from "./css.js";

await processCSS();
await processBlog();
