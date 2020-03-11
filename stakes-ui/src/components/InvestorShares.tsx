import React from 'react';
import PropTypes from 'prop-types';
import { Investor } from '../types/index.d';

interface InvestorSharesProps {
  investors: Investor[];
}

function InvestorShares(props: InvestorSharesProps): JSX.Element {
  const { investors } = props;
  return <div>{JSON.stringify(investors)}</div>;
}

InvestorShares.propTypes = {
  investors: PropTypes.arrayOf(PropTypes.object)
};

export default InvestorShares;
