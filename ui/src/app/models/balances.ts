export class Balances {

    balances: Object;

    constructor(data: any) {
        this.balances = data || {};
    }

    /**
     * Calculate first day that has a balance recording.
     */
    firstDate(): string {
        let keys = Object.keys(this.balances);
        return keys.length ? keys[0] : new Date().toISOString().substr(0, 10);
    }

    /**
     * Calculate daily valuations for the given date range.
     */
    values(from: string, to: string) {
        let keys = Object.keys(this.balances);
        return keys.map(day => new Object({name: new Date(day), value: this.balances[day] / 100}));
    }
}
