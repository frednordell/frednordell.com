import React from "react";
import Typography from "@material-ui/core/Typography";
import Link from "./Link";
import { Grid } from "@material-ui/core";

export default function Copyright() {
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
        href="http://creativecommons.org/licenses/by-nc-nd/4.0/"
      >
        <img
          alt="Creative Commons License"
          src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png"
        />
      </a>
    </Grid>
  );
}
