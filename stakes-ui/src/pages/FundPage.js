import React, { useState } from 'react';
import { useDataRead, useDataUpdate } from 'rtds-client';
import { useParams } from "react-router";

function FundPage() {
  const [fund, setFund] = useState([{}]);
  const { id } = useParams();
  const update = useDataUpdate();
  useDataRead('fund', { id }, setFund);

  const name = Math.random() + '' + Math.random();
  return (
    <div className="FundPage">
      Fund {fund[0].name}
      <br />
      <input onClick={() => update({fund: {id, name }})} type="button" value="Change Name"></input>
    </div>
  );
}

export default FundPage;
