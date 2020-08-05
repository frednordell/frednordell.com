//components
import Intro from "../components/intro";
import Layout from "../components/layout";
import SEO from "../components/Seo";

export default function Index() {
  return (
    <Layout>
      <SEO title="Intro"></SEO>
      <Intro />
    </Layout>
  );
}
