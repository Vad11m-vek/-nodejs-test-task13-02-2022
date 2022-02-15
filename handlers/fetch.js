const fetch = require("node-fetch");
const moment = require('moment');
const fs = require('fs');
const config = require('config')

const timeout = config.get('timeout') || 6000;

function logTime() { return moment().format() };
// refreshData();
module.exports = async refreshData => {
	try {

		//timer Start Important Source
		console.time("getPromiseImportantSource")

		getPromiseImportantSource = await fetchWithTimeout('http://slowpoke.desigens.com/json/1/7000', { method: 'GET' }).then(res => res);
		ImportantAnswer = "";
	}
	catch (err) {
		if (err.name == 'AbortError') {
			if (getPromiseImportantSource == null) {
				ImportantAnswer = " не дождались новостей";
				console.log(" не дождались новостей");
				fs.appendFile('readme.log', logTime() + " не дождались новостей" + "\n", function (err, result) {
					if (err) console.log('error', err);
				});
			}
			getPromiseImportantSource = null;
		} else (console.log(err))
	}

	//time End Important Source
	console.timeEnd("getPromiseImportantSource")

	try {

		//timer Start Not Important Source		
		console.time("getPromiseNotImportantSource")

		getPromiseNotImportantSource = await fetchWithTimeout('http://slowpoke.desigens.com/json/2/3000', { method: 'GET' }).then(res => res);
		NoImportantAnswer = "";
	} catch (err) {
		if (getPromiseNotImportantSource == null) {
			NoImportantAnswer = " не дождались фраз";
			console.log(" не дождались фраз")
			fs.appendFile('readme.log', logTime() + " не дождались фраз" + "\n", function (err, result) {
				if (err) console.log('error', err);
			});
		} else (console.log(err))
		getPromiseNotImportantSource = null;
	}

	//time End Not Important Source	
	console.timeEnd("getPromiseNotImportantSource")

}

async function fetchWithTimeout(resource, options = {}) {
	//timer waiting response 6sec	
	const { timeout = 6000 } = options;

	const controller = new AbortController();

	const id = setTimeout(() => {
		controller.abort()
	}, timeout);
	const response = await fetch(resource, {
		...options,
		signal: controller.signal
	});

	clearTimeout(id);

	return response.json();
}