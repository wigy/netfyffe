const rp = require('request-promise');

/**
 * An engine to collect and initialize harvest modules and provide interface calling them.
 */
class Engine {

    constructor() {
        this.modules = [];
        this.use('./modules/kraken');
    }

    /**
     * Load and use the module.
     */
    use(path) {
        const ModuleClass = require(path);
        this.modules.push(new ModuleClass(rp, (...msg) => {msg.splice(0, 0, path + ':'); d.apply(null, msg);}));
    }

    /**
     * Collect modules that supports the given function.
     */
    suitable(fn, args) {
        let ret = [];
        return this.modules.filter(module => module[fn + 'For'].apply(module, args));
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
     * Get the latest value for an instrument.
     */
    getLatest(ticker) {
        return this.call('getLatest', ticker);
    }
}

module.exports = new Engine();
