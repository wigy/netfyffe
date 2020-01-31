import React, { useState } from 'react';
import { useDataRead, useDataCreation, useDataUpdate, useDataDelete } from 'rtds-client';
import { Link } from 'react-router-dom';

function InvestorsPage() {
  const [investors, setInvestors] = useState([]);
  useDataRead('investors', setInvestors);
  const create = useDataCreation();
  const del = useDataDelete();
  const update = useDataUpdate();

  const id = Math.random() + '' + Math.random();

  return (
    <div className="InvestorsPage">
      {investors.map((investor) => <div key={investor.id}>
        <Link to={`/investors/${investor.id}`}>[{investor.tag}] {investor.name} ({investor.email})</Link>
        <input onClick={() => del({ investor: { id: investor.id } })} type="button" value="Del" />
        <input onClick={() => update({ investor: { id: investor.id, email: id + '@email.fi' } })} type="button" value="Update" />
      </div>)}
      <br />
      <input onClick={() => create({ investor: { name: 'Foo ' + id, email: id + '.x@y', tag: id + 'Foo' } })} type="button" value="Add New" />
    </div>
  );
}

export default InvestorsPage;
