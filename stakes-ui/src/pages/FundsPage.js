import React, { useState } from 'react';
import { useDataSync } from 'rtds-client';


function FundsPage() {
  const [funds, setFunds] = useState([]);
  useDataSync('funds', setFunds);

  return (
    <div className="FundsPage">
      <p>
        {JSON.stringify(funds)}
      </p>
    </div>
  );
}

export default FundsPage;
