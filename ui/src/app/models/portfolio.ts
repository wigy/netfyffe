import { AccountGroup } from './account_group';
import { Query } from './query';
import { Values } from './values';

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
    public query(query: Query): Values {
        return Values.join(this.groups.map(g => g.query(query)));
    }
}
