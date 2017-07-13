const moment = require('moment');

/**
 * Calculate the earliest date from the list of dates formatted as `YYYY-MM-DD`.
 */
module.exports = function(dates) {
    if (!dates.length) {
        return null;
    }
    let min = moment(dates[0]);
    dates.forEach(d => {
        let mom = moment(d);
        if (mom.isBefore(min)) {
            min = mom;
        }
    });
    return min.format('YYYY-MM-DD');
};