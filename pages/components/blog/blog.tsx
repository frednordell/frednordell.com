import fs from "fs";
import matter from "gray-matter";
import React from "react";
import Typography from "@material-ui/core/Typography";

export default function Blog({ posts }) {
  return (
    <div>
      {/* {posts.map(({ frontmatter: { title, description, date } }) => (
        <article key={title}>
          <header>
            <Typography align="center" variant="display3">
              {title}
            </Typography>
            <Typography align="center" variant="subheading">
              {date}
            </Typography>
          </header>
          <section>
            <Typography align="justify" variant="body1">
              {description}
            </Typography>
          </section>
        </article>
      ))} */}
    </div>
  );
}

export async function getStaticProps() {
  const files = fs.readdirSync(`${process.cwd()}/contents/posts`);
  console.log(files);

  const posts = files.map((filename) => {
    const markdownWithMetadata = fs.readFileSync(`content/posts/${filename}`)
      .toString;

    const { data } = matter(markdownWithMetadata);

    // Think about date formatting, ISO-8601 is amazingm but locale looks nicer

    const frontmatter = {
      ...data,
    };

    return {
      slug: filename.replace(".md", ""),
      frontmatter,
    };
  });

  return {
    props: {
      posts,
    },
  };
}
