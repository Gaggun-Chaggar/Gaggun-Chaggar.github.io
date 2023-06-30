import frontmatter from "front-matter";
import { existsSync, promises as fs } from "fs";
import { glob } from "glob";
import markdownIt from "markdown-it";
import mustache from "mustache";
import path from "path";

const mdIt = new markdownIt();

const uft8enc = { encoding: "utf-8" };
const blogPostTemplate = await fs.readFile(
  "./compiler/template/blog-post.html",
  {
    encoding: "utf-8",
  }
);
const blogListTemplate = await fs.readFile(
  "./compiler/template/blog.html",
  uft8enc
);

const blogFileNames = await glob("blog/**/*.md");
const blogPosts = [];

/**
 * @param {string} fileName
 * @param {string} content
 */
const writeFile = async (fileName, content) => {
  const path = fileName.split("/");
  path.pop();

  const currPath = [];
  for (const p of path) {
    currPath.push(p);
    const pathAsString = currPath.join("/");

    if (existsSync(pathAsString)) {
      continue;
    }

    await fs.mkdir(pathAsString);
  }

  await fs.writeFile(fileName, content, uft8enc);
};

/**
 *
 * @param {string} fileName
 */
const processFile = async (fileName) => {
  const newFileName = path.join(
    "public/posts",
    fileName.replace("blog/", "").replace(".md", ".html")
  );
  const contentString = await fs.readFile(fileName, uft8enc);
  const data = frontmatter(contentString);
  const html = mdIt.render(data.body);

  const attributes = {
    title: data.attributes.title,
    subtitle: data.attributes.subtitle,
    date: Intl.DateTimeFormat("en-DB", {}).format(
      new Date(data.attributes.date)
    ),
  };

  const blogPost = mustache.render(blogPostTemplate, {
    ...attributes,
    article: html,
  });

  await writeFile(newFileName, blogPost);

  blogPosts.push({
    ...attributes,
    link: newFileName.replace("public", ""),
  });
};

for (const fileName of blogFileNames) {
  await processFile(fileName);
}

/**
 *
 * @param {string} link
 */
const getCategory = (link) => {
  if (!link) {
    return "";
  }
  const path = link.split("/");
  path.pop();
  path.shift();
  path.shift();
  return path.join(" / ");
};

/**
 *
 * @param {{ title: string; subtitle: string; date: string }[]} blogPosts
 */
const createBlogList = (blogPosts) => {
  const posts = `<ul class="blog-posts">
    ${blogPosts
      .map(
        (post) => `
        <li class="blog-post">
        <a href="${post.link}">
          <div>
            ${
              getCategory(post.link)
                ? `<span class="category">${getCategory(post.link)}</span>`
                : ""
            }
            <h2 class="title">${post.title}</h2>
          </div>
          <span class="date">${post.date}</span>
          </a>
        </li>
      `
      )
      .join("")}
  </ul>`;

  const html = mustache.render(blogListTemplate, { posts });

  fs.writeFile("public/blog.html", html, uft8enc);
};

createBlogList(blogPosts);
