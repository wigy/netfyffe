import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AccountGroup } from '../models/account_group';
import { Account } from '../models/account';
import { Transaction } from '../models/transaction';
import { Balances } from '../models/balances';
import { Capital } from '../models/capital';
import { Instruments } from '../models/instruments';
import { Portfolio } from '../models/portfolio';
import { Dates } from '../models/dates';
import { Config } from '../config';

@Injectable()
export class PortfolioService {

    private portfolio: Portfolio = null;
    private portfolioFetched: Dates = null;

    constructor(private http: Http, private config: Config) { }

    /**
     * Connect a function to the portfolio data updates.
     */
    subscribe(callback: (p: Portfolio) => void): void {

        if (this.portfolio) {
            if (this.portfolioFetched.isToday()) {
                callback(this.portfolio);
                return;
            }
        }

        this.getFyffe()
            .subscribe((fyffe: any) => {
                let ret = new Portfolio();
                // Create account groups.
                let groupsById = {};
                fyffe.account_groups.forEach((group: any) => {
                    group.portfolio = ret;
                    groupsById[group.id] = new AccountGroup(group);
                    ret.groups.push(groupsById[group.id]);
                });
                // Create accounts.
                let accountsById = {};
                fyffe.accounts.forEach((account: any) => {
                    account.account_group = groupsById[account.account_group_id];
                    accountsById[account.id] = new Account(account);
                    groupsById[account.account_group_id].accounts.push(accountsById[account.id]);
                });
                // Create balances.
                Object.keys(fyffe.balances).forEach(id => {
                    fyffe.balances[id].account = accountsById[id];
                    accountsById[id].balances = new Balances(accountsById[id], fyffe.balances[id]);
                });
                // Create instruments.
                let instrumentsByAccount = {};
                fyffe.instruments.forEach((instrument: any) => {
                    let id = instrument.account_id;
                    instrument.account = accountsById[id];
                    instrumentsByAccount[id] = instrumentsByAccount[id] || [];
                    instrumentsByAccount[id].push(instrument);
                });
                Object.keys(instrumentsByAccount).forEach(id => {
                    accountsById[id].instruments = new Instruments(instrumentsByAccount[id]);
                });
                // Create capital data.
                Object.keys(fyffe.capital).forEach(id => {
                    fyffe.capital[id].account = accountsById[id];
                    accountsById[id].capital = new Capital(accountsById[id], fyffe.capital[id]);
                });

                this.portfolio = ret;
                this.portfolioFetched = new Dates('today');

                callback(ret);
            });
    }

    /**
     * Subscribe to get transactions for the account group.
     */
    transactions(id: Number, callback: (g: AccountGroup) => void): void {
        this.subscribe((portfolio: Portfolio) => {
            let group = portfolio.groups.filter((g: AccountGroup) => g.id === id)[0];
            this.http.get(this.config.PORTFOLIO_URL + '/account_group/' + id)
                .subscribe(tx => {
                    let txById = {};
                    tx.json().accounts.forEach((acc: any) => {
                        txById[acc.id] = acc.transactions.map((tx: any) => new Transaction(tx));
                    });
                    group.accounts.forEach((acc: Account) => {
                        acc.transactions = txById[acc.id];
                    });
                    callback(group);
                });
        });
    }

    /**
     * Get the portfolio data from the API.
     */
    getFyffe(): Observable<any> {
        // TODO: This should also fetch dividents.
        return this.http.get(this.config.PORTFOLIO_URL + '/fyffe/')
            .map((response: Response) => response.json());
    }
}
