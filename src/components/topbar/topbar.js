//@flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Icon from '@material-ui/core/Icon'
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid'
import Collapse from '@material-ui/core/Collapse'

type State = {
	left: boolean,
	pro: boolean,
	edu: boolean,
	non: boolean,
	foss: boolean
};

const styles = theme => ({
	nested: {
		paddingLeft: theme.spacing.unit * 4
	}
})

class TopBar extends React.Component<{classes: {nested: {}}}, State> {
	state = {
		left: false,
		pro: false,
		edu: false,
		non: false,
		foss: false
	}

	toggleDrawer = (open: boolean) => () => {
		this.setState({
			left: open
		})
	}

	toggleExpand = (exp: string, open: boolean) => () => {
		this.setState({
			[exp]: open
		})
	}

	render() {
		const { classes } = this.props;
		const sideButtons = (
			<List>
				<ListItem button onClick={this.toggleExpand('pro', !this.state.pro)}>
          		<ListItemIcon>
            		<Icon>business</Icon>
         		 </ListItemIcon>
         		<ListItemText primary="Professional" />
         		{this.state.pro ? <IconButton><Icon>expand_less</Icon></IconButton> : <IconButton><Icon>expand_more</Icon></IconButton>}
        		</ListItem>
        		<Collapse in={this.state.pro} timeout="auto" unmountOnExit>
            		<List component="div" disablePadding>
              			<ListItem button className={classes.nested}>
	                		<ListItemIcon>
	                  			<Icon>home</Icon>
	                		</ListItemIcon>
	                		<ListItemText inset primary="Starred" />
              			</ListItem>
           			 </List>
          		</Collapse>
        		<ListItem button onClick={this.toggleExpand('edu', !this.state.edu)}>
          		<ListItemIcon>
            		<Icon>school</Icon>
         		 </ListItemIcon>
         		<ListItemText primary="Educational" />
         		{this.state.edu ? <IconButton><Icon>expand_less</Icon></IconButton> : <IconButton><Icon>expand_more</Icon></IconButton>}
        		</ListItem>
        		<Collapse in={this.state.edu} timeout="auto" unmountOnExit>
            		<List component="div" disablePadding>
              			<ListItem button className={classes.nested}>
	                		<ListItemIcon>
	                  			<Icon>home</Icon>
	                		</ListItemIcon>
	                		<ListItemText inset primary="Starred" />
              			</ListItem>
           			 </List>
          		</Collapse>
        		<ListItem button onClick={this.toggleExpand('non', !this.state.non)}>
          		<ListItemIcon>
            		<Icon>code</Icon>
         		 </ListItemIcon>
         		<ListItemText primary="Non-profit" />
         		{this.state.non ? <IconButton><Icon>expand_less</Icon></IconButton> : <IconButton><Icon>expand_more</Icon></IconButton>}
        		</ListItem>
        		<Collapse in={this.state.non} timeout="auto" unmountOnExit>
            		<List component="div" disablePadding>
              			<ListItem button className={classes.nested}>
	                		<ListItemIcon>
	                  			<Icon>home</Icon>
	                		</ListItemIcon>
	                		<ListItemText inset primary="Starred" />
              			</ListItem>
           			 </List>
          		</Collapse>
        		<ListItem button onClick={this.toggleExpand('foss', !this.state.foss)}>
          		<ListItemIcon>
            		<Icon>public</Icon>
         		 </ListItemIcon>
         		<ListItemText primary="FOSS & Personal" />
         		{this.state.foss ? <IconButton><Icon>expand_less</Icon></IconButton> : <IconButton><Icon>expand_more</Icon></IconButton>}
        		</ListItem>
        		<Collapse in={this.state.foss} timeout="auto" unmountOnExit>
            		<List component="div" disablePadding>
              			<ListItem button className={classes.nested}>
	                		<ListItemIcon>
	                  			<Icon>home</Icon>
	                		</ListItemIcon>
	                		<ListItemText inset primary="Starred" />
              			</ListItem>
           			 </List>
          		</Collapse>
			</List>
		);
		return (
			<div>
			<AppBar position="static" color="default" style={{marginBottom: '24px'}}>
				<Toolbar>
					<IconButton onClick={this.toggleDrawer(true)}><Icon>menu</Icon></IconButton>
					<span style={{flex: 1}}></span>
					<IconButton href="https://github.com/frednordell" target="_blank" rel="noopener noreferrer">
						<img src="GitHub-Mark-Light-64px.png" height="24" alt="Github logo"/>
					</IconButton>
					<IconButton href="https://www.linkedin.com/in/frednordell" target="_blank" rel="noopener noreferrer">
						<img src="In-White-66px-R.png" height="24" alt="Linkedin logo"/>
					</IconButton>
					<IconButton href="mailto:fred@nordells.nu" target="_blank" rel="noopener noreferrer">
						<Icon>mail</Icon>
					</IconButton>
				</Toolbar>
			</AppBar>
			<Drawer open={this.state.left} onClose={this.toggleDrawer(false)} ModalProps={{keepMounted: true, /* Better open performance on mobile.*/}}>
				<div onKeyDown={this.toggleDrawer(false)}>
					<Grid container direction="row" alignItems="center" justify="space-between">
						<Typography variant="title" align="center" style={{marginLeft: '18px'}}>Projects</Typography>
						<IconButton onClick={this.toggleDrawer(false)}><Icon>chevron_left</Icon></IconButton>
					</Grid>
		          	<Divider></Divider>
            		{sideButtons}
          		</div>
			</Drawer>
			</div>
		);
	}
}


export default withStyles(styles)(TopBar);