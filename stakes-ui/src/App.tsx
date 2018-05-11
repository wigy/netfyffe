import * as React from 'react';

import './App.css';

import Api from './Stores/Api';

class App extends React.Component {
  public render() {

    Api.investors();

    return (
      <div className="App">
        <h1>Stakes</h1>
      </div>
    );
  }
}

export default App;
