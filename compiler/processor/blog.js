import frontmatter from "front-matter";
import { existsSync, promises as fs } from "fs";
import { glob } from "glob";
import hljs from "highlight.js";
import markdownIt from "markdown-it";
import mustache from "mustache";
import path from "path";
import { createFullTemplate } from "./doc.js";
import { templatesPath, utf8enc } from "./utils.js";

const blogsPath = "src/blog";

const mdIt = new markdownIt({
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }

    return ""; // use external default escaping
  },
});

const blogFileNames = await glob(`${blogsPath}/**/*.md`);

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

  await fs.writeFile(fileName, content, utf8enc);
};

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

const getTemplates = async () => {
  const blogPostTemplate = await fs.readFile(
    `${templatesPath}/blog-post.html`,
    utf8enc
  );
  const blogPostTemplateData = frontmatter(blogPostTemplate);

  const fullBlogPostTemplate = createFullTemplate({
    body: blogPostTemplateData.body,
    assets: blogPostTemplateData.attributes.assets,
    title: "{{ &title }}",
    description: "{{ &description }}",
  });

  const blogListTemplate = await fs.readFile(
    `${templatesPath}/blog.html`,
    utf8enc
  );
  const blogListTemplateData = frontmatter(blogListTemplate);

  const fullBlogListTemplate = createFullTemplate({
    body: blogListTemplateData.body,
    assets: blogListTemplateData.attributes.assets,
    title: blogListTemplateData.attributes.title,
    description: blogListTemplateData.attributes.description,
  });

  return {
    fullBlogListTemplate,
    fullBlogPostTemplate,
  };
};

export const processBlog = async () => {
  const { fullBlogListTemplate, fullBlogPostTemplate } = await getTemplates();

  const blogPosts = [];

  /**
   *
   * @param {string} fileName
   */
  const processFile = async (fileName) => {
    const newFileName = path.join(
      "public/posts",
      fileName.replace(blogsPath, "").replace(".md", ".html")
    );
    const contentString = await fs.readFile(fileName, utf8enc);
    const data = frontmatter(contentString);
    const html = mdIt.render(data.body);

    const attributes = {
      ...data.attributes,
      date: Intl.DateTimeFormat("en-DB", {}).format(
        new Date(data.attributes.date)
      ),
    };

    const blogPost = mustache.render(fullBlogPostTemplate, {
      ...attributes,
      article: html,
    });

    await writeFile(newFileName, blogPost);

    blogPosts.push({
      ...attributes,
      dateAsObject: new Date(data.attributes.date),
      link: newFileName.replace("public", ""),
    });
  };

  for (const fileName of blogFileNames) {
    await processFile(fileName);
  }

  /**
   *
   * @param {{ title: string; subtitle: string; date: string; dateAsObject: Date }[]} blogPosts
   */
  const createBlogList = (blogPosts) => {
    const posts = `<ul class="blog-posts">
      ${blogPosts
        .sort((a, b) => b.dateAsObject.getTime() - a.dateAsObject.getTime())
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

    const html = mustache.render(fullBlogListTemplate, { posts });

    fs.writeFile("public/blog.html", html, utf8enc);
  };

  createBlogList(blogPosts);
};
