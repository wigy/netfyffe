import { DataObject } from './DataObject';
import { TransactionType } from './TransactionType';
import { BigNumber } from 'bignumber.js';

export class Transaction extends DataObject{

  type: TransactionType;
  amount: BigNumber;

  constructor(data: {
    id: number,
    type: TransactionType,
    amount: BigNumber
  }) {
    super(data.id, 'Transaction');
    this.type = data.type;
    this.amount = data.amount;
  }
}
