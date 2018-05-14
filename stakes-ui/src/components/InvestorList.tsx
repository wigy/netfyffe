import * as React from 'react';
import { connect, Dispatch } from 'react-redux';

import * as actions from '../actions/';
import { StoreState } from '../types/index';
import { Investor } from '../Common/Investor';

import './InvestorList.css';

export interface Props {
  investors?: Investor[];
  // TODO: Just sample. Remove.
  onIncrement?: () => void;
  onDecrement?: () => void;
}

function InvestorList({ investors, onIncrement, onDecrement }: Props) {
  return (
    <div className="InvestorList">
      {investors && investors.map((investor, index) => <div key={index}>{investor.nick}</div>)}
      <div>
        <button onClick={onDecrement}>-</button>
        <button onClick={onIncrement}>+</button>
      </div>
    </div>
  );
}

function mapStateToProps({ investors }: StoreState) {
  return {
    investors
  }
}
function mapDispatchToProps(dispatch: Dispatch<actions.StartLoading>) {
  return {
    // TODO: Just sample. Remove.
    onDecrement: () => dispatch(actions.startLoading()),
    onIncrement: () => dispatch(actions.startLoading()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InvestorList);
