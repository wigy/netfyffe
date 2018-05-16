import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';

import App from './App';

import './index.css';

import { reducers } from './reducers/index';
import { create } from './types/index';
import { StoreManager } from './store/StoreManager';

const store = createStore(reducers, create());
const manager = new StoreManager(store);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App manager={manager}/>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
