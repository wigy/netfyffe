import { Portfolio } from './portfolio';
import { AccountGroup } from '../models/account_group';
import { Transaction } from './transaction';
import { Balances } from './balances';
import { Capital } from './capital';
import { Instruments } from './instruments';
import { Query } from './query';
import { Values } from './values';

export class Account {

    account_group: AccountGroup;
    id: number;
    currency: string;
    transactions: Transaction[];
    balances: Balances;
    instruments: Instruments;
    capital: Capital;

    constructor(data: any) {
        this.account_group = data.account_group || null;
        this.id = data.id || null;
        this.currency = data.currency || null;
        let transactions = data.transactions || [];
        this.transactions = transactions.map((tx: Object) => new Transaction(tx));
        this.balances = new Balances(this, data.balances);
        this.instruments = new Instruments(data.instruments);
        this.capital = new Capital(this, data.capital);
    }

    /**
     * Calculate first day that this account has activities.
     */
    public firstDate(): string {
        let a = this.balances.firstDate();
        let b = this.instruments.firstDate();
        return (a < b) ? a : b;
    }

    /**
     * Calculate valuations for this account.
     */
    public query(query: Query): Values {
        if (!query.acceptsCurrency(this.currency)) {
            return new Values();
        }
        let b = this.balances.query(query.withCurrency(this.currency));
        let i = this.instruments.query(query.withCurrency(this.currency));
        let c = this.capital.query(query.withCurrency(this.currency));

        return b.merge(i).merge(c);
    }

    /**
     * Construct a summary how query is calculated.
     */
    public explain(query: Query): Object {
        let ret = {};
        ret[this.currency] = [];
        let result = this.balances.query(query.withCurrency(this.currency));
        const o = result.data.opening[this.currency]/100;
        const c = result.data.closing[this.currency]/100;
        ret[this.currency].push('Opening balance in `' + this.name + '` ' + o);
        let instruments = this.instruments.explain(query);
        ret[this.currency] = ret[this.currency].concat(instruments[this.currency] || []);
        ret[this.currency].push('Closing balance in `' + this.name + '` ' + c + ' (change ' + (c - o) + ')');
        return ret;
    }

    /**
     * The portfolio this object belongs, if known.
     */
    public get portfolio(): Portfolio {
        return this.account_group ? this.account_group.portfolio : null;
    }

    /**
     * Get the name of the account group combined with the currency.
     */
    public get name(): string {
        return this.account_group.name + ' ' + this.currency;
    }
}
