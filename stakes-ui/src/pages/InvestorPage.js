import React, { useState } from 'react';
import { useDataRead } from 'rtds-client';
import { useParams } from "react-router";

function InvestorPage() {
  const [investor, setInvestor] = useState([]);
  const { id } = useParams();
  useDataRead('investor', { id }, setInvestor);

  if (!investor.length) {
    return '';
  }

  return (
    <div className="InvestorPage">
      Investor {investor[0].name}
    </div>
  );
}

export default InvestorPage;
