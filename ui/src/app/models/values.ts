/**
 * A result collection for value queries.
 */
export class Values {

    constructor(public currencies={}) {}

    public merge(other: Values) {
        // TODO: Combine values.
        return this;
    }

    public static join(all: Values[]) : Values {
        let ret = new Values();
        // TODO: Combine all.
        return ret;
    }
}
