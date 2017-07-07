import { Balances } from './balances';
import { Query } from './query';
import { Values } from './values';

export class Capital extends Balances {

    /**
     * Calculate valuations for the given query.
     */
    public query(query: Query): Values {
        return new Values(null, new Values(this._query(query)));
    }
}
