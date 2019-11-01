import React from 'react';
import DashboardPage from './pages/DashboardPage';
import FundPage from './pages/FundPage';
import FundsPage from './pages/FundsPage';
import InvestorsPage from './pages/InvestorsPage';
import HomePage from './pages/HomePage';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Link to="/">Home</Link> | <Link to="/funds">Funds</Link> | <Link to="/investors">Investors</Link>
        <hr />
        <Switch>
          <Route path="/dashboard" component={DashboardPage} />
          <Route path="/investors" component={InvestorsPage} />
          <Route path="/funds/:id" component={FundPage} />
          <Route path="/funds" component={FundsPage} />
          <Route path="/" component={HomePage} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
