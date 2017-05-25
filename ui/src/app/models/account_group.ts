import { Bank } from './bank';
import { Account } from './account';
import { Query } from './query';
import { Values } from './values';

export class AccountGroup {

    id: number;
    name: string;
    code: string;
    bank: Bank;
    accounts: Account[];

    constructor(data: any) {
        this.id = data.id || null;
        this.name = data.name || null;
        this.code = data.code || null;
        this.bank = data.bank ? new Bank(data.bank) : null;
        this.accounts = data.accounts ? data.accounts.map((acc: Object) => new Account(acc)) : [];
    }

    /**
     * Calculate daily valuations for all accounts in this group.
     */
    values(from?: string, to?: string) {
        // TODO: Obsolete. Drop after query() is usable instead.
        return this.accounts.map(acc => new Object({name: acc.currency, series: acc.values()}));
    }

    /**
     * Calculate valuations for all acccounts in this group.
     */
    public query(query: Query): Values {
        return Values.join(this.accounts.map(g => g.query(query)));
    }
}
