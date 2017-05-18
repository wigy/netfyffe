import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AccountGroup } from '../models/account_group';

@Component({
  selector: 'history-graph',
  template: 'GRAPH HERE ({{accounts[0].name}})',
})
export class HistoryGraphComponent implements OnChanges {

  @Input() accounts: AccountGroup[];

  ngOnChanges(changes: SimpleChanges) {
    if (this.accounts[0].accounts.length) {
      let account = this.accounts[0].accounts[0];
      d(account.values());
    }
  }
}
