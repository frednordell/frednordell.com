import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import Image from "next/image";
import imageSrc from "images/cc.png";

type Props = {};
type State = {};

class Copyright extends Component<Props, State> {
  render() {
    return (
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="flex-end"
      >
        <Typography
          id="copyright"
          variant="body2"
          color="textSecondary"
          align="left"
        >
          This work is licensed under the{" "}
          <a
            rel="noreferrer noopener license"
            target="_blank"
            href="http://creativecommons.org/licenses/by-nc-nd/4.0/"
          >
            Creative Commons Attribution-NonCommercial-NoDerivatives 4.0
            International License
          </a>
        </Typography>
        <a
          rel="noreferrer noopener license"
          target="_blank"
          aria-label="Link to creative commons licence on image"
          href="http://creativecommons.org/licenses/by-nc-nd/4.0/"
        />
        <Image
          src={imageSrc}
          alt="Creative Commons License"
          layout="intrinsic"
        />
      </Grid>
    );
  } 
}

export default Copyright