import { AccountGroup } from './account_group';
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
     * Calculate daily valuations for the portfolio in the date range.
     */
    public queryAll(query: Query|Dates): Values {
        if (query instanceof Dates) {
            query = new Query(query);
        }
        query.allValues = true;
        return Values.join(this.groups.map(g => g.query(<Query>query)));
    }

    /**
     * Calculate first day that this portfolio has activities.
     */
    firstDate(): string {
        return Dates.min(this.groups.map(group => group.firstDate()));
    }

    /**
     * Collect list of quarters applicapable for this portfolio in format `2017Q1`
     */
    public quarters(): string[] {
        let q = new Dates(this.firstDate(), 'today');
        return q.quarters();
    }

    /**
     * Handle update messages from quote service.
     */
    public update(msg: Quotes): void {
        // TODO: Update new values to the instruments and account currencies.
    }
}
