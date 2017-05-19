import * as moment from 'moment/moment';

export class Dates {

  from: any;
  to: any;

  constructor(from?: string, to?: string) {
    this.from = moment(from || '1970-01-01');
    this.to = moment(to || new Date().toISOString().substr(0, 10));
  }
};
