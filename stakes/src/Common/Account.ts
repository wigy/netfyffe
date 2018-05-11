import { Collection } from './Types/Collection';
import { DataObject } from './DataObject';
import { AccountType } from './AccountType';
import { Transfer } from './Transfer';
import { Investor } from './Investor';

export class Account extends DataObject{

  type: AccountType;
  txs: Transfer[];

  constructor(data: {
    id: number,
    type: AccountType,
  }) {
    super(data.id, 'Account');
    this.type = data.type;
    this.txs = [];
  }

  collections() : Collection[] {
    return [{name: 'transfers', linkField: 'accountId', tableName: 'transfers'}];
  }
}
