import React from 'react';
import Amount from './Amount';

interface PercentProps {
  amount: number;
  decimals?: number;
}

function Percent(props: PercentProps): JSX.Element {
  const { amount, decimals } = props;

  return (
    <Amount amount={amount * 100} decimals={decimals !== undefined ? decimals : 1} unit ="%"/>
  );
}

export default Percent;
