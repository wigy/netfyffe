import React from 'react';
import Amount from './Amount';
import { Transfer } from '../types';

interface ShareChangeProps {
  amount: number;
  cashOnly?: boolean;
  transfer: Transfer;
}

function ShareChange(props: ShareChangeProps): JSX.Element {
  const { amount, transfer, cashOnly } = props;
  const target = amount < 0 && transfer.from.amount < 0
    ? transfer.from
    : transfer.to;

  return (
    <span>
      {!cashOnly && <><b><Amount signed amount={amount} decimals={4}/></b><br/></>}
      <Amount amount={target.amount} decimals={2} unit="€" />
    </span>
  );
}

export default ShareChange;
