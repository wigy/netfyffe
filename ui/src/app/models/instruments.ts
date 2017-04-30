import { Instrument } from './instrument';

export class Instruments {

    instruments: Instrument[];

    constructor(data: Instrument[]) {
        this.instruments = data ? data.map((instr: Object) => new Instrument(instr)) : [];
    }
}
