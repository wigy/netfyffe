module.exports = {
    country: new (require('./country'))(),
    assetClass: new (require('./asset-class'))(),
    market: new (require('./market'))(),
    sector: new (require('./sector'))(),
    industry: new (require('./industry'))(),
    currency: new (require('./currency'))(),
};
