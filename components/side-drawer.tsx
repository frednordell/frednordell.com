import React, { Component } from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Hidden from "@material-ui/core/Hidden";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import Link from "../src/Link";
import { Button, IconButton } from "@material-ui/core";
import SideButtonList from "./intro/side-button-list";

type State = {};

type Props = {
  left: boolean;
  toggleDrawer: Function;
};

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

class SideDrawer extends Component<Props, State> {
  drawerContents = (
    <div onKeyDown={this.props.toggleDrawer(false)}>
      <Grid
        container
        direction="row"
        alignItems="center"
        justify="space-between"
      >
        <Typography variant="h6" align="center" style={{ marginLeft: "8px" }}>
          Projects
        </Typography>
        <IconButton onClick={this.props.toggleDrawer(false)}>
          <Icon>close</Icon>
        </IconButton>
      </Grid>
      <Divider></Divider>
      <Grid
        container
        direction="row"
        alignItems="center"
        justify="space-around"
      >
        <Link href="/">
          <Button size="small" color="primary">
            Start
          </Button>
        </Link>
        <Divider orientation="vertical"></Divider>
        <Link href="/gallery">
          <Button size="small" color="primary">
            Photography
          </Button>
        </Link>
        <Divider orientation="vertical"></Divider>
        <Link href="/blog">
          <Button size="small" color="primary">
            Blog
          </Button>
        </Link>
      </Grid>
      <Divider></Divider>
      <SideButtonList></SideButtonList>
    </div>
  );
  render() {
    return (
      <div>
        <SwipeableDrawer
          disableBackdropTransition={!iOS}
          disableDiscovery={iOS}
          open={this.props.left}
          onOpen={this.props.toggleDrawer(true)}
          onClose={this.props.toggleDrawer(false)}
          ModalProps={{
            keepMounted: true,
            /* Better open performance on mobile.*/
          }}
        >
          {this.drawerContents}
        </SwipeableDrawer>
      </div>
    );
  }
}

export default SideDrawer;
