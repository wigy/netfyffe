const cheerio = require('cheerio');

/**
 * Helper to extract data from HTML document.
 */
class HuntHTML {

    constructor(html, debug = false) {
        this.debug = debug;
        this.html = html;
        this.$ = cheerio.load(html);
    }

    /**
     * Display arguments if in debug-mode.
     */
    log(...args) {
        if (this.debug) {
            console.log.apply(console.log, args);
        }
    }

    /**
     * Dump colored output of element list content.
     */
    dump(tabs, elems) {
        if (!elems) {
            return;
        }
        for (let i=0; i < elems.length; i++) {
            switch(elems[i].type) {
                case 'text':
                    this.log(tabs + '\u001b[33m' + JSON.stringify(elems[i].data) + '\u001b[39m');
                    break;
                case 'tag':
                    this.log(tabs + '\u001b[35m' + elems[i].name + '\u001b[39m', JSON.stringify(elems[i].attribs));
                    break;
                default:
                    d.error('No handler for HTML element type', elems[i].type, 'in hunt().');
            }
            this.dump(tabs + '  ', elems[i].children);
        }
    }

    /**
     * Pick the elements matching the filtering function.
     * @param {Array} elems
     * @param {Function} filter
     * @return {Array}
     */
    select(elems, filter) {
        let filtered = [];
        if (!elems) {
            return [];
        }
        if (filter) {
            for (let i=0; i < elems.length; i++) {
                if (filter(elems[i])) {
                    filtered.push(elems[i]);
                }
                filtered = filtered.concat(this.select(elems[i].children, filter));
            }
        }
        return filtered;
    }

    /**
     * Hunt for data from HTML.
     * @param {String} selector A CSS selector expression to narrow down elements.
     * @param {Function} filter A filter matching the wanted elements.
     * @param {Function} mapper A function extracting wanted data from the elements.
     * @param {Boolean} flat If set, do not combine objects.
     *
     * For example:
     *
     *   hunt('ul.myList li', (elem) => elem.name === 'b', (elem) => elem.children[0].data);
     *
     * This will retrieve all bold content from list items on the list called `myList` and
     * return them as an array.
     *
     * If all elements returned by the mapper are objects, they are combined into single object.
     */
    hunt(selector, filter, mapper, flat=false) {

        let elems = this.$(selector);

        this.log('\n\u001b[32m=[ ORIGINAL ]=========\u001b[39m');
        this.dump('', elems);
        if (!filter) {
            return elems;
        }

        let filtered = this.select(elems, filter);
        this.log('\n\u001b[32m=[ FILTERED ]=========\u001b[39m');
        this.dump('', filtered);
        if (!mapper) {
            return filtered;
        }

        this.log('\n\u001b[32m=[ MAPPED ]=========\u001b[39m');
        let ret = [];
        filtered.forEach(elem => {
            this.dump('', [elem]);
            let item = mapper(elem);
            ret.push(item);
            this.log('  \u001b[32m==>', item,'\u001b[39m');

        });
        // If they are all objects, combine them.
        if (flat) {
            //ret = ret.map(e => e[0]);
        } else if (ret.filter(r => typeof(r)==='object').length === ret.length) {
            ret = ret.reduce((p, c) => Object.assign(p, c), {});
        }

        this.log('');
        this.log('\n\u001b[32m=[ RESULT ]=========\u001b[39m\n');
        this.log('  \u001b[32m', ret,'\u001b[39m');

        return ret;
    }

    /**
     * Similar to hunt() but display results of each step.
     */
    huntDebug(selector, filter, mapper, flat=false) {
        const old = this.debug;
        this.debug = true;
        const ret = this.hunt(selector, filter, mapper, flat);
        this.debug = old;
        return ret;
    }
}

module.exports = HuntHTML;
