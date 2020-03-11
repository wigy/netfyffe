import React from 'react';
import useStyles from '../styles';
import { Divider, Drawer as MuiDrawer } from '@material-ui/core';
import { Switch, Route } from 'react-router-dom';
import FundList from './FundList';
import FundTree from './FundTree';
import PieChart from '@material-ui/icons/PieChart';
import { Fund } from '../types/index.d';

interface DrawerProps {
  open: boolean;
  funds: Fund[];
}

function Drawer(props: DrawerProps): JSX.Element {
  const { funds, open } = props;
  const classes = useStyles();
  return (
    <MuiDrawer
      variant="persistent"
      open={open}
      classes={{ paper: classes.drawerPaper }}
    >
      <div className={classes.drawer}>
        <div className={classes.drawerHeader}>
          <PieChart />&nbsp;Stakes
        </div>
        <Divider />
        <Switch>
          <Route path="/accounts" component={(): JSX.Element => <FundTree funds={funds}/>} />
          <Route path="/funds" component={(): JSX.Element => <FundList funds={funds} />} />
        </Switch>
      </div>
    </MuiDrawer>
  );
}

export default Drawer;
