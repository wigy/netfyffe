/**
 * A result collection for queries.
 */
export class Values {

    data: {opening: {}, quotes: {}, closing: {}};
    capital: Values|null;

    constructor(data=<{opening: {}, quotes: {}, closing: {}}>null, capital=<Values>null) {
        this.data = data ? data : {opening: {}, quotes: {}, closing: {}};
        this.capital = capital;
    }

    /**
     * Combine other collection of results into this one.
     */
    public merge(other: Values) {

        Object.keys(other.data.opening).forEach(k => {
            this.data.opening[k] = this.data.opening[k] || 0;
            this.data.opening[k] += other.data.opening[k];
        });

        Object.keys(other.data.closing).forEach(k => {
            this.data.closing[k] = this.data.closing[k] || 0;
            this.data.closing[k] += other.data.closing[k];
        });

        Object.keys(other.data.quotes).forEach(k => {
            this.data.quotes[k] = this.data.quotes[k] || {};
            Object.keys(other.data.quotes[k]).forEach(d => {
                this.data.quotes[k][d] = this.data.quotes[k][d] || 0;
                this.data.quotes[k][d] += other.data.quotes[k][d];
            });
        });

        if (!this.capital && other.capital) {
            this.capital = new Values();
        }
        if (other.capital) {
            this.capital.merge(other.capital);
        }

        return this;
    }

    /**
     * Combine an array of results into one.
     */
    public static join(all: Values[]) : Values {
        return all.reduce((acc, cur) => cur.merge(acc), new Values());
    }
}
