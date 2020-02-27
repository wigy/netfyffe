import React from 'react';
import PropTypes from 'prop-types';

function Amount(props) {
  const { amount, signed, unit } = props;
  let decimals = props.decimals || 0;
  const isNegative = amount < 0;
  const num = Math.abs(amount);
  const sep = num.toString().indexOf('.') < 0 ? '.' : '';
  const [body, digits] = (num + sep + '000000000000000000').split('.');
  const bodyParts = Number(body).toLocaleString().split(/[^0-9]/);
  // If digits is given as X.5, add optionally one more digit.
  if (decimals - Math.floor(decimals)) {
    decimals = Math.floor(decimals);
    if (digits.substr(decimals, 1) !== '0') {
      decimals++;
    }
  }

  const __html = (
    (isNegative ? '&mdash;' : (signed ? '+' : ''))) +
    bodyParts.join('&nbsp;') +
    ',' +
    digits.substr(0, decimals) +
    (unit ? `&nbsp;${unit}` : '');

  return (
    <span dangerouslySetInnerHTML={{ __html }}/>
  );
}

Amount.propTypes = {
  amount: PropTypes.number,
  signed: PropTypes.bool,
  decimals: PropTypes.number,
  unit: PropTypes.string
};

export default Amount;
