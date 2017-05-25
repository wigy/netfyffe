/**
 * A result collection for value queries.
 */
export class Values {

    constructor(public data={}) {}

    /**
     * Combine two results into this one.
     */
    public merge(other: Values) {

        Object.keys(other.data).forEach(k => {
            this.data[k] = this.data[k] || 0;
            this.data[k] += other.data[k];
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
