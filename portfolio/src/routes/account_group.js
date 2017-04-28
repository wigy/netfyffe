const express = require('express');
const router = express.Router();
const db = require('../db');
const Bank = require('../models/Bank');
const Account = require('../models/Account');
const AccountGroup= require('../models/AccountGroup');

/**
 * @api {get} /account Collect full account description data.
 * @apiName Accounts
 * @apiGroup Portfolio
 *
 * TODO: Docs.
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
            delete account.account_group_id;
        });
        res.send(data[2].map(group => {
            group.bank = banks[group.bank_id];
            group.accounts = accounts[group.id];
            delete group.bank_id;
            return group;
        }));
    })
    .catch(err => {
        d.error(err);
        res.status(500).send({error: 'FetchFailed'});
    });
});

module.exports = router;
