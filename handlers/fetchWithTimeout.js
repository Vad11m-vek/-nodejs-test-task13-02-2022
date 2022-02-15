const fetch = require("node-fetch");
module.exports = function (url, options, timeout = 7000) {
	return Promise.race([
		fetch(url, options).then(res => res.json()),
		new Promise((_, reject) =>
			setTimeout(() => reject(new Error('timeout')), timeout)
		)
	]);
}