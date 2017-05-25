import { Transaction } from './transaction';
import { Balances } from './balances';
import { Instruments } from './instruments';
import { Query } from './query';
import { Values } from './values';

export class Account {

    id: number;
    currency: string;
    transactions: Transaction[];
    balances: Balances;
    instruments: Instruments;

    constructor(data: any) {
        this.id = data.id || null;
        this.currency = data.currency || null;
        let transactions = data.transactions || [];
        this.transactions = transactions.map((tx: Object) => new Transaction(tx));
        this.balances = new Balances(data.balances);
        this.instruments = new Instruments(data.instruments);
    }

    /**
     * Calculate first day that this account has activities.
     */
    firstDate(): string {
        let a = this.balances.firstDate();
        let b = this.instruments.firstDate();
        return (a < b) ? a : b;
    }

    /**
     * Calculate daily valuations for this account.
     */
    values(from?: string, to?: string): any[] {
        // TODO: Obsolete. Drop after query() is usable instead.
        from = from || this.firstDate();
        to = to || new Date().toISOString().substr(0, 10);
        let ret = this.balances.values(from, to);
        return ret;
    }

    /**
     * Calculate valuations for this account.
     */
    public query(query: Query): Values {
        if (!query.acceptsCurrency(this.currency)) {
            return new Values()
        }
        let b = this.balances.query(query.withCurrency(this.currency));
        let i = this.instruments.query(query.withCurrency(this.currency));
        return b.merge(i);
    }
}
