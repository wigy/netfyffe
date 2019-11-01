import React, { useState } from 'react';
import { useDataSync } from 'rtds-client';
import { useParams } from "react-router";

function FundPage() {
  const [fund, setFund] = useState([{}]);
  const { id } = useParams();
  useDataSync('fund', { id }, setFund);

  return (
    <div className="FundPage">
      Fund {fund[0].name}
    </div>
  );
}

export default FundPage;
