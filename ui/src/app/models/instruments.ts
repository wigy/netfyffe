import { Instrument } from './instrument';

export class Instruments {

    instruments: Instrument[];

    constructor(data: Instrument[]) {
        this.instruments = data ? data.map((instr: Object) => new Instrument(instr)) : [];
    }

    firstDate(): string {
        // Note that days are ordered.
        let days = this.instruments.map(instr => instr.bought);
        return days.length ? days[0] : (new Date().toISOString().substr(0, 10));
    }
}
