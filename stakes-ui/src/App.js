import React, { useState } from 'react';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import AccountPage from './pages/AccountPage';
import AccountsPage from './pages/AccountsPage';
import DashboardPage from './pages/DashboardPage';
import FundPage from './pages/FundPage';
import FundsPage from './pages/FundsPage';
import InvestorPage from './pages/InvestorPage';
import InvestorsPage from './pages/InvestorsPage';
import HomePage from './pages/HomePage';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AppBar from './components/AppBar';
import { useDataRead } from 'rtds-client';
import theme from './theme';
import useStyles from './styles';
import { Container, Box, Divider, Drawer } from '@material-ui/core';
import Copyright from './components/Copyright';
import TilitintinContext from './context/TilitintinContext';
import FundTree from './components/FundTree';
import FundList from './components/FundList';
import { PropTypes } from 'prop-types';

function App(props) {
  const [open, setOpen] = useState(true);
  const [funds, setFunds] = useState([]);
  const classes = useStyles();

  const context = {
    tags: props.tags
  };

  useDataRead('funds', setFunds);

  const drawer = (
    <div className={classes.drawer}>
      <div className={classes.drawerHeader} />
      <Divider />
      <Switch>
        <Route path="/accounts" component={() => <FundTree funds={funds}/>} />
        <Route path="/funds" component={() => <FundList funds={funds} />} />
      </Switch>
    </div>
  );
  console.log(theme);
  return (
    <TilitintinContext.Provider value={context}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppBar
            className={clsx(classes.appBar, {
              [classes.appBarShift]: open
            })}
            onMenuClick={() => setOpen(!open)}
          />
          <Drawer
            variant="persistent"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={open}
            classes={{ paper: classes.drawerPaper }}
          >
            {drawer}
          </Drawer>
          <div className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
              <Switch>
                <Route exact path="/" component={HomePage} />
                <Route exact path="/dashboard" component={DashboardPage} />
                <Route path="/accounts/:id" component={() => <AccountPage funds={funds}/>} />
                <Route path="/accounts" component={() => <AccountsPage funds={funds}/>} />
                <Route path="/investors/:id" component={InvestorPage} />
                <Route path="/investors" component={InvestorsPage} />
                <Route path="/funds/:id" component={FundPage} />
                <Route path="/funds" component={FundsPage} />
              </Switch>
              <Box pt={4}>
                <Copyright />
              </Box>
            </Container>
          </div>
        </Router>
      </ThemeProvider>
    </TilitintinContext.Provider>
  );
}

App.propTypes = {
  tags: PropTypes.object
};

export default App;
