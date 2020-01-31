import React, { useState } from 'react';
import { useDataRead } from 'rtds-client';
import { Link } from 'react-router-dom';

function FundsPage() {
  const [funds, setFunds] = useState([]);
  useDataRead('funds', setFunds);

  return (
    <div className="FundsPage">
      {funds.map((fund) => <div key={fund.id}>
        <Link to={`/funds/${fund.id}`}>[{fund.tag}] {fund.name}</Link>
        <ul>
          {fund.accounts.map(account => <li key={account.id}>
            <Link to={`/accounts/${account.id}`}>{account.number} {account.name}</Link>
          </li>)}
        </ul>
      </div>)}
    </div>
  );
}

export default FundsPage;
