import React, { useState } from 'react';
import { useDataRead } from 'rtds-client';
import { useParams } from 'react-router';

function AccountPage() {
  const [account, setAccount] = useState([]);
  const { id } = useParams();
  useDataRead('account', { id: parseInt(id) }, setAccount);

  if (!account.length) {
    return '';
  }

  return (
    <div className="AccountPage">
      Account {account[0].name}
      <pre>
        {JSON.stringify(account[0], null, 4)}
      </pre>
    </div>
  );
}

export default AccountPage;
