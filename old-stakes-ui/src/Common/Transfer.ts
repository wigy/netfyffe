import { BigNumber } from 'bignumber.js';
import { DataObject } from './DataObject';
import { TransferType } from './TransferType';

export class Transfer extends DataObject{

  public type: TransferType;
  public amount: BigNumber;

  constructor(data: {
    id: number,
    type: TransferType,
    amount: BigNumber
  }) {
    super('Transfer', 'transfers', data.id);
    this.type = data.type;
    this.amount = data.amount;
  }
}
