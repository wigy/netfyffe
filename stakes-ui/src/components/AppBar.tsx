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

interface AppBarProps {
  className: string;
  onMenuClick: () => void;
}

function AppBar(props: AppBarProps): JSX.Element {
  const { className, onMenuClick } = props;
  const classes = useStyles();
  const history = useHistory();

  const goto = (where: string): void => history.push(where);

  return (
    <>
      <MuiAppBar position="fixed" className={className}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={(): void => onMenuClick()}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Button
            variant="outlined"
            className={classes.toolBarButton}
            startIcon={<DashboardIcon />}
            onClick={(): void => goto('/dashboard')}>
              Dashboard
          </Button>
          &nbsp;
          <Button
            variant="outlined"
            className={classes.toolBarButton}
            startIcon={<AccountBalanceIcon />}
            onClick={(): void => goto('/funds')}>
              Funds
          </Button>
          &nbsp;
          <Button
            variant="outlined"
            className={classes.toolBarButton}
            startIcon={<AttachMoneyIcon />}
            onClick={(): void => goto('/accounts')}>
              Accounts
          </Button>
          &nbsp;
          <Button
            variant="outlined"
            className={classes.toolBarButton}
            startIcon={<PeopleIcon />}
            onClick={(): void => goto('/investors')}>
              Investors
          </Button>
        </Toolbar>
      </MuiAppBar>
    </>
  );
}

export default AppBar;
