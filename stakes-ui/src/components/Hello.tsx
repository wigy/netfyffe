import './Hello.css';

import * as React from 'react';

export interface Props {
  investors?: string[];
  onIncrement?: () => void;
  onDecrement?: () => void;
}

function Hello({ investors, onIncrement, onDecrement }: Props) {

  return (
    <div className="hello">
      <div className="greeting">
        Hello!
      </div>
      <div>
        <button onClick={onDecrement}>-</button>
        <button onClick={onIncrement}>+</button>
      </div>
    </div>
  );
}

export default Hello;
