//@flow

import React from 'react'
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


class TopBar extends React.Component<{}, {left: boolean}> {
	state = {
		left: false
	}

	toggleDrawer = (open: boolean) => () => {
		this.setState({
			left: open
		})
	}

	render() {
		const sideButtons = (
			<List>
				<ListItem button>
          		<ListItemIcon>
            		<Icon>business</Icon>
         		 </ListItemIcon>
         		<ListItemText primary="Professional" />
        		</ListItem>
        		<ListItem button>
          		<ListItemIcon>
            		<Icon>school</Icon>
         		 </ListItemIcon>
         		<ListItemText primary="Educational" />
        		</ListItem>
        		<ListItem button>
          		<ListItemIcon>
            		<Icon>code</Icon>
         		 </ListItemIcon>
         		<ListItemText primary="FOSS" />
        		</ListItem>
			</List>
		);
		return (
			<div>
			<AppBar position="static" color="default" style={{marginBottom: '24px'}}>
				<Toolbar>
					<IconButton onClick={this.toggleDrawer(true)}><Icon>menu</Icon></IconButton>
					<span style={{flex: 1}}></span>
					<IconButton href="https://github.com/frednordell" target="_blank"><img src="GitHub-Mark-Light-64px.png" height="24" alt="Github logo"/></IconButton>
					<IconButton href="https://www.linkedin.com/in/frednordell" target="_blank"><img src="In-White-66px-R.png" height="24" alt="Linkedin logo"/></IconButton>
				</Toolbar>
			</AppBar>
			<Drawer open={this.state.left} onClose={this.toggleDrawer(false)}>
				<div
		            tabIndex={0}
		            role="button"
		            onClick={this.toggleDrawer(false)}
		            onKeyDown={this.toggleDrawer(false)}
		         >
		         	<Typography variant="display1" align="center" style={{flex: 1, marginTop: '20px', marginBottom: '12px'}}>Projects</Typography>
		          	<Divider></Divider>
            		{sideButtons}
          		</div>
			</Drawer>
			</div>
		);
	}
}


export default TopBar;