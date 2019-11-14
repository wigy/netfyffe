import React, { useState } from 'react';
import { useDataRead } from 'rtds-client';
import { useParams } from "react-router";

function FundPage() {
  const [fund, setFund] = useState([{}]);
  const [shares, setShares] = useState([]);
  const { id } = useParams();
  useDataRead('fund', { id }, setFund);
  useDataRead('shares', { fundId: id }, setShares);

  return (
    <div className="FundPage">
      {fund[0].name}
      <br />
      {shares.map(share => (
        <div key={share.id}>
          <b>{share.date}  {share.amount} {share.investor.name}</b><br/>
          &nbsp;&nbsp;&nbsp;{share.from.account.fund.name} {share.from.account.name} {share.from.amount}<br />
          &nbsp;&nbsp;&nbsp;{share.to.account.fund.name} {share.to.account.name} {share.to.amount}<br />
          &nbsp;&nbsp;&nbsp;{JSON.stringify(share.comment.data)}
        </div>
      ))}
    </div>
  );
}

export default FundPage;
