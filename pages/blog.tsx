import Typography from "@material-ui/core/Typography";
import Layout from "../components/layout";
import { getSortedPosts } from "../utils/posts";
import SEO from "../components/Seo";
import BlogCard from "../components/blog/blog-card";
import { Grid, Container } from "@material-ui/core";

export default function Blog({ posts }) {
  return (
    <Layout>
      <SEO title="Blog"></SEO>
      <Container maxWidth="md">
        <Grid container spacing={3} justify="space-evenly">
          {posts.map(
            ({ slug, frontmatter: { title, description, postedAt } }) => (
              <Grid key={title} item xs={12} md={6}>
                <BlogCard
                  slug={slug}
                  title={title}
                  description={description}
                  postedAt={postedAt}
                ></BlogCard>
              </Grid>
            )
          )}
        </Grid>
      </Container>
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
