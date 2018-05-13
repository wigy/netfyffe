import * as React from 'react';

import './App.css';

import { Investor } from './Common/Investor';
import { getAll } from './Stores/Api';

class App extends React.Component {

  public render() {
    getAll(Investor)
      .then((data) => {
        console.log(data);
      })

    return (
      <div className="App">
        <h1>Stakes</h1>
      </div>
    );
  }
}

export default App;
