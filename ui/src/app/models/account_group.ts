import { Bank } from './bank';
import { Account } from './account';

export class AccountGroup {

    public id: number;
    public name: string;
    public code: string;
    public bank: Bank;
    public accounts: Account[];

    constructor(data: any) {
        this.id = data.id || null;
        this.name = data.name || null;
        this.code = data.code || null;
        this.bank = data.bank ? new Bank(data.bank) : null;
        this.accounts = data.accounts ? data.accounts.map((acc: Object) => new Account(acc)) : [];
    }
}
