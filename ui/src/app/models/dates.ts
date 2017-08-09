import * as moment from 'moment/moment';

/**
* This class presents a named list of zero or more date strings in format `YYYY-MM-DD`.
*/
export class Dates {

    public name: string;
    private fullRange: boolean;
    private dates: any[];

    /**
    * Figure out if the first argument is a date and add it to dates collection, if it is.
    */
    constructor(name: string, ...dates: string[]) {
        this.fullRange = false;
        this.name = null;
        this.dates = [];
        let datePerhaps = this.toMoment(name);
        if (datePerhaps) {
            this.dates.push(datePerhaps);
        } else {
            this.name = name;
        }
        dates.forEach(date => {
            let moment = this.toMoment(date);
            if (!moment) {
                throw Error(`Invalid date format '${date}'.`);
            }
            this.dates.push(moment);
        });
    }

    /**
     * Make a copy of these dates.
     */
    public clone() : Dates {
        let ret = new Dates(this.name);
        ret.fullRange = this.fullRange;
        this.dates.forEach(mom => {
            ret.dates.push(moment(mom));
        });
        return ret;
    }

    /**
     * Convert this to full range.
     */
    public useFullRange(): Dates {
        if (this.dates.length !== 2) {
            throw Error(`Must have two dates use full range.`);
        }
        this.fullRange = true;
        return this;
    }

    /**
     * Check if this dates uses complete date range.
     */
    get hasFullRange(): boolean {
        return this.fullRange;
    }

    /**
    * Convert a string to Moment object.
    *
    * Accepted values are strings `YYYY-MM-DD` and `today`.
    */
    protected toMoment(str: string) {
        if (/^[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]$/.test(str)) {
            return moment(str);
        }
        if (str === 'today') {
            return moment(new Date().toISOString().substr(0, 10));
        }
        return null;
    }

    /**
    * Convert current dates to array of strings formatted as `YYYY-MM-DD`.
    */
    public toArray(): string[] {
        let ret: string[] = [];
        if (this.fullRange) {
            for (let i = this.start(); !i.endeq(); i.inc()) {
                ret.push(i.first);
            }
        } else {
            this.dates.forEach(moment => ret.push(moment.format('YYYY-MM-DD')));
        }
        return ret;
    }

    /**
    * Convert current dates to an object that maps `YYYY-MM-DD` strings to `true`.
    */
    public toObject(): Object {
        let ret = {};
        if (this.fullRange) {
            for (let i = this.start(); !i.endeq(); i.inc()) {
                ret[i.first]=true;
            }
        } else {
            this.dates.forEach(moment => ret[moment.format('YYYY-MM-DD')]=true);
        }
        return ret;
    }

    /**
    * Convert current dates to string `YYYY-MM-DD` separated with spaces.
    */
    public toString(): string {
        return this.toArray().join(' ');
    }

    /**
    * Add all dates from another collection to this collection, unless they are already there.
    */
    public merge(other: Dates): Dates {
        let have = this.toObject();
        other.dates.forEach(date => {
            let stamp = date.format('YYYY-MM-DD');
            if (!have[stamp]) {
                this.dates.push(moment(stamp));
            }
        });
        return this;
    }

    /**
    * Check if this date collection represents a single day.
    */
    public isSingleDay(): boolean {
        return this.dates.length === 1;
    }

    /**
    * Check if this date collection has exactly two dates.
    */
    public isDateRange(): boolean {
        return this.dates.length === 2;
    }

    /**
    * Check if this is just a single date and it points to today.
    */
    public isToday(): boolean {
        return moment().format('YYYY-MM-DD') === this.first;
    }

    /**
    * Construct new `Dates` which is one day before the current.
    */
    public dayBefore(): Dates {
        return this.dates.length ? new Dates(moment(this.dates[0]).subtract(1, 'days').format('YYYY-MM-DD')) : null;
    }

    /**
    * Get the first date as a string `YYYY-DD-MM`.
    */
    get first(): string {
        return this.dates.length ? this.dates[0].format('YYYY-MM-DD') : null;
    }

    /**
    * Get the second date as a string `YYYY-DD-MM`.
    */
    get second(): string {
        return this.dates.length > 1 ? this.dates[1].format('YYYY-MM-DD') : null;
    }

    /**
    * Get the last date as a string `YYYY-DD-MM`.
    */
    get last(): string {
        return this.dates.length ? this.dates[this.dates.length - 1].format('YYYY-MM-DD') : null;
    }

    /**
    * Get the year of the first date as a number.
    */
    get year(): number {
        return this.dates.length ? parseInt(this.dates[0].format('YYYY')) : null;
    }

    /**
     * Get difference in days of the range.
     */
    get days(): number {
        if (this.dates.length !== 2) {
            throw Error(`Must have two dates to calculate days in the range.`);
        }
        return this.dates[1].diff(this.dates[0], 'days');
    }

    /**
     * Calculate days to the target day from the first day.
     */
    public daysTo(target: string) {
        return - this.dates[0].diff(target, 'days');
    }

