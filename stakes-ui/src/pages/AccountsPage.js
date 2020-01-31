import React, { useState } from 'react';
import { useDataRead, useDataCreation, useDataUpdate, useDataDelete } from 'rtds-client';
import { Link } from 'react-router-dom';

function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  useDataRead('accounts', setAccounts);
  const create = useDataCreation();
  const del = useDataDelete();
  const update = useDataUpdate();

  return (
    <div className="AccountsPage">
      {accounts.map((account) => <div key={account.id}>
        <Link to={`/accounts/${account.id}`}>{account.number} {account.name}</Link>
        <input onClick={() => del({ account: { id: account.id } })} type="button" value="Del" />
        <input onClick={() => update({ account: { id: account.id, name: account.name + 'X' } })} type="button" value="Update" />
      </div>)}
      <br />
      <input onClick={() => create({ account: { name: 'Foo ' + Math.random(), serviceId: 1, fundId: 1 } })} type="button" value="Add New" />
    </div>
  );
}

export default AccountsPage;
