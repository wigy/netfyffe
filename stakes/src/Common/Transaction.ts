import { DataObject } from './DataObject';
import { TransactionType } from './TransactionType';

export class Transaction extends DataObject{

  type: TransactionType;


  constructor(data: {
    id: number,
    type: TransactionType,
  }) {
    super(data.id, 'Transaction');
    this.type = data.type;
  }
}
