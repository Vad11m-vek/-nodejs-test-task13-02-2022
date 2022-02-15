const fetch = require('./fetchWithTimeout');
const config = require('config');

config.has('timeout') ? timeout = config.get('timeout') : timeout = 2000; // throw after max 6 seconds timeout error

module.exports = function importantSource() {
	return Promise.resolve(
		// call as usual or with timeout as 3rd argument
		fetch('http://slowpoke.desigens.com/json/1/7000', { method: 'GET' }, timeout)

	)
}

