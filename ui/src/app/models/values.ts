/**
 * A result collection for value queries.
 */
export class Values {

    constructor(public data={opening: {}, closing: {}}) {}

    /**
     * Combine two results into this one.
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

        return this;
    }

    /**
     * Combine an arra of results into one.
     */
    public static join(all: Values[]) : Values {
        return all.reduce((acc, cur) => cur.merge(acc), new Values());
    }
}
