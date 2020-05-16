import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Link from "../src/Link";

type State = {
  pro: boolean;
  edu: boolean;
  non: boolean;
  foss: boolean;
};

type Props = {
  classes: { nested: Object };
  left: boolean;
  toggleDrawer: Function;
};

const styles = (theme) => ({
  nested: {
    paddingLeft: theme.spacing(3),
  },
});

class SideDrawer extends Component<Props, State> {
  state = {
    pro: false,
    edu: false,
    non: false,
    foss: false,
  };

  toggleExpand = (exp: string, open: boolean) => () => {
    this.setState({
      [exp]: open,
    });
  };

  render() {
    const { classes } = this.props;
    const sideButtons = (
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
              className={classes.nested}
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
              className={classes.nested}
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
              className={classes.nested}
              component="a"
              href="https://github.com/frednordell/fred.nordells.nu"
              target="_blank"
            >
              <ListItemIcon>
                <Icon>link</Icon>
              </ListItemIcon>
              <ListItemText primary="fred.nordells.nu" />
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
    return (
      <Drawer
        open={this.props.left}
        onClose={this.props.toggleDrawer(false)}
        ModalProps={{
          keepMounted: true,
          /* Better open performance on mobile.*/
        }}
      >
        <div onKeyDown={this.props.toggleDrawer(false)}>
          <Grid
            container
            direction="row"
            alignItems="center"
            justify="space-between"
          >
            <Typography
              variant="h6"
              align="center"
              style={{ marginLeft: "18px" }}
            >
              Projects
            </Typography>
            <IconButton onClick={this.props.toggleDrawer(false)}>
              <Icon>chevron_left</Icon>
            </IconButton>
          </Grid>
          <Divider></Divider>
          {sideButtons}
          <Link href="/blog">Go to Blog</Link>
        </div>
      </Drawer>
    );
  }
}

export default withStyles(styles)(SideDrawer);
