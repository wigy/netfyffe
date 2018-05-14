import * as React from 'react';
import { connect, Dispatch } from 'react-redux';

import * as actions from '../actions/';
import { StoreState } from '../types/index';
import { Investor } from '../Common/Investor';

import './Hello.css';

export interface Props {
  investors?: Investor[];
  onIncrement?: () => void;
  onDecrement?: () => void;
}

function Hello({ investors, onIncrement, onDecrement }: Props) {
  return (
    <div className="hello">
      <div className="greeting">
        Stakes
      </div>
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
    onDecrement: () => dispatch(actions.startLoading()),
    onIncrement: () => dispatch(actions.startLoading()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Hello);
