import Link from "../../src/Link";
import { useEffect, useRef, Fragment } from "react";
import Markdown from "markdown-to-jsx";
import hljs from "highlight.js";
import Image from "../Image";
import { Typography, withStyles, Box, Grid } from "@material-ui/core";

interface HighlightedMarkdownProps {
  children: string;
}

const MarkdownImage = ({ alt, src }) => (
  <Image
    alt={alt}
    src={require(`public/static/blog/assets/${src}`)}
    previewSrc={require(`public/static/blog/assets/${src}?lqip`)}
    className="markdown-image"
  />
);

const MarkdownImageContainer = (props) => (
  <Box marginY={2}>
    <Grid container direction="row" justify="center" alignItems="center">
      <Grid item>
        <MarkdownImage {...props}></MarkdownImage>
      </Grid>
    </Grid>
  </Box>
);

const styles = (theme) => ({
  listItem: {
    marginTop: theme.spacing(1),
  },
});

const options = {
  overrides: {
    img: MarkdownImageContainer,
    h1: {
      component: (props) => <Typography gutterBottom variant="h4" {...props} />,
    },
    h2: {
      component: (props) => <Typography gutterBottom variant="h6" {...props} />,
    },
    h3: {
      component: (props) => (
        <Typography gutterBottom variant="subtitle1" {...props} />
      ),
    },
    h4: {
      component: (props) => (
        <Typography gutterBottom variant="caption" paragraph {...props} />
      ),
    },
    p: {
      component: (props) => {
        return <Typography component="div" align="left" paragraph {...props} />;
      },
    },
    a: { component: Link },
    li: {
      component: (props) => {
        return (
          <li>
            <Typography component="span" {...props} />
          </li>
        );
      },
    },
  },
};

export default function HighlightedMarkdown({
  children,
}: HighlightedMarkdownProps) {
  const rootRef = useRef<HTMLDivElement>();
  useEffect(() => {
    rootRef.current.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightBlock(block);
    });
  }, [children]);
  return (
    <div ref={rootRef}>
      <Box paddingTop={1}>
        <Markdown options={options}>{children}</Markdown>
      </Box>
    </div>
  );
}
