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
          <b>{share.date}  {share.amount} {share.investorName}</b><br/>
          &nbsp;&nbsp;&nbsp;{share.fromFundName} {share.fromAccountName} {share.fromValueAmount}<br />
          &nbsp;&nbsp;&nbsp;{share.toFundName} {share.toAccountName} {share.toValueAmount}<br />
          &nbsp;&nbsp;&nbsp;{JSON.stringify(share.comments)}
        </div>
      ))}
    </div>
  );
}

export default FundPage;
