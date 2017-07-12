import { Query } from './query';
import { Values } from './values';
import { Instrument } from './instrument';

export class Instruments {

    instruments: Instrument[];

    constructor(data: Instrument[]) {
        this.instruments = data ? data.map((instr: Object) => new Instrument(instr)) : [];
    }

    firstDate(): string {
        // Note that days are ordered.
        let days = this.instruments.map(instr => instr.bought);
        return days.length ? days[0] : (new Date().toISOString().substr(0, 10));
    }

    /**
     * Calculate valuation for these instruments.
     */
    public query(query: Query): Values {
        return Values.join(this.instruments.map(i => i.query(query)));
    }

    /**
     * Construct a summary how query is calculated.
     */
    public explain(query: Query): Object {
        let ret = {};
        if (!this.instruments.length) {
            return ret;
        }
        const currency = this.instruments[0].account.currency;
        ret[currency] = [];
        ret[currency + '-opening'] = [];
        ret[currency + '-closing'] = [];
        this.instruments.forEach(i => {
            const values = i.query(query.withCurrency(currency));
            const o = values.data.opening[currency]/100;
            const c = values.data.closing[currency]/100;
            const name = i.ticker + '[' + i.bought + ' .. ' + (i.sold ? i.sold : '') + ']';
            ret[currency].push(name + ' opening ' + o + ' and closing ' + c + ' (change ' + (c-o) + ')');
            ret[currency + '-opening'].push(o);
            ret[currency + '-closing'].push(c);
        })
        return ret;
    }

    /**
     * Collect a list of tickers in this collection.
     */
    public tickers(): string[] {
        let seen = {};
        this.instruments.forEach(i => {
            seen[i.ticker] = true;
        });
        return Object.keys(seen);
    }
}
