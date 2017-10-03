const config = require('./config');
const rp = require('request-promise');
const globby = require('globby');

/**
 * An engine to collect and initialize harvest modules and provide interface calling them.
 */
class Engine {

    constructor() {
        this.modules = [];
    }

    /**
     * Load and use the module.
     */
    use(path) {
        const ModuleClass = require(path);
        let module = new ModuleClass(config, rp, (...msg) => {msg.splice(0, 0, path + ':'); d.apply(null, msg);});
        ['isLatestAvailable', 'isDailyDataAvailable', 'isInfoAvailable'].forEach(fn => {
            if (!module[fn]) {
                d.error('Module', module.name, 'does not implement', fn);
            }
        });
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
        if (config.harvestModules) {
            config.harvestModules.split(':').forEach(path => this.use(path));
        }
        await globby(__dirname + '/modules/**/*-harvest-module.js').then(files => {
            files = files.map(x => x.replace(/.*\/(modules\/.*)\.js$/,'$1'));
            files.forEach(x => this.use('./' + x));
        });
        return Promise.all(this.modules.map(module => module.prepare()));
    }

    /**
     * Hooks to modules.
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
}

module.exports = new Engine();
