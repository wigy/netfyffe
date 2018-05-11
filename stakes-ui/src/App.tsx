import * as React from 'react';

import './App.css';

import { Account } from './Common/Account';
import { Investor } from './Common/Investor';
import Api from './Stores/Api';

class App extends React.Component {
  public render() {

    Api.getAll(Investor)
      .then((data) => console.log(data));
    Api.getAll(Account)
      .then((data) => console.log(data));

    return (
      <div className="App">
        <h1>Stakes</h1>
      </div>
    );
  }
}

export default App;
