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
import { getAll } from './Api';
import { startLoading, endLoading, investorsLoaded } from './actions/index';
import { Investor } from './Common/Investor';

const store = createStore(reducers, create());

store.dispatch(startLoading());

getAll(Investor)
  .then((data) => {
    store.dispatch(endLoading());
    store.dispatch(investorsLoaded(data));
  })
  .catch((err) => {
    store.dispatch(endLoading());
    console.error(err);
  });

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
