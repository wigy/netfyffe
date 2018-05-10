import { DataObject } from './DataObject';
import { AccountType } from './AccountType';
import { Investor } from './Investor';

export class Account extends DataObject{

  type: AccountType;
  owner: Investor | undefined;

  constructor(data: {
    id: number,
    type: AccountType,
    owner?: Investor,
  }) {
    super(data.id, 'Account');
    this.type = data.type;
    this.owner = data.owner;
  }
}
