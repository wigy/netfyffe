import React from 'react';
import useStyles from '../styles';
import { Divider, Drawer as MuiDrawer } from '@material-ui/core';
import { Switch, Route } from 'react-router-dom';
import FundList from './FundList';
import FundTree from './FundTree';
import PieChart from '@material-ui/icons/PieChart';
import { PropTypes } from 'prop-types';

function Drawer(props) {
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
          <Route path="/accounts" component={() => <FundTree funds={funds}/>} />
          <Route path="/funds" component={() => <FundList funds={funds} />} />
        </Switch>
      </div>
    </MuiDrawer>
  );
}

Drawer.propTypes = {
  open: PropTypes.bool.isRequired,
  funds: PropTypes.arrayOf(PropTypes.object)
};

export default Drawer;
