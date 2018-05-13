import { AccountType } from './AccountType';
import { DataObject } from './DataObject';
import { Transfer } from './Transfer';
import { ICollection } from './Types';

export class Account extends DataObject{

  public type: AccountType;
  public transfers: Transfer[];

  constructor(data: {
    id: number,
    type: AccountType,
  }) {
    super('Account', 'accounts', data.id);
    this.type = data.type;
    this.transfers = [];
  }

  public collections() : ICollection[] {
    return [{name: 'transfers', linkField: 'accountId', tableName: 'transfers'}];
  }
}
