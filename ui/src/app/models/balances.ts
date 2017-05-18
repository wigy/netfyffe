export class Balances {

    public balances: Object;

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
}
