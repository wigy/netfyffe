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

    opening(currency: string): number {
        return this.valuation ? this.valuation.opening(currency, true) : 0;
    }

    closing(currency: string): number {
        return this.valuation ? this.valuation.closing(currency, true) : 0;
    }

    change(currency: string): number {
        const o = this.opening(currency), c = this.closing(currency);
        const osum = this.valuation ? this.valuation.opening(currency) : 0;
        return osum ? (c-o)/osum : NaN;
    }
}
// TODO: Maybe have own directory for these.