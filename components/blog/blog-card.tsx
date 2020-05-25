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
        <CardContent>
          <header>
            <Typography align="left" variant="caption">
              {this.props.postedAt}
            </Typography>
            <Typography gutterBottom variant="h5" component="h2">
              {this.props.title}
            </Typography>
          </header>
          <Typography variant="body2" color="textSecondary" component="p">
            {this.props.description}
          </Typography>
        </CardContent>
        <CardActions>
          {/*  <Button size="small" color="primary">
            Share
          </Button> */}
          <Link
            color="primary"
            href={"/post/[slug]"}
            as={`/post/${this.props.slug}`}
          >
            Read more
          </Link>
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(BlogCard);
