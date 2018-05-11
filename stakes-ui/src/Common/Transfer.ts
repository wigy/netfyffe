import { DataObject } from './DataObject';
import { TransferType } from './TransferType';
import { BigNumber } from 'bignumber.js';

export class Transfer extends DataObject{

  type: TransferType;
  amount: BigNumber;

  constructor(data: {
    id: number,
    type: TransferType,
    amount: BigNumber
  }) {
    super(data.id, 'Transfer');
    this.type = data.type;
    this.amount = data.amount;
  }
}
