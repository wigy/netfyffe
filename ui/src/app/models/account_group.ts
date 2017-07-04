import { Bank } from './bank';
import { Account } from './account';
import { Query } from './query';
import { Values } from './values';
import { Dates } from './dates';

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
     * Calculate first day that this account group has activities.
     */
    firstDate(): string {
        return Dates.min(this.accounts.map(account => account.firstDate()));
    }

    /**
     * Calculate valuations for all acccounts in this group.
     */
    public query(query: Query): Values {
        return Values.join(this.accounts.map(g => g.query(query)));
    }

    /**
     * Collect data serics for a graph.
     */
    public getGraphData(): any[] {
        let ret: any[] = [];
        let range = new Dates('graph range', this.firstDate(), 'today');
        let q = new Query(range, null, true);
        let data = this.query(q).data.quotes;
        Object.keys(data).forEach(currency => {
            let obj = {name: currency, series: <any[]>[]};
            Object.keys(data[currency]).forEach(day => {
                obj.series.push({name: new Date(day), value: data[currency][day] / 100});
            });
            ret.push(obj);
        });
        return ret;
    }
}
