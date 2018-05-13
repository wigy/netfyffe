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

const store = createStore(enthusiasm, {
  investors: ['Eka I', 'Toka I']
});

ReactDOM.render(
  <Provider store={store}>
    <Hello />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
