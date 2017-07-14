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
    quotes: Quotes;

    constructor(data?: AccountGroup[]) {
        this.groups = data ? data : [];
        this.quotes = new Quotes();
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
    public firstDate(): string {
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
        let ret: any[] = [];
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
     * Construct a summary how query is calculated.
     */
    public explain(query: Query): Object {
        let ret = {};
        this.forAccounts(acc => {
            let expl = acc.explain(query);
            Object.keys(expl).forEach(currency => {
                ret[currency] = ret[currency] || [];
                ret[currency] = ret[currency].concat(expl[currency] || []);
            });
        });
        return ret;
    }

    /**
     * Handle updated quotes from the quote service.
     */
    public update(update: Quotes): void {
        this.quotes.merge(update);
    }

    /**
     * Check if we know closing value for the given date for a ticker.
     */
    public closing(ticker: string, day: Dates|string) {
        return this.quotes.closing(ticker, day);
    }
}
