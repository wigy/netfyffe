const moment = require('moment');
const db = require('./db');

async function getDailyData(ticker, start, end) {
  // Do not let `end` to be today or in future.
  if (end >= moment().format('YYYY-MM-DD')) {
    end = moment().subtract(1, 'day').format('YYYY-MM-DD');
  }

  return {end};
}

module.exports = {
  getDailyData
};
