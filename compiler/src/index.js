import frontmatter from "front-matter";
import { existsSync, promises as fs } from "fs";
import { glob } from "glob";
import markdownIt from "markdown-it";
import mustache from "mustache";
import path from "path";

const mdIt = new markdownIt();
const blogFileNames = await glob("blog/**/*.md");
const blogPostTemplate = await fs.readFile(
  "./compiler/template/blog-post.html",
  {
    encoding: "utf-8",
  }
);

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

  fs.writeFile(fileName, content, { encoding: "utf-8" });
};

const processFile = async (fileName) => {
  const newFileName = path.join(
    "public/posts",
    fileName.replace("blog/", "").replace(".md", ".html")
  );

  const contentString = await fs.readFile(fileName, { encoding: "utf-8" });

  const data = frontmatter(contentString);

  const html = mdIt.render(data.body);

  const blogPost = mustache.render(blogPostTemplate, {
    title: data.attributes.title,
    subtitle: data.attributes.subtitle,
    date: Intl.DateTimeFormat("en-DB", {}).format(
      new Date(data.attributes.date)
    ),
    article: html,
  });

  writeFile(newFileName, blogPost);
};

blogFileNames.forEach(processFile);
