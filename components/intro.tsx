import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Image from "next/image";
import imageSrc from "images/face2.png";

type Props = {};
type State = {};

class Intro extends Component<Props, State> {
  render() {
    return (
        <Grid
          container
          direction="column"
          alignItems="center"
          justify="center"
          spacing={1}
          className="intro-container"
        >
          <Grid item xs={8} md={3}>
            <div>
            <Image
              src={imageSrc}
              className="intro-image"
              layout="intrinsic"
              alt="Image of Fred"
            />
            </div>
          </Grid>
          <Grid item xs={3}>
              <Typography align="center" variant="h3">
                Fred Nordell
              </Typography>
          </Grid>
          <Grid item xs={1} md={4} lg={3}>
            <Typography align="center" variant="body1">
              Studying{" "}
              <a
                href="http://www.lth.se/utbildning/datateknik300/"
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
          <Grid item xs={2}>
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
