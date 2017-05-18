import { Instrument } from './instrument';

export class Instruments {

    public instruments: Instrument[];

    constructor(data: Instrument[]) {
        this.instruments = data ? data.map((instr: Object) => new Instrument(instr)) : [];
    }

    firstDate(): string {
        // TODO: Implement.
        return '2001-01-01';
    }
}
