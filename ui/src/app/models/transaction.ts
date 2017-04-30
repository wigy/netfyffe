export class Transaction {

    id: number;
    account_id: number;
    date: Date;
    type: string;
    code: string;
    count: number;
    amount: number;
    options: Object;

    constructor(data: any) {
        this.id = data.id || null;
        this.account_id = data.account_id || null;
        this.date = data.date || null;
        this.type = data.type || null;
        this.code = data.code || null;
        this.count = data.count || null;
        this.amount = data.amount || null;
        // TODO: Hmm? Does not work
//        this.options = JSON.parse(data.options);
    }
}
