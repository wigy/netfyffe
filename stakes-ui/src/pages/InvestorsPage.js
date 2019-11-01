import React, { useState } from 'react';
import { useDataSync, useDataCreation } from 'rtds-client';
import { Link } from "react-router-dom";


function InvestorsPage() {
  const [investors, setInvestors] = useState([]);
  useDataSync('investors', setInvestors);
  const create = useDataCreation();

  const id = Math.random() + '' + Math.random();

  return (
    <div className="InvestorsPage">
      {investors.map((investor) => <div key={investor.id}>
        <Link to={`/investors/${investor.id}`}>[{investor.tag}] {investor.name}</Link>
      </div>)}
      <br />
      <input onClick={() => create({investors: {name: 'Foo ' + id, email: id + '.x@y', tag: id + 'Foo'}})} type="button" value="Add New"></input>
    </div>
  );
}

export default InvestorsPage;
