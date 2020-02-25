import React from 'react';
import MuiAppBar from '@material-ui/core/AppBar';
import { Toolbar, IconButton, Button } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import useStyles from '../styles';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { useHistory } from 'react-router-dom';
import PeopleIcon from '@material-ui/icons/People';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';

function AppBar() {
  const classes = useStyles();
  const history = useHistory();

  const goto = (where) => history.push(where);

  return (
    <>
      <MuiAppBar position="absolute" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={() => {}}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Button
            color="secondary"
            variant="outlined"
            startIcon={<DashboardIcon />}
            onClick={() => goto('/dashboard')}>
              Dashboard
          </Button>
          &nbsp;
          <Button
            color="secondary"
            variant="outlined"
            startIcon={<AccountBalanceIcon />}
            onClick={() => goto('/funds')}>
              Funds
          </Button>
          &nbsp;
          <Button
            color="secondary"
            variant="outlined"
            startIcon={<AttachMoneyIcon />}
            onClick={() => goto('/accounts')}>
              Accounts
          </Button>
          &nbsp;
          <Button
            color="secondary"
            variant="outlined"
            startIcon={<PeopleIcon />}
            onClick={() => goto('/investors')}>
              Investors
          </Button>
        </Toolbar>
      </MuiAppBar>
    </>
  );
}

export default AppBar;
