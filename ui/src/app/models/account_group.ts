import { Bank } from './bank';
import { Account } from './account';

export class AccountGroup {

    id: number;
    name: string;
    code: string;
    bank: Bank;
    accounts: Account[];

    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.code = data.code;
        this.bank = new Bank(data.bank);
        this.accounts = data.accounts.map((acc: Object) => new Account(acc));
    }
}
