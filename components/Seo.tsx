import Head from "next/head";
import { getSiteMetaData } from "../utils/helpers";

export default function SEO({ title, description = "" }) {
  const siteMetaData = getSiteMetaData();

  const metaDescription = description || siteMetaData.description;

  return (
    <Head>
      <title>
        {title} | {siteMetaData.title}
      </title>
      <meta name="description" content={metaDescription}></meta>
      <meta property="og:type" content="website"></meta>
      <meta name="og:title" property="og:title" content={title}></meta>
      <meta
        name="og:description"
        property="og:description"
        content={metaDescription}
      ></meta>
      <link rel="manifest" href="/manifest.json" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/favicon.ico"></link>
    </Head>
  );
}
