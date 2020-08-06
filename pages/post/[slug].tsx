import Layout from "../../components/layout";
import SEO from "../../components/Seo";
import { getPostsSlugs, getPostBySlug } from "../../utils/posts";
import { Typography, Paper, Container, Box } from "@material-ui/core";
import HighlightedMarkdown from "../../components/blog/highlighted-markdown";

export default function Post({ post, frontmatter }) {
  return (
    <Layout>
      <SEO
        title={frontmatter.title}
        path={"/post/" + frontmatter.slug}
        description={frontmatter.description || post.excerpt}
      />

      <Paper>
        <Container maxWidth="md">
          <Box paddingY={1.5}>
            <Typography align="left" variant="caption">
              {frontmatter.postedAt}
            </Typography>
            <Typography gutterBottom variant="h4" component="h2">
              {frontmatter.title}
            </Typography>
            <Typography variant="body1">{frontmatter.description}</Typography>
          </Box>
        </Container>
      </Paper>
      <Container maxWidth="md">
        <HighlightedMarkdown>{post.content}</HighlightedMarkdown>
      </Container>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getPostsSlugs();

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }) {
  const postData = getPostBySlug(slug);

  return {
    props: postData,
  };
}
