import React, { useState } from 'react';
import { useDataSync } from 'rtds-client';
import { Link } from "react-router-dom";


function FundsPage() {
  const [funds, setFunds] = useState([]);
  useDataSync('funds', setFunds);

  return (
    <div className="FundsPage">
      {funds.map((fund) => <div key={fund.id}>
        <Link to={`/funds/${fund.id}`}>[{fund.tag}] {fund.name}</Link>
      </div>)}
    </div>
  );
}

export default FundsPage;
