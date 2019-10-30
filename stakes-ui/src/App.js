import React from 'react';
import './App.css';

import RTDSClient from 'rtds-client';

const config = {
  SERVER_PORT: 3201
}

function App() {
  const loc = document.location;
  const url = `${loc.protocol}//${loc.hostname}:${config.SERVER_PORT}`;
  const socket = new RTDSClient(url);
  socket.send('login', {user: 'tommi.ronkainen@gmail.com', password: 'pass'});
  socket.send('subscribe', {type: 'investors'});
  return (
    <div className="App">
      <p>
        App.
      </p>
    </div>
  );
}

export default App;
