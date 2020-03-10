import React from 'react';
import { client, useLoginStatus } from 'rtds-client';
import { useHistory } from 'react-router-dom';

function HomePage(): JSX.Element {
  const isLoggedIn = useLoginStatus();
  const history = useHistory();

  if (isLoggedIn) {
    history.push('/dashboard');
    return <span></span>;
  }

  async function login(): Promise<void> {
    await client.login({ user: 'tommi.ronkainen@gmail.com', password: 'pass' });
    // TODO: Handle promise rejection.
    history.push('/dashboard');
  }

  return (
    <div className="HomePage">
      <p>
        <input onChange={(): void => undefined} type="text" value="tommi.ronkainen@gmail.com"></input><br />
        <input onChange={(): void => undefined} type="password" value="pass"></input><br />
        <input onClick={(): Promise<void> => login()} type="button" value="Login"></input>
      </p>
    </div>
  );
}

export default HomePage;
