import React, { Component, useEffect } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import { Icon } from "@material-ui/core";

type State = {
  pro: boolean;
  edu: boolean;
  non: boolean;
  foss: boolean;
};

type Props = {};

class SideButtonList extends Component<Props, State> {
  state = {
    pro: false,
    edu: false,
    non: false,
    foss: false,
  };

  toggleExpand = (exp: string, open: boolean) => () => {
    const newState = { [exp]: open } as Pick<State, keyof State>;
    this.setState(newState);
  };

  render() {
    return (
      <List>
        <ListItem button onClick={this.toggleExpand("edu", !this.state.edu)}>
          <ListItemIcon>
            <Icon>school</Icon>
          </ListItemIcon>
          <ListItemText primary="Educational" />
          {this.state.edu ? (
            <IconButton>
              <Icon>expand_less</Icon>
            </IconButton>
          ) : (
            <IconButton>
              <Icon>expand_more</Icon>
            </IconButton>
          )}
        </ListItem>
        <Collapse in={this.state.edu} timeout="auto" unmountOnExit>
          <List component="nav" disablePadding>
            <ListItem
              button
              className="side-button-list-nested"
              component="a"
              target="_blank"
              href="https://github.com/frednordell/summaries"
            >
              <ListItemIcon>
                <Icon>link</Icon>
              </ListItemIcon>
              <ListItemText primary="Course summaries" />
            </ListItem>
          </List>
        </Collapse>
        <ListItem button onClick={this.toggleExpand("non", !this.state.non)}>
          <ListItemIcon>
            <Icon>code</Icon>
          </ListItemIcon>
          <ListItemText primary="Non-profit" />
          {this.state.non ? (
            <IconButton>
              <Icon>expand_less</Icon>
            </IconButton>
          ) : (
            <IconButton>
              <Icon>expand_more</Icon>
            </IconButton>
          )}
        </ListItem>
        <Collapse in={this.state.non} timeout="auto" unmountOnExit>
          <List component="nav" disablePadding>
            <ListItem
              button
              className="side-button-list-nested"
              component="a"
              href="https://github.com/Dsek-LTH"
              target="_blank"
            >
              <ListItemIcon>
                <Icon>link</Icon>
              </ListItemIcon>
              <ListItemText primary="D-sek LTH" />
            </ListItem>
          </List>
        </Collapse>
        <ListItem button onClick={this.toggleExpand("foss", !this.state.foss)}>
          <ListItemIcon>
            <Icon>public</Icon>
          </ListItemIcon>
          <ListItemText primary="FOSS & Personal" />
          {this.state.foss ? (
            <IconButton>
              <Icon>expand_less</Icon>
            </IconButton>
          ) : (
            <IconButton>
              <Icon>expand_more</Icon>
            </IconButton>
          )}
        </ListItem>
        <Collapse in={this.state.foss} timeout="auto" unmountOnExit>
          <List component="nav" disablePadding>
            <ListItem
              button
              className="side-button-list-nested"
              component="a"
              href="https://github.com/frednordell/frednordell.com"
              target="_blank"
            >
              <ListItemIcon>
                <Icon>link</Icon>
              </ListItemIcon>
              <ListItemText primary="frednordell.com" />
            </ListItem>
            {/* <ListItem
              button
              className={classes.nested}
              component="a"
              href="https://github.com/frednordell/skaggkollen"
              target="_blank"
            >
              <ListItemText inset primary="skäggkollen.nu" />
              <ListItemIcon>
                <Icon>link</Icon>
              </ListItemIcon>
            </ListItem> */}
          </List>
        </Collapse>
      </List>
    );
  }
}

export default SideButtonList;
