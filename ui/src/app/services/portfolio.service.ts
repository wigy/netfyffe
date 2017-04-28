import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { AccountGroup } from '../models/account_group';

@Injectable()
export class PortfolioService {

  // TODO: Make configurable.
  private url = 'http://localhost:9002';

  constructor(private http: Http) { }

  getAccounts(): Promise<AccountGroup[]> {
    return this.http.get(this.url + '/account_group')
      .toPromise()
      .then(response => response.json())
      .then(data => data.map((item: Object) => new AccountGroup(item)))
  }
}
