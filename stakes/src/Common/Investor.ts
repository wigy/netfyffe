import { DataObject} from './DataObject';

export class Investor extends DataObject{

  nick: string;
  password: string;
  tag: string;
  fullName: string;
  accounts: Account[];

  constructor(data: {
    id: number,
    nick: string,
    password: string,
    tag: string,
    fullName: string,
  }) {
    super(data.id, 'Investor');
    this.nick = data.nick;
    this.password = data.password;
    this.tag = data.tag;
    this.fullName = data.fullName;
    this.accounts = [];
  }
}
