import { Component, Input } from '@angular/core';
import { AccountGroup } from '../models/account_group';

@Component({
  selector: 'history-graph',
  template: 'GRAPH HERE ({{accounts[0].name}})',
})
export class HistoryGraphComponent  {

  @Input() accounts: AccountGroup[];
}
