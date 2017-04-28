import { Injectable } from '@angular/core';

@Injectable()
export class PortfolioService {

  getPortfolio() : Object[] {
    return [{hi: 121212}];
  }
}
