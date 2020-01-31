import React from 'react';
import PropTypes from 'prop-types';

function Amount(props) {
  const { amount, signed, decimals } = props;
  const isNegative = amount < 0;
  const num = Math.abs(amount);
  const sep = num.toString().indexOf('.') < 0 ? '.' : '';
  const [body, digits] = (num + sep + '000000000000000000').split('.');
  return (
    <span>
      {isNegative
        ? <span>&mdash;</span>
        : (signed ? '+' : '')
      }
      {body},
      {digits.substr(0, decimals === undefined ? 2 : decimals)}
    </span>
  );
}

Amount.propTypes = {
  amount: PropTypes.number,
  signed: PropTypes.bool,
  decimals: PropTypes.number
};

export default Amount;
