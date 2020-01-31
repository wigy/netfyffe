import React from 'react';
import PropTypes from 'prop-types';

function InvestorShares(props) {
  const { investors } = props;
  return <div>{JSON.stringify(investors.sort((a, b) => b.shares - a.shares))}</div>;
}

InvestorShares.propTypes = {
  investors: PropTypes.arrayOf(PropTypes.object)
};

export default InvestorShares;
