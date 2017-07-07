import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
// TODO: Get rid of toPromise.
import 'rxjs/add/operator/toPromise';
import { AccountGroup } from '../models/account_group';
import { Account } from '../models/account';
import { Transaction } from '../models/transaction';
import { Balances } from '../models/balances';
import { Capital } from '../models/capital';
import { Instruments } from '../models/instruments';
import { Portfolio } from '../models/portfolio';
import { Dates } from '../models/dates';

@Injectable()
export class PortfolioService {
    // TODO: Make configurable.
    private url: string = 'http://localhost:9002';
    private portfolio: Promise<Portfolio> = null;
    private portfolioFetched: Dates = null;

    constructor(private http: Http) { }

    /**
    * Fetch complete portfolio data and construct cached `Portfolio` instance.
    */
    getPortfolio(): Promise<Portfolio> {

        if (this.portfolio) {
            if (this.portfolioFetched.isToday()) {
                return this.portfolio;
            }
        }

        this.portfolioFetched = new Dates('today');
        this.portfolio = this.getFyffe()
            .then(fyffe => {
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
                return ret;
            });

        return this.portfolio;
    }

    /**
    * Collect all account groups.
    */
    getAccountGroups(): Promise<AccountGroup[]> {
        return this.getPortfolio()
            .then((portfolio: Portfolio) => portfolio.groups);
    }

    /**
    * Get the account group with all accounts and their transactions.
    */
    getAccountGroup(id: Number): Promise<AccountGroup> {
        return this.getPortfolio()
            .then((portfolio: Portfolio) => portfolio.groups.filter((g: AccountGroup) => g.id === id)[0])
            .then((group: AccountGroup) => {
                // Attach transactions to the account data.
                return this.http.get(this.url + '/account_group/' + id).toPromise()
                    .then((tx) => {
                        let txById = {};
                        tx.json().accounts.forEach((acc: any) => {
                            txById[acc.id] = acc.transactions.map((tx: any) => new Transaction(tx));
                        });
                        group.accounts.forEach((acc: Account) => {
                            acc.transactions = txById[acc.id];
                        });
                        return group;
                    })
            });
    }

    /**
     * Get the portfolio data from the API.
     */
    getFyffe(): Promise<any> {
        return this.http.get(this.url + '/fyffe/')
            .toPromise()
            .then(response => response.json());
    }
}
