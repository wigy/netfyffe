import React from 'react';
import PropTypes from 'prop-types';

function Amount(props) {
  const { amount, signed, decimals, unit } = props;
  const isNegative = amount < 0;
  const num = Math.abs(amount);
  const sep = num.toString().indexOf('.') < 0 ? '.' : '';
  const [body, digits] = (num + sep + '000000000000000000').split('.');
  const bodyParts = Number(body).toLocaleString().split(/[^0-9]/);

  return (
    <span>
      {isNegative
        ? <span>&mdash;</span>
        : (signed ? '+' : '')
      }
      {bodyParts.join(' ')},
      {digits.substr(0, decimals === undefined ? 2 : decimals)}
      {unit && ` ${unit}`}
    </span>
  );
}

Amount.propTypes = {
  amount: PropTypes.number,
  signed: PropTypes.bool,
  decimals: PropTypes.number,
  unit: PropTypes.string
};

export default Amount;
