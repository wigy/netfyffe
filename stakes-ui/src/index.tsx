import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import App from './App';
// import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';

import Hello from './containers/Hello';

import { createStore } from 'redux';
import { enthusiasm } from './reducers/index';
// import { StoreState } from './types/index';

import { Investor } from './Common/Investor';

const store = createStore(enthusiasm, {
  investors: [new Investor({id: 1, nick: 'Wigy'}), new Investor({id: 1, nick: 'Warre'})]
});

ReactDOM.render(
  <Provider store={store}>
    <Hello />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
