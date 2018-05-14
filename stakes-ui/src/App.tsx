import * as React from 'react';
import { Route } from 'react-router-dom';

import './App.css';

import InvestorList from './components/InvestorList';

class App extends React.Component {

  public render() {
    return (
      <div className="App">
        <Route exact={true} path="/investors" component={InvestorList}/>
        <Route path="/investors/:investorsId" component={InvestorList}/>
      </div>
    );
  }
}

export default App;
