module.exports = {
    country: new (require('./country'))(),
    assetClass: new (require('./asset-class'))(),
    market: new (require('./market'))(),
    sector: new (require('./sector'))(),
    currency: new (require('./currency'))(),
};
