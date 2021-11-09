import Link from "../../src/Link";
import { useEffect, useRef, Fragment } from "react";
import Markdown from "markdown-to-jsx";
import hljs from "highlight.js";
import Image from "next/image";
import { Typography, withStyles, Box, Grid } from "@material-ui/core";

interface HighlightedMarkdownProps {
  children: string;
}

const MarkdownImage = ({ alt, src }) => {
  return (
    <Image
      alt={alt}
      src={require(`content/blog/assets/${src}?trace`)}
      layout="intrinsic"
      className="markdown-image"
    />
  );
};

const MarkdownImageContainer = (props) => (
  <Box marginY={2} id={props.alt.split("#")[1] || props.alt}>
    <Grid container direction="column" justify="center" alignItems="center">
      <Grid item>
        <MarkdownImage {...props}></MarkdownImage>
      </Grid>
      <Grid item>
        <em>{props.alt.split("#")[0]}</em>
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
    a: { component: (props) => {
      if (props.href.startsWith("http")) {
        return (
          <a href={props.href} rel="noopener noreferrer" target="_blank">
            {props.children[0]}
          </a>
        )
      } else { 
        return <Link {...props}/>
      }
    }},
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
      if  (block instanceof HTMLElement) {
        hljs.highlightElement(block)
      } 
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
