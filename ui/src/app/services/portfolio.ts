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
    private fyffe: Promise<any> = null;
    private fyffeFetched: Dates = null;

    constructor(private http: Http) { }

    /**
    * Fetch complete portfolio data.
    */
    getPortfolio(): Promise<Portfolio> {
        // TODO: Add parental references to all related models.
        // TODO: Reorganize code so that this is based on directly single getFyffe() data fetch.
        return this.getAccountGroups()
        .then(groups => {
            let ret = new Portfolio();
            ret.groups = groups;
            return ret;
        });
    }

    /**
    * Collect all account groups.
    */
    getAccountGroups(): Promise<AccountGroup[]> {
        // TODO: Use getPortfolio() here instead, once it uses getFyffe() construction.
        return this.http.get(this.url + '/account_group')
        .toPromise()
        .then(response => response.json())
        .then(data => {
            return Promise.all(data.map((g:any) => this.getAccountGroup(g.id)));
        });
    }

    /**
    * Get the account group with all accounts and their contents.
    */
    getAccountGroup(id: Number): Promise<AccountGroup> {
        return this.http.get(this.url + '/account_group/' + id)
        .toPromise()
        .then(response => response.json())
        .then(data => new AccountGroup(data))
        .then(group => {
            return Promise.all(group.accounts.map((account: Account) => Promise.all([
                this.getBalances(account.id),
                this.getInstruments(account.id),
                this.getCapital(account.id)
            ])))
            .then(data => {
                data.forEach((accdata, i) => {
                    group.accounts[i].balances = accdata[0];
                    group.accounts[i].instruments = accdata[1];
                    group.accounts[i].capital = accdata[2];
                });
                return group;
            });
        });
    }

    /**
    * Get Balances instance for the given account with the `id`.
    */
    getBalances(id: Number): Promise<Balances> {
        return this.getFyffe().then(data => new Balances(data.balances['' + id]));
    }

    /**
    * Get Instruments instance for the given account with the `id`.
    */
    getInstruments(id: Number): Promise<Instruments> {
        return this.getFyffe()
            .then(data => new Instruments(data.instruments.filter((instr: Object) => +instr['account_id'] === id)));
    }

    /**
    * Get Capital instance for the given account with the `id`.
    */
    getCapital(id: Number): Promise<Capital> {
        return this.getFyffe().then(data => new Capital(data.capital['' + id]));
    }

    /**
     * Get the instrument and balances data and cache it until date has changed.
     */
    getFyffe(): Promise<any> {
        if (this.fyffe) {
            if (this.fyffeFetched.isToday()) {
                return this.fyffe;
            }
        }
        this.fyffeFetched = new Dates('today');
        this.fyffe = this.http.get(this.url + '/fyffe/')
            .toPromise()
            .then(response => response.json());

        return this.fyffe;
    }
}
