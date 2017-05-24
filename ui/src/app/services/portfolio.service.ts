import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { AccountGroup } from '../models/account_group';
import { Account } from '../models/account';
import { Transaction } from '../models/transaction';
import { Balances } from '../models/balances';
import { Instruments } from '../models/instruments';
import { Portfolio } from '../models/portfolio';

@Injectable()
export class PortfolioService {
  // TODO: Make configurable.
  private url = 'http://localhost:9002';

  constructor(private http: Http) { }

  getPortfolio(): Promise<Portfolio> {
    return this.getAccountGroups()
      .then(groups => {
        let ret = new Portfolio();
        ret.groups = groups;
        return ret;
      });
  }

  /**
   * Collect all account groups.
   */
  getAccountGroups(): Promise<AccountGroup[]> {
    return this.http.get(this.url + '/account_group')
      .toPromise()
      .then(response => response.json())
      .then(data => data.map((item: Object) => new AccountGroup(item)))
  }

  /**
   * Get the account group with all accounts and their contents.
   */
  getAccountGroup(id: Number): Promise<AccountGroup> {
    return this.http.get(this.url + '/account_group/' + id)
      .toPromise()
      .then(response => response.json())
      .then(data => new AccountGroup(data))
      .then(group => {
        return Promise.all(group.accounts.map((account: Account) => Promise.all([
          this.getBalances(account.id),
          this.getInstruments(account.id)
        ])))
        .then(data => {
          data.forEach((accdata, i) => {
            group.accounts[i].balances = accdata[0];
            group.accounts[i].instruments = accdata[1];
          });
          return group;
        });
      });
  }

  /**
   * Get Balances instance for the given account with the `id`.
   */
  getBalances(id: Number): Promise<Balances> {
  // TODO: Move main fetching to separate getFyffe() function caching data until day has changed.
    return this.http.get(this.url + '/fyffe/')
      .toPromise()
      .then(response => response.json())
      .then(data => new Balances(data.balances['' + id]));
  }

  /**
   * Get Instruments instance for the given account with the `id`.
   */
  getInstruments(id: Number): Promise<Instruments> {
  // TODO: Move main fetching to separate getFyffe() function caching data until day has changed.
    return this.http.get(this.url + '/fyffe/')
      .toPromise()
      .then(response => response.json())
      .then(data => new Instruments(data.instruments.filter((instr: Object) => +instr['account_id'] === id)));
  }
}
