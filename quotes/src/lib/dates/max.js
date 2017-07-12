const moment = require('moment');

/**
 * Calculate the latest date from the list of dates formatted as `YYYY-MM-DD`.
 */
module.exports = function(dates) {
    if (!dates.length) {
        return null;
    }
    let max = moment(dates[0]);
    dates.forEach(d => {
        let mom = moment(d);
        if (mom.isAfter(max)) {
            max = mom;
        }
    });
    return max.format('YYYY-MM-DD');
};