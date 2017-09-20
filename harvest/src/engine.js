const config = require('./config');
const rp = require('request-promise');
const globby = require('globby');

/**
 * An engine to collect and initialize harvest modules and provide interface calling them.
 */
class Engine {

    constructor() {
        this.modules = [];
        if (config.harvestModules) {
            config.harvestModules.split(':').forEach(path => this.use(path));
        }
    }

    /**
     * Load and use the module.
     */
    use(path) {
        d.info('Using module', path);
        const ModuleClass = require(path);
        const module = new ModuleClass(config, rp, (...msg) => {msg.splice(0, 0, path + ':'); d.apply(null, msg);});
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
    call(fn, ...args) {
        let modules = this.suitable(fn, args);
        if (!modules.length) {
            return Promise.reject('No modules implementing `' + fn + '()` for arguments ' + JSON.stringify(args));
        }
        // TODO: If one fails, we could use here another one (use async/await).
        return modules[0][fn].apply(modules[0], args);
    }

    /**
     * Load all modules.
     */
    async init() {
        if (this.modules.length) {
            return;
        }
        await globby(__dirname + '/modules/**/*-harvest-module.js').then(files => {
            files = files.map(x => x.replace(/.*\/(modules\/.*)\.js$/,'$1'));
            files.forEach(x => this.use('./' + x));
        });
        await Promise.all(this.modules.map(module => module.prepare()));
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
}

module.exports = new Engine();
