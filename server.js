import fetch from "node-fetch";
import express from 'express';
import moment from 'moment';
import fs from 'fs';

const app = express();
const Port = '3000';
//timer on the 74th line

function logTime() { return moment().format() };
refreshData();

let getPromiseImportantSource = null;
let getPromiseNotImportantSource = null;
let ImportantAnswer = '';
let NoImportantAnswer = '';
let param = {};

app.set('view engine', 'ejs')
app.listen(Port, () => {
	console.log(`App listening at port http://localhost:${Port} . Pls wait 5 seconds before refresh page`)
})

async function refreshData() {
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

app.get('/', (req, res) => {

	refreshData();

	if (ImportantAnswer) {
		param = {
			ImportantAnswer: ImportantAnswer,
			NoImportantAnswer: " не дождались фраз",
			ImportantSource: null,
			notImportantSource: null,
			moment: moment
		}
	} else if (NoImportantAnswer) {
		param = {
			ImportantAnswer: ImportantAnswer,
			NoImportantAnswer: NoImportantAnswer,
			ImportantSource: null,
			notImportantSource: null,
			moment: moment
		}
	} else if (ImportantAnswer == null && NoImportantAnswer == null || getPromiseImportantSource == null && getPromiseNotImportantSource == null) {
		param = {
			ImportantAnswer: " не дождались новостей",
			NoImportantAnswer: " не дождались фраз",
			ImportantSource: null,
			notImportantSource: null,
			moment: moment
		}
	} else if (getPromiseNotImportantSource == null) {
		param = {
			ImportantAnswer: null,
			NoImportantAnswer: " не дождались фраз",
			ImportantSource: getPromiseImportantSource,
			notImportantSource: null,
			moment: moment
		}
	} else if (getPromiseImportantSource == null) {
		param = {
			ImportantAnswer: " не дождались новостей",
			NoImportantAnswer: null,
			ImportantSource: null,
			notImportantSource: getPromiseNotImportantSource,
			moment: moment
		}
	} else {
		param = {
			ImportantAnswer: null,
			NoImportantAnswer: null,
			ImportantSource: getPromiseImportantSource,
			notImportantSource: getPromiseNotImportantSource,
			moment: moment
		}
	}

	res.render('pages/index', param)

})