    /**
    * Construct a date collection for the given purpose:
    *
    * `today` - One date: today.
    * `1D` - Two dates: yesterday and today.
    * `1W` - Two dates: a week ago and today.
    * `1M` - Two dates: a month ago and today.
    * `3M` - Two dates: three months ago and today.
    * `6M` - Two dates: six months ago and today.
    * `YTD` - Two dates: first of January and today.
    * `1Y` - Two dates: an year ago and today.
    * `3Y` - Two dates: three years ago and today.
    * `5Y` - Two dates: five years ago and today.
    * `2015Q3` - Tow dates: the first and the last day of the quarter.
    *
    * If two dates name ends with `*` then it denotes complete range of days, i.e.
    * when converting to strings with `toArray()` all dates in between is included
    * and not just the limiting dates.
    */
    public static make(what: string): Dates;
    public static make(what: string[]): Dates[];
    public static make(what: string|string[]): Dates|Dates[] {

        if (what instanceof Array) {
            return what.map(w => Dates.make(w));
        }

        if (what === 'today') {
            return new Dates(what, 'today');
        }

        let ret: Dates;

        if (what.substr(what.length - 1, 1) === '*') {
            ret = Dates.make(what.substr(0, what.length - 1));
            ret.fullRange = true;
            return ret;
        }

        let match = /^(\d\d\d\d)Q([1-4])$/.exec(what);
        if (match) {
            switch(match[2]) {
                case '1':
                return new Dates(what, match[1] + '-01-01', match[1] + '-03-31');
                case '2':
                return new Dates(what, match[1] + '-04-01', match[1] + '-06-30');
                case '3':
                return new Dates(what, match[1] + '-07-01', match[1] + '-09-30');
                case '4':
                return new Dates(what, match[1] + '-10-01', match[1] + '-12-31');
            }
        }

        ret = new Dates(what, 'today', 'today');

        switch(what) {
            case '1D':
            ret.dates[0].subtract(1, 'days');
            break;
            case '1W':
            ret.dates[0].subtract(7, 'days');
            break;
            case '1M':
            ret.dates[0].subtract(1, 'months');
            break;
            case '3M':
            ret.dates[0].subtract(3, 'months');
            break;
            case '6M':
            ret.dates[0].subtract(6, 'months');
            break;
            case 'YTD':
            ret.dates[0] = moment(ret.dates[0].format('YYYY-01-01'));
            break;
            case '1Y':
            ret.dates[0].subtract(1, 'years');
            break;
            case '3Y':
            ret.dates[0].subtract(3, 'years');
            break;
            case '5Y':
            ret.dates[0].subtract(5, 'years');
            break;
            default:
            throw Error(`Don't know how to construct Dates for '${what}'.`);
        }
        return ret;
    }

    /**
     * Find the first date in the list of date strings of format `YYYY-MM-DD`.
     */
    public static min(dates: string[]): string|null {
        let ret: string = null;
        dates.forEach(date => {
            if ((ret === null || ret > date) && date !== null) {
                ret = date;
            }
        });
        return ret;
    }

    /**
     * Find the last date in the list of date strings of format `YYYY-MM-DD`.
     */
    public static max(dates: string[]): string|null {
        let ret: string = null;
        dates.forEach(date => {
            if ((ret === null || ret < date) && date !== null) {
                ret = date;
            }
        });
        return ret;
    }

    /**
     * Calculate list of quarters between two dates inclusive formatted like `2017Q1`.
     */
    public  quarters(): string[] {
        if (this.dates.length !== 2) {
            throw Error(`Must have two dates to calculate quarters.`);
        }
        let ret: string[] = [];
        let y = this.dates[0].year();
        let q = this.dates[0].quarter();
        let y2 = this.dates[1].year();
        let q2 = this.dates[1].quarter();

        do {
            ret.push(y + 'Q' + q);
            q++;
            if (q > 4) {
                q = 1;
                y++;
            }
            if (y > y2 || (y === y2 && q > q2)) {
                break;
            }
        } while(true);

        return ret;
    }

    /**
     * Construct an iterator [a1, a2, ..., an-1] for two dates in collection [a1, an].
     *
     * Usage: for(let day = dates.start(); !day.end(); day.inc()) {...}
     */
    public start(): Dates {
        if (this.dates.length !== 2) {
            throw Error(`Must have two dates make an iterator.`);
        }
        let ret = new Dates(this.name!==null ? this.name + ' iterator' : null);
        ret.dates.push(moment(this.dates[0]));
        ret.dates.push(moment(this.dates[1]));
        return ret;
    }

    /**
     * Check if first date is still before than second date.
     */
    public end(): boolean {
        return !this.dates[0].isBefore(this.dates[1]);
    }

    /**
     * Check if first date is still before or equal than second date.
     */
    public endeq(): boolean {
        return !this.dates[0].isSameOrBefore(this.dates[1]);
    }

    /**
     * Increment first date.
     */
    public inc(): void {
        this.dates[0].add(1, 'days');
    }
};
