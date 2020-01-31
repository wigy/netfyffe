import React from 'react';
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
import { client } from 'rtds-client';
import Config from './Config';
import theme from './theme';
import useStyles from './styles';
import { Container, Box } from '@material-ui/core';
import Copyright from './components/Copyright';
import TilitintinContext from './context/TilitintinContext';

function App() {
  const classes = useStyles();
  client.configure({ port: Config.SERVER_PORT });

  const context = {
    tags: {}
  };
  client.try({ channel: 'get-tags' }, {
    successChannel: 'tags-success',
    successCallback: (data) => (context.tags = data),
    failChannel: 'tags-error'
  }).catch(() => console.log('Failed to locate tags.'));

  return (
    <TilitintinContext.Provider value={context}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppBar />
          <div className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
              <Switch>
                <Route exact path="/" component={HomePage} />
                <Route exact path="/dashboard" component={DashboardPage} />
                <Route path="/accounts/:id" component={AccountPage} />
                <Route path="/accounts" component={AccountsPage} />
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

export default App;
