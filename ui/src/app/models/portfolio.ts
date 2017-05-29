import { AccountGroup } from './account_group';
import { Query } from './query';
import { Values } from './values';
import { Dates } from './dates';

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
        query.all();
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
}
