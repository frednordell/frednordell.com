import Head from "next/head";
import { getSiteMetaData } from "../utils/helpers";

export default function SEO({ title, description = "", path }) {
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
      <meta name="og:url" content={siteMetaData.siteUrl + path}></meta>
      <link rel="shortcut icon" href="/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/manifest.webmanifest"></link>
    </Head>
  );
}
