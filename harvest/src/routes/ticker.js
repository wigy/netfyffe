const rp = require('request-promise');
const express = require('express');
const ticker = express.Router();
const moment = require('moment');
const db = require('../db');
const config = require('../config');

/**
 * Helper to check existence of the harvester module and instantiating it.
 */
function harvester(res) {

    const harvester = config.harvester_module;

    if (!harvester) {
        res.status(500).send("The harvester module is not defined in NETFYFFE_HARVEST environment variable.");
        return null;
    }

    return new (require(harvester))(rp);
}

/**
 * Fetch the daily data for the given ticker in the specified range of dates.
 * TODO: Use `apidoc` to document.
 */
ticker.get('/:ticker([A-Z0-9:]+)/:start(\\d{4}-\\d{2}-\\d{2})/:end(\\d{4}-\\d{2}-\\d{2})', (req, res) => {

    const {ticker, start, end} = req.params;
    // TODO: Check for existing data.
    // TODO: Think about how to handle gaps in data to be fetched?
    // TODO: Add mocha tests using mocked harvester.
    // TODO: Move fetching and logic to the separate service module that uses memory cache.
    // TODO: More logging.

    // Use harvester to fetch data and store it to the database.
    const engine = harvester(res);

    if (engine) {
        engine.getDailyData(ticker, start, end)
        .then(data => {
            return data; // TODO: Drop
            // Prepare fast lookup table per date.
            let lookup = {};
            data.map(q => lookup[q.date]=q);
            // Fill in caps in the date range by creating new entries.
            let latest = null;
            let ret = [];
            for(let s = moment(start), e = moment(end); s.diff(e) <= 0; s.add(1,'day')) {
                let day = s.format('YYYY-MM-DD');
                if (lookup[day]) {
                    ret.push(lookup[day]);
                    latest = lookup[day].close;
                } else if (latest !== null) {
                    ret.push({date: day, open: latest, close: latest, high: latest, low: latest, ticker: ticker, volume: 0});
                }
            }
            // Save data.
            db('quotes').insert(ret).catch(err => d.error(err));
            return ret;
        })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            d.error(err);
            res.status(500).send("Error");
        });
    }
});

module.exports = ticker;
