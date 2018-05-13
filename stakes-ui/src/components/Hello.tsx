
import * as React from 'react';
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

export default Hello;
