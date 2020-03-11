import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { client } from 'rtds-client';
import Config from './Config';

client.configure({ port: Config.SERVER_PORT });
client.try({ channel: 'get-tags' }, {
  successChannel: 'tags-success',
  // eslint-disable-next-line react/no-render-return-value
  successCallback: (data) => ReactDOM.render(<App tags={data} />, document.getElementById('root')),
  failChannel: 'tags-error'
})
  .catch(() => console.log('Failed to locate tags.'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
