import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Typography,
  Card,
  CardActionArea,
  CardContent,
  CardActions,
  Button,
} from "@material-ui/core";
import Link from "../../src/Link";

type Props = {
  classes: { nested: Object };
  slug: String;
  title: String;
  description: String;
  postedAt: String;
};

const styles = (theme) => ({});

class BlogCard extends Component<Props> {
  render() {
    const { classes } = this.props;
    return (
      <Card component="article">
        <CardActionArea>
          <CardContent>
            <header>
              <Typography gutterBottom variant="h5" component="h2">
                {this.props.title}
              </Typography>
              <Typography align="left" variant="caption">
                {this.props.postedAt}
              </Typography>
            </header>
            <Typography variant="body2" color="textSecondary" component="p">
              {this.props.description}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary">
            Share
          </Button>
          <Button size="small" color="primary">
            Learn More
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(BlogCard);
