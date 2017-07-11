import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AccountGroup } from '../../models/account_group';

@Component({
  selector: 'history-graph',
  template: 'GRAPH HERE',
})
export class HistoryGraphComponent implements OnChanges {

  @Input() data: any[];

  ngOnChanges(changes: SimpleChanges) {
  }
}
