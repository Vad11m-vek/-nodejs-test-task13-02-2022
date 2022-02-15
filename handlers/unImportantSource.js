const fetch = require('./fetchWithTimeout');
const config = require('config');

config.has('timeout') ? timeout = config.get('timeout') : timeout = 6000; // throw after max 6 seconds timeout error

module.exports = function unImportantSource() {
	return Promise.resolve(
		// call as usual or with timeout as 3rd argument
		fetch('http://slowpoke.desigens.com/json/2/3000', { method: 'GET' }, timeout)
	)
}

