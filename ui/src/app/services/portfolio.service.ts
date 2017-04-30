import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { AccountGroup } from '../models/account_group';
import { Account } from '../models/account';
import { Transaction } from '../models/transaction';

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
      .then(data => data.map((item: Object) => {
        let account = item['account'];
        account.transactions = item['transactions'].map((tx: Object) => new Transaction(tx));
        return new Account(account);
      }));
  }
}
