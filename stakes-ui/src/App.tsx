import * as React from 'react';
import { Route } from 'react-router-dom';

import './App.css';

import InvestorList from './components/InvestorList';

class App extends React.Component {

  public render() {
    return (
      <div className="App">
        <div className="TopPanel Panel">
        Top
        </div>
        <div className="SidePanel Panel">
          <div className="Frame">
            <Route path="/investors" component={InvestorList}/>
          </div>
        </div>
        <div className="MainTopPanel Panel">
          <div className="Frame">
          Main top
          </div>
        </div>
        <div className="MainPanel Panel">
          <div className="Frame">
          Main
          </div>
        </div>
      </div>
    );
  }
}

export default App;
