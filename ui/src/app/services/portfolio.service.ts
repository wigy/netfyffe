import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class PortfolioService {

  // TODO: Make configurable.
  private url = 'http://localhost:9002/account_group';

  constructor(private http: Http) { }

  getPortfolio(): any {
    return this.http.get(this.url)
      .toPromise()
      .then(response => response.json());
  }
}
