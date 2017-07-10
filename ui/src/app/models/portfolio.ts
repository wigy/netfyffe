import { AccountGroup } from './account_group';
import { Account } from './account';
import { Query } from './query';
import { Values } from './values';
import { Dates } from './dates';
import { Quotes } from './quotes';

/**
 * A complete collection of wealth, i.e. account groups.
 */
export class Portfolio {

    groups: AccountGroup[];

    constructor(data?: AccountGroup[]) {
        this.groups = data ? data : [];
    }

    /**
     * Calculate valuations for the portfolio.
     */
    public query(query: Query|Dates): Values {
        if (query instanceof Dates) {
            query = new Query(query);
        }
        return Values.join(this.groups.map(g => g.query(<Query>query)));
    }

    /**
     * Calculate first day that this portfolio has activities.
     */
    firstDate(): string {
        return Dates.min(this.groups.map(group => group.firstDate()));
    }

    /**
     * Collect a list of quarters applicapable for this portfolio in format `2017Q1`
     */
    public quarters(): string[] {
        let q = new Dates(this.firstDate(), 'today');
        return q.quarters();
    }

    /**
     * Run the function for all accounts in this portfolio.
     */
    public forAccounts(callback: (a: Account) => any): any[] {
        let ret = <any[]>[];
        this.groups.forEach(group => {
            group.accounts.forEach(acc => {
                ret.push(callback(acc));
            })
        });
        return ret;
    }

    /**
     * Collect a list of tickers related to the portfolio.
     */
    public tickers(): string[] {
        let seen = {};
        this.forAccounts((acc: Account) => {
            acc.instruments.instruments.forEach(i => {
                seen[i.ticker] = true;
            });
        });
        return Object.keys(seen);
    }

    /**
     * Handle update messages from quote service.
     */
    public update(msg: Quotes): void {
        // TODO: Update new values to the instruments and account currencies.
    }
}
