const Model = require('objection').Model;

class Instrument extends Model {
    static get tableName() {
        return 'instruments';
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
            .then(having => {
                let ops = [];
                let remainingSell = amount;
                // Go through instruments we own starting from the oldest.
                having.forEach(instrument => {
                    if (count >= instrument.count) {
                        // If whole bundle is sold, mark it as sold and update sell price and sell date.
                        let sellPrice = count > instrument.count ? Math.round(instrument.count * amount/count) : remainingSell;
                        remainingSell -= sellPrice;
                        ops.push(Instrument
                            .query()
                            .patch({sold: date, sell_price: sellPrice})
                            .where('id', instrument.id)
                        );
                    } else {
                        // Otherwise we need to split the instrument those that have been sold and those remaining.
                        let remainingBuy = Math.round(instrument.buy_price * ((instrument.count - count) / instrument.count));
                        ops.push(Instrument
                            .query()
                            .patch({
                                sold: date,
                                count: count,
                                buy_price: instrument.buy_price - remainingBuy,
                                sell_price: remainingSell
                            })
                            .where('id', instrument.id)
                        );
                        ops.push(Instrument
                            .query()
                            .insert({
                                account_id: account_id,
                                bought: instrument.bought,
                                buy_price: remainingBuy,
                                count: instrument.count - count,
                                ticker: code})
                        );
                    }

                    count -= instrument.count;
                    if (count <= 0) {
                        return;
                    }
                });
                return Promise.all(ops);
            })
    }
}

Instrument.knex(require('../db'));

module.exports = Instrument;
