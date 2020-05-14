// @flow

import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";

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
        spacing={24}
      >
        <Grid item xs={10} md={3}>
          <img
            style={{ maxWidth: "100%", borderRadius: "20%" }}
            src="face2.jpg"
            alt=""
          />
        </Grid>
        <Grid item xs={10}>
          <Typography align="center" variant="display3">
            Fred Nordell
          </Typography>
        </Grid>
        <Grid item xs={10}>
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
              traget="_blank"
              rel="noopener noreferrer"
            >
              Lund Univerisity
            </a>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
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
