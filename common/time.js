/**
 * Time utilities.
 */
function time() {
    return new Date().getTime();
}

// Get seconds since the given timestamp.
time.since=(timestamp) => (time() - timestamp) / 1000;

module.exports = time;
