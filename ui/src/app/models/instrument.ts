import { Portfolio } from './portfolio';
import { Account } from './account';
import { Query } from './query';
import { Values } from './values';

export class Instrument {

    account: Account;
    ticker: string;
    count: Number;
    buy_price: Number;
    sell_price?: Number;
    bought: string;
    sold?: string;

    constructor(data: any) {
        this.account = data.account || null;
        this.ticker = data.ticker || null;
        this.count = data.count || null;
        this.buy_price = data.buy_price || null;
        this.sell_price = data.sell_price || null;
        this.bought = data.bought || null;
        this.sold = data.sold || null;
    }

    /**
     * Calculate valuation for this instrument.
     */
    public query(query: Query): Values {
        //d(query.dates.first, query.dates.last, this.portfolio)
        // TODO: Implement instrument query.
        return new Values();
    }

    /**
     * The portfolio this object belongs, if known.
     */
    public get portfolio(): Portfolio {
        return this.account ? this.account.portfolio : null;
    }
}
