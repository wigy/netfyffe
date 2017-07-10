const express = require('express');
const router = express.Router();
const db = require('../db');
const Bank = require('../models/Bank');
const Account = require('../models/Account');
const AccountGroup= require('../models/AccountGroup');
const Transaction= require('../models/Transaction');

/**
 * @api {get} /account Collect account description data for all accounts in all groups.
 * @apiName Accounts
 * @apiGroup Portfolio
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *         {
 *             "id": 1,
 *             "name": "My Account",
 *             "code": "123456",
 *             "bank": {
 *                 "id": 1,
 *                 "name": "Bank inc."
 *             },
 *             "accounts": [
 *                 {
 *                     "id": 1,
 *                     "currency": "EUR"
 *                 },
 *                 {
 *                     "id": 2,
 *                     "currency": "USD"
 *                 }
 *             ]
 *         }
 *     ]
 */
router.get('/', (req, res) => {

    Promise.all([
        Bank.query(),
        Account.query(),
        AccountGroup.query()
    ])
    .then(data => {
        let banks = {};
        data[0].map(bank => banks[bank.id] = bank);
        let accounts = {};
        data[1].map(account => {
            accounts[account.account_group_id] = accounts[account.account_group_id] || [];
            accounts[account.account_group_id].push(account);
        });
        res.send(data[2].map(group => {
            group.bank = banks[group.bank_id];
            group.accounts = accounts[group.id];
            return group;
        }));
    })
    .catch(err => {
        d.error(err);
        res.status(500).send({error: 'FetchFailed'});
    });
});

/**
 * @api {get} /account/:id Collect full account description data.
 * @apiName AccountDetail
 * @apiGroup Portfolio
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 * TODO: Fill in
 *     ]
 */
router.get('/:id', (req, res) => {
    let id = req.params.id;
    Promise.all([
        AccountGroup.query()
            .where('id', id),
        Account.query()
            .where('account_group_id', id)
            .orderBy('currency')
            .then(accounts => {
                return Promise.all(accounts.map(account =>
                    Transaction
                        .query()
                        .where('account_id', account.id)
                        .orderBy('date')
                        .then(txs => {account.transactions = txs; return account;})
                ));
            })
    ])
    .then(data => {let group = data[0][0]; group.accounts = data[1]; res.send(group);})
    .catch(err => {
        d.error(err);
        res.status(500).send({error: 'FetchFailed'});
    });
});

/**
 * @api {get} /account/:id Collect full account description data.
 * @apiName AccountDetail
 * @apiGroup Portfolio
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 * TODO: Fill in
 *     ]
 */
router.get('/:id', (req, res) => {
    let id = req.params.id;
    Promise.all([
        AccountGroup.query()
            .where('id', id),
        Account.query()
            .where('account_group_id', id)
            .orderBy('currency')
            .then(accounts => {
                return Promise.all(accounts.map(account =>
                    Transaction
                        .query()
                        .where('account_id', account.id)
                        .orderBy('date')
                        .then(txs => {account.transactions = txs; return account;})
                ));
            })
    ])
    .then(data => {let group = data[0][0]; group.accounts = data[1]; res.send(group);})
    .catch(err => {
        d.error(err);
        res.status(500).send({error: 'FetchFailed'});
    });
});

module.exports = router;
