const moment = require('moment');
const db = require('./db');
const engine = require('./engine');

/**
 * Fill in data to the database from the period.
 * @param {String} ticker
 * @param {String} start
 * @param {String} end
 */
async function fillDailyData(ticker, start, end) {

  const cache = {};

  // How many days of extra data?
  const DAY_MARGIN = 1;
  // Expand the range to ensure data for starting day and reduce future request of same date vicinity.
  start = moment(start).subtract(DAY_MARGIN, 'days').format('YYYY-MM-DD');
  end = moment(end).add(DAY_MARGIN, 'days').format('YYYY-MM-DD');
  if (end >= moment().format('YYYY-MM-DD')) {
    end = moment().subtract(1, 'day').format('YYYY-MM-DD');
  }

  // Look for old data.
  const oldData = await db('quotes').select('*').where('date', '>=', start).andWhere('date', '<=', end).andWhere('ticker', ticker).orderBy('date');
  // Fill in cache.
  oldData.map(entry => cache[entry.date] = entry);
  // Fetch.
  d.info('Fetching daily data from', start, 'to', end, 'for', ticker);
  const data = await engine.getDailyData(ticker, start, end);

  // Construct a set for dates not found from cache.
  const fresh = new Set(data.filter(entry => !cache[entry.date]).map(e => e.date));
  data.map(entry => cache[entry.date] = entry);

  // Bring data from the previous day to missing days.
  let last;
  for(let s = moment(start), e = moment(end); s.diff(e) <= 0; s.add(1,'day')) {
    const date = s.format('YYYY-MM-DD');
    if (cache[date]) {
      last = cache[date];
    } else if (last) {
      fresh.add(date);
      cache[date] = {
        ticker,
        date,
        close: last.close,
        open: last.close,
        high: null,
        low: null,
        volume: null
      }
    }
  }

  // Store new data.
  for (let date of fresh) {
    await db('quotes').insert(cache[date]);
  }
}

/**
 * Collect daily data for the ticker during the given period.
 * @param {String} ticker
 * @param {String} start
 * @param {String} end
 */
async function getDailyData(ticker, start, end) {
  // Do not let `end` to be today or in future.
  if (end >= moment().format('YYYY-MM-DD')) {
    end = moment().subtract(1, 'day').format('YYYY-MM-DD');
  }

  const days = 1 + Math.round(moment(end).diff(start) / (1000*60*60*24));
  // Look for old data if we got all.
  const data = await db('quotes').select('*').where('date', '>=', start).andWhere('date', '<=', end).andWhere('ticker', ticker).orderBy('date');
  if (data.length === days) {
    return data;
  }
  // Otherwise fill it.
  await fillDailyData(ticker, start, end);
  return await db('quotes').select('*').where('date', '>=', start).andWhere('date', '<=', end).andWhere('ticker', ticker).orderBy('date');
}

async function fillSpotPrice(ticker, time) {
  data = await engine.getSpotPrice(ticker, time);
  if (data) {
    await db('spots').insert({ ticker: data.ticker, time: moment.utc(data.time), price: data.price });
  }
  return data;
}

async function getSpotPrice(ticker, time) {
  const data = await db('spots').select('*').where('ticker', ticker).andWhere('time', moment.utc(time))
  if (!data.length) {
    return await fillSpotPrice(ticker, time);
  }
  return data[0];
}

module.exports = {
  getDailyData,
  getSpotPrice,
};
