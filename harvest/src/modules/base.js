const rp = require('request-promise');
const fs = require('fs');
const mkdirp = require('mkdirp');

/**
 * Base class for harvest-modules.
 */
class HarvestModule {

    constructor(config, requestPromise, logger) {
        this.config = config;
        this.log = logger;
        this.name = null;
        this.lib = require('../lib');
        this.cookieFetchUrl = null;
        this.cookiesFetched = false;
        this.headers = {
            DEFAULT: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.8,fi;q=0.6',
                'Connection': 'keep-alive',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
            },
            GET: {},
            POST: {
                'Accept':'application/json, text/javascript, */*; q=0.01',
                'Content-Type':'application/x-www-form-urlencoded',
                'X-Requested-With':'XMLHttpRequest',
            }
        };
        this.jar = rp.jar();
    }

    /**
     * Hook to check environment before using this module.
     */
    checkRequirements() {
        return true;
    }

    /**
     * Hook to download intial data etc.
     */
    async prepare() {
    }

    /**
     * Check if the configuration variable is set.
     * @param {string} conf Name of the configuration variable.
     * @param {string} env Name of the corresponding environmnt variable.
     */
    checkEnv(conf, env) {
        if (!this.config[conf]) {
            d.warning('Configuration needs environment', env, 'to be set.');
            return false;
        }
        return this.config[conf];
    }

    /**
     * Check if module is able to get the latest value for an instrument.
     */
    isLatestAvailable(ticker) {
        return false;
    }

    /**
     * Check if module is able to get daily data for the given range.
     */
    isDailyDataAvailable(ticker, start, end) {
        return false;
    }

    /**
     * Check if module can provide classification for the given instrument.
     */
    isInfoAvailable(ticker) {
        return false;
    }

    /**
     * Fetch the latest value for an ticker.
     * {ticker: "ABC:DEF", value: 1.24, currency: "EUR"}
     */
    getLatest(ticker) {
        throw new Error('Module does not implement getLatest().');
    }

    /**
     * Fetch daily closing values for date range
     * [{date: "2017-03-27", open: 1.00, close: 1.02, high: 1.05, low: 0.99, ticker: "ABC", volume: 12000}, ...]
     */
    getDailyData(ticker, start, end) {
        throw new Error('Module does not implement getDailyData().');
    }

    /**
     * Fetch the classification an ticker.
     * {ticker: "ABC:DEF", currency: "EUR", assetClass: "Equity", country: "FIN", industry: "Technology"}
     */
    getInfo(ticker) {
        throw new Error('Module does not implement getInfo().');
    }

    /**
     * Construct headers for the HTTP-request.
     * @param {String} method Request method.
     * @param {Object} extras Additional headers to override defaults.
     */
    getHeaders(method, extras={}) {
        return Object.assign({}, this.headers.DEFAULT, this.headers[method] || {}, extras);
    }

    /**
     * Check if we need cookies and fetch them if not fetched yet.
     */
    async checkCookies() {
        if (!this.cookieFetchUrl || this.cookiesFetched) {
            return;
        }
        this.cookiesFetched = true;
        this.get(this.cookieFetchUrl);
    }

    /**
     * Get the path to the cache file with the given name.
     * @param {String} cacheFile
     */
    cachePath(cacheFile) {
        const dir = __dirname + '/cache/' + this.name;
        mkdirp(dir);
        return dir + '/' + cacheFile;
    }

    /**
     * Check if the file is in cache and read it.
     * @param {String} cacheFile
     */
    readCache(cacheFile) {
        if (cacheFile) {
            const path = this.cachePath(cacheFile);
            if (fs.existsSync(path))  {
                this.log('Reading from cache', path);
                let data = fs.readFileSync(path);
                if (/\.json$/.test(cacheFile)) {
                    data = JSON.parse(data);
                }
                return data;
            }
        }
    }

    /**
     * If cache file is defined, write file to the cache.
     * @param {String} cacheFile
     * @param {Any} data
     * If file name ends to .json, data is automatically stringified and parsed.
     */
    writeCache(cacheFile, data) {
        if (cacheFile) {
            const path = this.cachePath(cacheFile);
            this.log('Saving to cache', path);
            if (/\.json$/.test(cacheFile)) {
                data = JSON.stringify(data, null, 2);
            }
            fs.writeFileSync(path, data);
        }
    }

    /**
     * Post the data using the current setup.
     * @param {String} url
     * @param {Object} data
     * @param {String} [cacheFile] Name of the cache file to store result.
     */
    async post(url, data, cacheFile) {

        const cached = this.readCache(cacheFile);
        if (cached !== undefined) {
            return cached;
        }

        await this.checkCookies();

        const origin = url.replace(/^([a-z]+:\/\/[^\/]+).*/, '$1');
        const host = origin.replace(/^[a-z]+:\/\//, '');
        const headers = this.getHeaders('POST', {'Host': host, 'Origin': origin, 'Referer': origin + '/'});
        const options = {
            method: 'POST',
            uri: url,
            jar: this.jar,
            form: data,
            gzip: true,
            json: true,
            headers: headers,
            resolveWithFullResponse: true
        };

        this.log('POST ' + url, JSON.stringify(data));
        return rp(options)
            .then(res => {
                this.writeCache(cacheFile, res.body);
                return res.body;
            });
    }

    async get(url) {

        await this.checkCookies();

        const headers = this.getHeaders('GET');
        const options = {
            method: 'GET',
            uri: url,
            gzip: true,
            headers: headers,
            jar: this.jar,
            resolveWithFullResponse: true
        };
        this.log('GET ' + url);
        return rp(options);
    }

}

module.exports = HarvestModule;
