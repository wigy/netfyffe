import * as React from 'react';
import { connect } from 'react-redux';

import { Investor } from '../Common/Investor';
import { StoreState } from '../types/index';

import './InvestorView.css';

export interface Props {
  investor?: Investor;
}

function InvestorView({ investor }: Props) {
  return (
    <div className="InvestorView">
      Investor
    </div>
  );
}

function mapStateToProps({ investor }: StoreState) {
  return {
    investor
  }
}

export default connect(mapStateToProps)(InvestorView);
