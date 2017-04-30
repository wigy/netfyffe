import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { AccountGroup } from '../models/account_group';
import { Account } from '../models/account';
import { Transaction } from '../models/transaction';
import { Balances } from '../models/balances';
import { Instruments } from '../models/instruments';

@Injectable()
export class PortfolioService {
  // TODO: Make configurable.
  private url = 'http://localhost:9002';

  constructor(private http: Http) { }

  getAccountGroups(): Promise<AccountGroup[]> {
    return this.http.get(this.url + '/account_group')
      .toPromise()
      .then(response => response.json())
      .then(data => data.map((item: Object) => new AccountGroup(item)))
  }

  getAccountGroup(id: Number): Promise<AccountGroup> {
    return this.http.get(this.url + '/account_group/' + id)
      .toPromise()
      .then(response => response.json())
      .then(data => new AccountGroup(data));
  }

  /**
   * Get Balances instance for the given account with the `id`.
   */
  getBalances(id: Number): Promise<Balances> {
  // TODO: This service could cache data as per ID and refresh it only when day has changed.
    return this.http.get(this.url + '/fyffe/')
      .toPromise()
      .then(response => response.json())
      .then(data => new Balances(data.balances['' + id]));
  }

  /**
   * Get Instruments instance for the given account with the `id`.
   */
  getInstruments(id: Number): Promise<Instruments> {
  // TODO: This service could cache data as per ID and refresh it only when day has changed.
    return this.http.get(this.url + '/fyffe/')
      .toPromise()
      .then(response => response.json())
      .then(data => new Instruments(data.instruments.filter((instr: Object) => +instr['account_id'] === id)));
  }
}
