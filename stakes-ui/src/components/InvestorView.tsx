import * as React from 'react';
import { connect } from 'react-redux';

import { Investor } from '../Common/Investor';
import { StoreState } from '../store/StoreState';

import './InvestorView.css';

export interface Props {
  investor?: Investor;
}

function InvestorView({ investor }: Props) {
  return (
    <div className="InvestorView">
      <h1>{investor ? investor.fullName : ''}</h1>
    </div>
  );
}

// TODO: Type of ownProps?
function mapStateToProps({ investors }: StoreState, ownProps: any) {
  const id = parseInt(ownProps.match.params.id, 10);
  const match = investors.filter(investor => investor.id === id);
  return {
    investor: match.length ? match[0] : new Investor({id: 0})
  }
}

export default connect(mapStateToProps)(InvestorView);
