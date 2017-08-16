import { Injectable } from '@angular/core';
///////////////////////////////////////////////
/// AUTOMATICALLY GENERATED - DO NOT CHANGE ///
///////////////////////////////////////////////
/* tslint:disable */
@Injectable()
export class Config {

    // REST address for portfolio data.
    public PORTFOLIO_URL: string;
    // REST address for quote data.
    public QUOTES_URL: string;

    constructor() {
        this.PORTFOLIO_URL = "http://localhost:9002";
        this.QUOTES_URL = "http://localhost:9000";
    }
}
/* tslint:enable */
