import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import App from './App';
// import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';

import Hello from './components/Hello';

import { createStore } from 'redux';
import { enthusiasm } from './reducers/index';
import { create } from './types/index';

import { startLoading, endLoading, investorsLoaded } from './actions/index';
import { Investor } from './Common/Investor';
import { getAll } from './Stores/Api';

const store = createStore(enthusiasm, create());

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
    <Hello />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
