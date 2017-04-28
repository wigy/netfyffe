export class Account {

    id: number;
    currency: string;

    constructor(data: any) {
        this.id = data.id;
        this.currency = data.currency;
    }
}
