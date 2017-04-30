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
        this.id = data.id;
        this.account_id = data.account_id;
        this.date = data.date;
        this.type = data.type;
        this.code = data.code;
        this.count = data.count;
        this.amount = data.amount;
        // TODO: Hmm? Does not work
//        this.options = JSON.parse(data.options);
    }
}
