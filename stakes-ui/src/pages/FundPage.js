import React, { useState } from 'react';
import { useDataRead } from 'rtds-client';
import { useParams } from "react-router";

function FundPage() {
  const [fund, setFund] = useState([{}]);
  const [shares, setShares] = useState([]);

  const { id } = useParams();
  useDataRead('fund', { id }, setFund);
  useDataRead('shares', { 'fundId': id }, setShares);

  return (
    <div className="FundPage">
      <h1>{fund[0].name}</h1>
      <br />
      {shares.map(share => (
        <div key={share.id}>
          <b>{share.date}  {share.amount} {share.investor.name}</b><br/>
          &nbsp;&nbsp;&nbsp;{share.transfer.from.account.fund.name} {share.transfer.from.account.name} {share.transfer.from.amount}<br />
          &nbsp;&nbsp;&nbsp;{share.transfer.to.account.fund.name} {share.transfer.to.account.name} {share.transfer.to.amount}<br />
          &nbsp;&nbsp;&nbsp;{JSON.stringify(share.transfer.comments.data)}<br />
        </div>
      ))}
    </div>
  );
}

export default FundPage;
