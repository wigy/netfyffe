import React, { useState } from 'react';
import { useDataRead, useDataCreation, useDataDelete } from 'rtds-client';
import { Link } from "react-router-dom";


function InvestorsPage() {
  const [investors, setInvestors] = useState([]);
  useDataRead('investors', setInvestors);
  const create = useDataCreation();
  const del = useDataDelete();

  const id = Math.random() + '' + Math.random();

  return (
    <div className="InvestorsPage">
      {investors.map((investor) => <div key={investor.id}>
        <Link to={`/investors/${investor.id}`}>[{investor.tag}] {investor.name}</Link>
        <input onClick={() => del({investors: {id: investor.id}})} type="button" value="Del" />
      </div>)}
      <br />
      <input onClick={() => create({investors: {name: 'Foo ' + id, email: id + '.x@y', tag: id + 'Foo'}})} type="button" value="Add New" />
    </div>
  );
}

export default InvestorsPage;
