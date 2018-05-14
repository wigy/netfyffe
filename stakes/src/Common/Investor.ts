import { DataObject} from './DataObject';
import { ICollection } from './Types';

export class Investor extends DataObject{

  public nick?: string;
  public password?: string;
  public tag?: string;
  public fullName?: string;
  public accounts: Account[];

  constructor(data: {
    id: number,
    nick?: string,
    password?: string,
    tag?: string,
    fullName?: string,
  }) {
    super('Investor', 'investors', data.id);
    this.nick = data.nick;
    this.password = data.password;
    this.tag = data.tag;
    this.fullName = data.fullName;
    this.accounts = [];
  }

  public collections() : ICollection[] {
    return [{name: 'accounts', linkField: 'investorId', tableName: 'accounts'}];
  }
}
