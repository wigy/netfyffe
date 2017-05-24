import * as moment from 'moment/moment';

/**
 * This class presents a named list of zero or more date strings in format `YYYY-MM-DD`.
 */
export class Dates {

  public name: string;
  private dates: any[];

  /**
   * Figure out if the first argument is a date and add it to dates collection, if it is.
   */
  constructor(name: string, ...dates: string[]) {
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
    this.dates.forEach(moment => ret.push(moment.format('YYYY-MM-DD')));
    return ret;
  }

  /**
   * Convert current dates to an object that maps `YYYY-MM-DD` strings to `true`.
   */
  public toObject(): Object {
    let ret = {};
    this.dates.forEach(moment => ret[moment.format('YYYY-MM-DD')]=true);
    return ret;
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
   * Construct a date collection for the given purpose:
   *
   * `1D` - Two dates: yesterday and today.
   * `1W` - Two dates: a week ago and today.
   * `1M` - Two dates: a month ago and today.
   * `3M` - Two dates: three months ago and today.
   * `YTD` - Two dates: first of January and today.
   * `1Y` - Two dates: an year ago and today.
   */
  public static make(what: string): Dates {
    let ret: Dates = new Dates(what, 'today', 'today');
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
      case 'YTD':
        ret.dates[0] = moment(ret.dates[0].format('YYYY-01-01'));
        break;
      case '1Y':
        ret.dates[0].subtract(1, 'years');
        break;
      default:
        throw Error(`Don't know how to construct Dates for '${what}'.`);
    }
    return ret;
  }
};
