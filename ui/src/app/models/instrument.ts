export class Instrument {

    ticker: string;
    count: Number;
    buy_price: Number;
    sell_price: Number;
    bought: Date;
    sold: Date;

    constructor(data: any) {
        this.ticker = data.ticker || null;
        this.count = data.count || null;
        this.buy_price = data.buy_price || null;
        this.sell_price = data.sell_price || null;
        this.bought = data.bought || null;
        this.sold = data.sold || null;
    }
}
