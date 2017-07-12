const moment = require('moment');

/**
 * Calculate the earliest and the latest date from the list of dates formatted as `YYYY-MM-DD`.
 */
module.exports = function(dates) {
    if (!dates.length) {
        return null;
    }
    let min = moment(dates[0]);
    let max = moment(dates[0]);
    dates.forEach(d => {
        let mom = moment(d);
        if (mom.isBefore(min)) {
            min = mom;
        }
        if (mom.isAfter(max)) {
            max = mom;
        }
    });
    return [min.format('YYYY-MM-DD'), max.format('YYYY-MM-DD')];
};