import { Portfolio } from './portfolio';
import { DailyValues } from './daily_values';
import { Account } from './account';
import { Dates } from './dates';
import { Query } from './query';
import { Values } from './values';

export class Instrument extends DailyValues{

    account: Account;
    ticker: string;
    count: number;
    buy_price: number;
    sell_price?: number;
    bought: string;
    sold?: string;

    private _dates: Dates;

    constructor(data: any) {
        super();
        this.account = data.account || null;
        this.ticker = data.ticker || null;
        this.count = data.count || null;
        this.buy_price = data.buy_price || null;
        this.sell_price = data.sell_price || null;
        this.bought = data.bought || null;
        this.sold = data.sold || null;
        this._dates = null;
    }

    /**
     * Ask quote from portfolio and if not available, then make quick interpolation.
     */
    public closing(day: Dates, useFirstDay=false): number {
        let str = useFirstDay ? day.first : day.last;
        // If day is before this has been bought or after selling, it has no value on that date.
        if (str < this.bought) {
            return 0;
        }
        if (this.sold !== null && str >= this.sold) {
            return 0;
        }
        // Check for quotes.
        let q = this.portfolio.closing(this.ticker, str);
        if (q !== null) {
            return Math.round(q * this.count * 100);
        }
        // Make some interpolation if no quotes available.
        if (this.sold === null) {
            return this.buy_price;
        }
        let dates = this.dates;
        return Math.round(this.buy_price + (dates.daysTo(str) / dates.days) * (this.sell_price - this.buy_price));
    }

    /**
     * Calculate valuation for this instrument.
     */
    public query(query: Query): Values {
        return new Values(this._query(query));
    }

    /**
     * The portfolio this object belongs, if known.
     */
    public get portfolio(): Portfolio {
        return this.account ? this.account.portfolio : null;
    }

    /**
     * Construct a `Dates` object for buy and sell dates (or just buy date, if not sold).
     */
    get dates(): Dates {
        if (!this._dates) {
            this._dates = this.sold ? new Dates(this.bought, this.sold) : new Dates(this.bought);
        }
        return this._dates;
    }
}
