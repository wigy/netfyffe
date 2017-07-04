import { Component, Input } from '@angular/core';

@Component({
    selector: 'change',
    templateUrl: './change.html',
    styleUrls: ['./change.css']
})
export class ChangeDirective  {

    @Input()  valuation: any;

    get currencies(): string[] {
        return this.valuation ? this.valuation.currencies : [];
    }

    opening(currency: string): Number {
        return this.valuation ? this.valuation.opening(currency) : 0;
    }

    closing(currency: string): Number {
        return this.valuation ? this.valuation.closing(currency) : 0;
    }
}
// TODO: Maybe have own directory for these.