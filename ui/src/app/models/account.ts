import { Transaction } from './transaction';
import { Balances } from './balances';
import { Instruments } from './instruments';

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
}
