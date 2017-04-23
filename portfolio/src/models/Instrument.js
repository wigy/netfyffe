const Model = require('objection').Model;

class Instrument extends Model {

    static get tableName() {
        return 'instruments';
    }

    /**
     * Construct a query that marks this instrument as moved out on `date`.
     */
    movedOut(date) {
        return Instrument
            .query()
            .patch({
                sell_price: this.buy_price,
                sold: date,
            })
            .where('id', this.id);
    }

    /**
     * Construct a query that resets selling date and price.
     */
    canceledSelling() {
        return Instrument
            .query()
            .patch({
                sell_price: null,
                sold: null,
            })
            .where('id', this.id);
    }

    /**
     * Construct a query marking the instrument as sold.
     */
    soldFor(date, price) {
        return Instrument
            .query()
            .patch({sold: date, sell_price: price})
            .where('id', this.id);
    }

    /**
     * Construct a pair of queries selling part of the instrument at the given price.
     */
    split(date, count, price) {
        let remainingBuy = Math.round(this.buy_price * ((this.count - count) / this.count));
        let sold = Instrument
            .query()
            .patch({
                sold: date,
                count: count,
                buy_price: this.buy_price - remainingBuy,
                sell_price: price
            })
            .where('id', this.id);
        let remaining = Instrument
            .query()
            .insert({
                account_id: this.account_id,
                bought: this.bought,
                buy_price: remainingBuy,
                count: this.count - count,
                ticker: this.ticker});

        return Promise.all([sold, remaining]);
    }

    /**
     * Buy `count` instruments with ticker `code` for an `amount` on specific `date` to the account with the given `account_id`.
     *
     * Returns a promise that is resolved once deposit complete.
     */
    static buy(account_id, date, amount, count, code) {
        return Instrument
            .query()
            .insert({account_id: account_id, bought: date, buy_price: amount, count: count, ticker: code})
            .then(() => {});
    }

    /**
     * Sell `count` instruments with ticker `code` for an `amount` on specific `date` from the account with the given `account_id`.
     *
     * Returns a promise that is resolved once deposit complete.
     */
    static sell(account_id, date, amount, count, code) {
        return Instrument
            .query()
            .whereNull('sold')
            .andWhere('account_id', account_id)
            .andWhere('ticker', code)
            .orderBy('bought')
            .orderBy('id')
            .then(having => {
                let ops = [];
                let remainingSell = amount;
                // Go through instruments we own starting from the oldest.
                having.forEach(instrument => {
                    if (count >= instrument.count) {
                        // If whole bundle is sold, mark it as sold and update sell price and sell date.
                        let sellPrice = count > instrument.count ? Math.round(instrument.count * amount/count) : remainingSell;
                        remainingSell -= sellPrice;
                        ops.push(instrument.soldFor(date, sellPrice));
                    } else {
                        // Otherwise we need to split the instrument to two: those that have been sold and those remaining.
                        ops.push(instrument.split(date, count, remainingSell));
                    }

                    count -= instrument.count;
                    if (count <= 0) {
                        return;
                    }
                });
                return Promise.all(ops);
            })
    }

    /**
     * Transfer `count` copies of instruments with ticker `code` on specific `date` away from the account with the given `account_id`.
     *
     * Returns a promise that is resolved once movement is complete.
     */
    static moveOut(account_id, date, count, code) {
        let origCount = count;
        return Instrument
            .query()
            .whereNull('sold')
            .andWhere('account_id', account_id)
            .andWhere('ticker', code)
            .orderBy('bought')
            .orderBy('id')
            .then(matches => {
                let moved = [];
                matches.forEach(instrument => {
                    if (count <= 0) {
                        return;
                    }
                    moved.push(instrument);
                    count -= instrument.count;
                });
                if (moved.length && !count) {
                    return Promise.all(moved.map(instrument => instrument.movedOut(date)));
                }
                throw new Error('Cannot find matching bundle(s) of ' + origCount + ' instruments ' + code + ' from account ' + account_id + ' to move out.');
            });
    }

    /**
     * Cancel transfer of `count` copies of instruments with ticker `code` on specific `date` away from the account with the given `account_id`.
     *
     * Returns a promise that is resolved once canceling is complete.
     */
    static cancelMoveOut(account_id, date, count, code) {
        return Instrument
            .query()
            .whereNotNull('sold')
            .andWhere('account_id', account_id)
            .andWhere('count', count)
            .andWhere('ticker', code)
            .then(matches => {
                if (matches.length === 0) {
                    throw new Error('Cannot find any out-bound movement bundle of ' + count + ' instruments ' + code + ' from account ' + account_id + '.');
                }
                if (matches.length > 1) {
                    throw new Error('Too many bundles (' +matches.length+ ') of ' + count + ' instruments ' + code + ' in account ' + account_id + ' to cancel moving.');
                }
                return matches[0].canceledSelling();
            });
    }
}

Instrument.knex(require('../db'));

module.exports = Instrument;
