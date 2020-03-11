import React, { useState } from 'react';
import { useDataRead } from 'rtds-client';
import { useParams } from 'react-router';
import { Investor } from '../types';

function InvestorPage(): JSX.Element {
  const [investor, setInvestor] = useState([{} as Investor]);
  const { id } = useParams();
  useDataRead('investor', { id: parseInt(id) }, setInvestor);

  if (!investor.length) {
    return <span></span>;
  }

  return (
    <div className="InvestorPage">
      Investor {investor[0].name}
    </div>
  );
}

export default InvestorPage;
