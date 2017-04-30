import { Transaction } from './transaction';

export class Account {

    id: number;
    currency: string;
    transactions: Transaction[];

    constructor(data: any) {
        this.id = data.id || null;
        this.currency = data.currency || null;
        let transactions = data.transactions || [];
        this.transactions = transactions.map((tx: Object) => new Transaction(tx));
    }
}
