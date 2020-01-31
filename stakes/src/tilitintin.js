const rp = require('request-promise');
const config = require('./config');

/**
 * Fetch tags data.
 */
let tags;
async function getTags() {
  if (tags) {
    return tags;
  }
  const { token } = await rp({
    method: 'POST',
    uri: `${config.TILITINTIN_URL}/auth`,
    body: {
      user: config.TILITINTIN_USER,
      password: config.TILITINTIN_PASSWORD
    },
    json: true
  });
  const data = await rp({
    uri: `${config.TILITINTIN_URL}/db/${config.TILITINTIN_DB}/tags/tokens`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    json: true
  });
  tags = data.reduce((prev, cur) => ({...prev, [cur.tag]:
    `${config.TILITINTIN_URL}/db/${config.TILITINTIN_DB}/tags/${cur.id}/view?token=${cur.token}`
  }), {});
  return tags;
}

module.exports = {
  getTags
};
