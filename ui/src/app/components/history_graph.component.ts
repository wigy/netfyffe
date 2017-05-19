import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AccountGroup } from '../models/account_group';

@Component({
  selector: 'history-graph',
  template: `
    <ngx-charts-line-chart
      [view]="[800, 400]"
      [scheme]="colorScheme"
      [results]="data"
      [gradient]="false"
      [xAxis]="true"
      [yAxis]="true"
      [legend]="true"
      [showXAxisLabel]="true"
      [showYAxisLabel]="true"
      xAxisLabel="Date"
      yAxisLabel="Value"
      [autoScale]="true"
      (select)="onSelect($event)">
    </ngx-charts-line-chart>
  `
})
export class HistoryGraphComponent implements OnChanges {

  @Input() data: any[];

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  onSelect(event: any) {
    console.log(event);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['data'].currentValue) {
      this.data = changes['data'].currentValue;
    }
  }
}
