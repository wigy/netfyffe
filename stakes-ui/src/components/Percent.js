import React from 'react';
import PropTypes from 'prop-types';
import Amount from './Amount';

function Percent(props) {
  const { amount, decimals } = props;

  return (
    <Amount amount={amount * 100} decimals={decimals !== undefined ? decimals : 1} unit ="%"/>
  );
}

Percent.propTypes = {
  amount: PropTypes.number,
  decimals: PropTypes.number
};

export default Percent;
