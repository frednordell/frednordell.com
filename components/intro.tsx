import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Image from "./Image";

type Props = {};
type State = {};

class Intro extends Component<Props, State> {
  src = "face2.png";
  render() {
    return (
      <Grid
        container
        direction="column"
        alignItems="center"
        justify="center"
        spacing={1}
      >
        <Grid item xs={10} md={3}>
          <Image
            src={require(`../public/${this.src}`)}
            previewSrc={require(`../public/${this.src}?lqip`)}
            alt="Image of Fred"
            className="intro-image"
          />
        </Grid>
        <Grid item xs={10}>
          <Typography align="center" variant="h3">
            Fred Nordell
          </Typography>
        </Grid>
        <Grid item xs={10} md={6} lg={3}>
          <Typography align="center" variant="body1">
            Studying{" "}
            <a
              href="http://www.lth.se/english/education/programmes/master-engineering/computer-science-engineering/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Master of Science in Engineering, Computer Science and Engineering
            </a>{" "}
            at{" "}
            <a
              href="https://www.lu.se/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Lund Univerisity
            </a>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            size="large"
            variant="outlined"
            download="CV_Fred_Nordell.pdf"
            href="CV_Fred_Nordell.pdf"
          >
            <Icon style={{ marginRight: "5px" }}>file_download</Icon> Download
            CV
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default Intro;
