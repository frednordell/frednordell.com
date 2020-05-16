import Typography from "@material-ui/core/Typography";
import Layout from "../components/layout";
import { getSortedPosts } from "../utils/posts";

export default function Blog({ posts }) {
  return (
    <Layout>
      {posts.map(({ frontmatter: { title, description, postedAt } }) => (
        <article key={title}>
          <header>
            <Typography align="left" variant="h4">
              {title}
            </Typography>
            <Typography align="left" variant="caption">
              {postedAt}
            </Typography>
          </header>
          <section>
            <Typography align="justify" variant="body1">
              {description}
            </Typography>
          </section>
        </article>
      ))}
    </Layout>
  );
}

export async function getStaticProps() {
  const posts = getSortedPosts();

  return {
    props: {
      posts,
    },
  };
}
