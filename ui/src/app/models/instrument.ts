export class Instrument {

    public ticker: string;
    public count: Number;
    public buy_price: Number;
    public sell_price?: Number;
    public bought: string;
    public sold?: string;

    constructor(data: any) {
        this.ticker = data.ticker || null;
        this.count = data.count || null;
        this.buy_price = data.buy_price || null;
        this.sell_price = data.sell_price || null;
        this.bought = data.bought || null;
        this.sold = data.sold || null;
    }
}
