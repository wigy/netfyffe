const fs = require('fs');
const config = require('./config');
const globby = require('globby');

/**
 * An engine to collect and initialize harvest modules and provide interface calling them.
 */
class Engine {

    constructor() {
        this.modules = [];
    }

    /**
     * Get the list of supprted commands.
     */
    commands() {
        return ['Latest', 'DailyData', 'Info', 'ETFContent', 'TickerSearch', 'Misc'];
    }

    /**
     * Check if the given functionality exists.
     * @param {String} cmd
     */
    isCommand(cmd) {
        return this.commands().map(c => 'get' + c).indexOf(cmd) >= 0;
    }

    /**
     * Load and use the module.
     */
    use(path) {
        const ModuleClass = require(path);
        let module = new ModuleClass(config, (...msg) => {msg.splice(0, 0, path + ':'); d.apply(null, msg);});
        d.info('Using module', module.name, 'from', path);
        if (module.checkRequirements()) {
            this.modules.push(module);
        } else {
            d.warning('Module', path,'is not fulfilling requirements and is ignored.');
        }
    }

    /**
     * Collect modules that supports the given function.
     */
    suitable(fn, args) {
        let ret = [];
        fn = fn.replace(/get(.*)/,'is$1Available');
        return this.modules.filter(module => module[fn].apply(module, args));
    }

    /**
     * Find the path for the module.
     * @param {String} name Module name without `-harvest-module`.
     * @return {String} Full path to module or null if not found.
     */
    findModule(name) {
        if (fs.existsSync(__dirname + '/modules/private/' + name + '-harvest-module.js')) {
            return __dirname + '/modules/private/' + name + '-harvest-module.js';
        }
        if (fs.existsSync(__dirname + '/modules/' + name + '-harvest-module.js')) {
            return __dirname + '/modules/' + name + '-harvest-module.js';
        }
        return null;
    }

    /**
     * Find the modules and call the function.
     */
    async call(fn, ...args) {
        let modules = this.suitable(fn, args);
        if (!modules.length) {
            return Promise.reject('No modules implementing `' + fn + '()` for arguments ' + JSON.stringify(args));
        }

        while(modules.length) {
            try {
                let res = await modules[0][fn].apply(modules[0], args);
                return res;
            } catch(err) {
                d.error('Module', modules[0].name, 'failed:', err);
            }
            modules.splice(0, 1);
        }
    }

    /**
     * Load all modules or one specified module.
     *
     * @param {string} [path] A path to the single module to load.
     */
    async init(path) {
        if (path) {
            path = path.replace(/\.js$/,'');
            this.use(path);
            return this.modules[this.modules.length - 1].prepare();
        }
        if (this.modules.length) {
            return;
        }
        if (config.HARVEST_MODULES) {
            config.HARVEST_MODULES.split(':').forEach(path => this.use(path));
        } else {
            await globby(__dirname + '/modules/**/*-harvest-module.js').then(files => {
                files = files.map(x => x.replace(/.*\/(modules\/.*)\.js$/,'$1'));
                files.forEach(x => this.use('./' + x));
            });
        }
        return Promise.all(this.modules.map(module => module.prepare()));
    }

    /**
     * Hooks to module functions.
     */
    async getLatest(ticker) {
        await this.init();
        return this.call('getLatest', ticker);
    }

    async getDailyData(ticker, start, end) {
        await this.init();
        return this.call('getDailyData', ticker, start, end);
    }

    async getInfo(ticker) {
        await this.init();
        return this.call('getInfo', ticker);
    }

    async getETFContent(provider, ticker) {
        await this.init();
        return this.call('getETFContent', provider, ticker);
    }

    async getMisc(...args) {
        await this.init();
        return this.call('getMisc', ...args);
    }

    async getTickerSearch(text, type) {
        await this.init();
        text = text.trim();
        return this.call('getTickerSearch', text, type)
            .then(data => {
                if (data.length === 0) {
                    let regex = /\sCorp\.?$/i;
                    if (regex.test(text)) {
                        text = text.replace(regex, '');
                        return this.getTickerSearch(text, type);
                    }
                    regex = /-Reg$/i;
                    if (regex.test(text)) {
                        text = text.replace(regex, '');
                        return this.getTickerSearch(text, type);
                    }
                    regex = /\sLtd\.?$/i;
                    if (regex.test(text)) {
                        text = text.replace(regex, '');
                        return this.getTickerSearch(text, type);
                    }
                }
                return data;
            });
    }

    async getPair(exchange, sell, buy, stamp) {
        await this.init();
        return this.call('getPair', exchange, sell, buy, stamp)
    }

    async getSpotPrice(ticker, stamp) {
        await this.init();
        return this.call('getSpotPrice', ticker, stamp)
    }
}

module.exports = new Engine();
