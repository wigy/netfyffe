import { Component, Input } from '@angular/core';

/**
 * Display a percentage value with color red (negative), green (positive), black (zero) or gray (NaN, null).
 *
 * If value is rounded to zero, then one additional digit is added.
 *
 * For example:
 *
 * <percentage [value]="-12.2224" digits=2></percentage>
 */
@Component({
    selector: 'percentage',
    template: '<span [style.color]="color" [innerHTML]="text"></span>',
})
export class PercentageDirective  {

    @Input() value: number;
    @Input() digits: number;

    get color(): string {
        if (typeof(this.value) !== 'number' || isNaN(this.value)) {
            return 'gray';
        }
        if (this.value < 0) {
            return 'red';
        }
        if (this.value > 0) {
            return 'green';
        }
        return 'black';
    }

    get text(): string {
        if (typeof(this.value) !== 'number' || isNaN(this.value)) {
            return '&mdash;';
        }
        let digits = this.digits !== undefined ? parseInt('' + this.digits) : 0;
        let pow = Math.pow(10, digits);
        let value = Math.round(this.value * pow) / pow;
        if (value === 0) {
            pow *= 10;
            digits++;
            value = Math.round(this.value * pow) / pow;
        }
        let parts = value.toString().split('.');
        let ret = '';
        if (digits) {
            if (parts.length < 2) {
                parts.push('');
            }
            parts[1] = (parts[1] + '0000000000000').substr(0, digits);
            ret = parts.join('.');
        }
        return ret + '%';
    }
}
