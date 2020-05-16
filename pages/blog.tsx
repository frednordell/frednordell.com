import Typography from "@material-ui/core/Typography";
import Layout from "../components/layout";
import { getSortedPosts } from "../utils/posts";
import SEO from "../components/Seo";
import BlogCard from "../components/blog/blog-card";
import { Grid } from "@material-ui/core";

export default function Blog({ posts }) {
  return (
    <Layout>
      <SEO title="Blog"></SEO>
      <Grid container spacing={3}>
        {posts.map(({ frontmatter: { title, description, postedAt } }) => (
          <Grid key={title} item xs={12} md={6} lg={3}>
            <BlogCard
              slug=""
              title={title}
              description={description}
              postedAt={postedAt}
            ></BlogCard>
          </Grid>
        ))}
      </Grid>
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
