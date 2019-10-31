import React from 'react';
import FundsPage from './pages/FundsPage';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Link to="/">Home</Link> |
        <Link to="/funds">Funds</Link>
        <hr />
        <Switch>
          <Route path="/funds" component={FundsPage} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
