import { Component, Input } from '@angular/core';
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
      xAxisLabel="Year"
      yAxisLabel="Population"
      [autoScale]="true"
      (select)="onSelect($event)">
    </ngx-charts-line-chart>
  `
})
export class HistoryGraphComponent  {

  @Input() accounts: AccountGroup[];

  data: any[];

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor() {
    this.data = [
      {
        "name": "Germany",
        "series": [
          {
            "name": "2009",
            "value": 7200000
          },
          {
            "name": "2010",
            "value": 7300000
          },
          {
            "name": "2011",
            "value": 8940000
          }
        ]
      },

      {
        "name": "USA",
        "series": [
          {
            "name": "2009",
            "value": 7200000
          },
          {
            "name": "2010",
            "value": 7870000
          },
          {
            "name": "2011",
            "value": 8270000
          }
        ]
      },

      {
        "name": "France",
        "series": [
          {
            "name": "2009",
            "value": 7200000
          },
          {
            "name": "2010",
            "value": 5000002
          },
          {
            "name": "2011",
            "value": 5800000
          }
        ]
      }
    ];
  }
  onSelect(event: any) {
    console.log(event);
  }
}
