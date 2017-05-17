import { Transaction } from './transaction';
import { Balances } from './balances';
import { Instruments } from './instruments';

export class Account {

    public id: number;
    public currency: string;
    public transactions: Transaction[];
    public balances: Balances;
    public instruments: Instruments;

    constructor(data: any) {
        this.id = data.id || null;
        this.currency = data.currency || null;
        let transactions = data.transactions || [];
        this.transactions = transactions.map((tx: Object) => new Transaction(tx));
        this.balances = new Balances(data.balances);
        this.instruments = new Instruments(data.instruments);
    }

    firstDate(): string {
        let a = this.balances.firstDate();
        let b = this.instruments.firstDate();
        return (a < b) ? a : b;
    }

    /**
     * Calculate daily valuations for this account.
     */
    values(from?: string, to?: string) {
        // TODO: Implement.
        from = from || this.firstDate();
        return from;
    }
}
