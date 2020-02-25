import React from 'react';
import PropTypes from 'prop-types';
import Amount from './Amount';

function ShareChange(props) {
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

ShareChange.propTypes = {
  amount: PropTypes.number,
  cashOnly: PropTypes.bool,
  transfer: PropTypes.object
};

export default ShareChange;
