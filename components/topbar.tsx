import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import SideDrawer from "./side-drawer";

type State = {
  left: boolean;
};

class TopBar extends Component {
  state = {
    left: false,
  };

  toggleDrawer = (open: boolean) => () => {
    this.setState({
      left: open,
    });
  };

  linkToPage = (link: string) => () => {};

  render() {
    const component = (
      <div>
        <AppBar
          position="static"
          color="default"
          style={{ marginBottom: "24px" }}
        >
          <SideDrawer left={this.state.left} toggleDrawer={this.toggleDrawer} />
          <Toolbar>
            <IconButton onClick={this.toggleDrawer(true)}>
              <Icon>menu</Icon>
            </IconButton>
            <span style={{ flex: 1 }}></span>
            <IconButton
              href="https://github.com/frednordell"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="GitHub-Mark-Light-64px.png"
                height="24"
                alt="Github logo"
              />
            </IconButton>
            <IconButton
              href="https://www.linkedin.com/in/frednordell"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="In-White-66px-R.png" height="24" alt="Linkedin logo" />
            </IconButton>
            <IconButton
              href="mailto:fred@nordells.nu"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon>mail</Icon>
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>
    );
    return component;
  }
}

export default TopBar;
