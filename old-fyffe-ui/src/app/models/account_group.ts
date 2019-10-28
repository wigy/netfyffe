import { Portfolio } from './portfolio';
import { Bank } from './bank';
import { Account } from './account';
import { Query } from './query';
import { Values } from './values';
import { Dates } from './dates';

export class AccountGroup {

    portfolio: Portfolio;
    id: number;
    name: string;
    code: string;
    bank: Bank;
    accounts: Account[];

    constructor(data: any) {
        this.portfolio = data.portfolio || null;
        this.id = data.id || null;
        this.name = data.name || null;
        this.code = data.code || null;
        this.bank = data.bank ? new Bank(data.bank) : null;
        this.accounts = data.accounts ? data.accounts.map((acc: Object) => new Account(acc)) : [];
    }

    /**
     * Calculate the first day that this account group has activities.
     */
    firstDate(): string {
        return Dates.min(this.accounts.map(account => account.firstDate()));
    }

    /**
     * Calculate the last day that this account group has activities.
     */
    lastDate(): string {
        return Dates.max(this.accounts.map(account => account.lastDate()));
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
        range.useFullRange();
        let q = new Query(range, null);
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
