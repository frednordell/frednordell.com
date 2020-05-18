import fs from "fs";
import matter from "gray-matter";
import path from "path";

// formatt date to: Month day, Year. e.g. May 15, 2020
function getFormattedDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-Us", options);

  return formattedDate;
}

export function getSortedPosts() {
  const files = fs.readdirSync(`${process.cwd()}/content/posts`);

  const posts = files
    .map((filename) => {
      const markdownWithMetadata = fs
        .readFileSync(`content/posts/${filename}`)
        .toString();

      const { data } = matter(markdownWithMetadata);

      // Think about date formatting, ISO-8601 is amazingm but locale looks nicer

      const frontmatter = {
        ...data,
        postedAt: getFormattedDate(data.postedAt),
      };

      return {
        slug: filename.replace(".md", ""),
        frontmatter,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.frontmatter.postedAt).getTime() -
        new Date(a.frontmatter.postedAt).getTime()
    );

  return posts;
}

export function getPostsSlugs() {
  const files = fs.readdirSync("content/posts");

  const paths = files.map((filename) => ({
    params: {
      slug: filename.replace(".md", ""),
    },
  }));

  return paths;
}

export function getPostBySlug(slug) {
  const markdownWithMetadata = fs
    .readFileSync(path.join("content/posts", slug + ".md"))
    .toString();

  const { data, content, excerpt } = matter(markdownWithMetadata, {
    excerpt: true,
  });

  const frontmatter = {
    ...data,
    postedAt: getFormattedDate(data.postedAt),
  };

  return { frontmatter, post: { content, excerpt } };
}
