import { DataObject } from './DataObject';
import { AccountType } from './AccountType';
import { Transaction } from './Transaction';
import { Investor } from './Investor';

export class Account extends DataObject{

  type: AccountType;
  txs: Transaction[];

  constructor(data: {
    id: number,
    type: AccountType,
  }) {
    super(data.id, 'Account');
    this.type = data.type;
    this.txs = [];
  }
}
