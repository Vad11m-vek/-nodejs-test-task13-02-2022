const { Router } = require('express');
const moment = require('moment');
const importantSource = require('../handlers/importantSource.js');
const unImportantSource = require('../handlers/unImportantSource.js');
const router = Router();




router.get('/', (req, res) => {


	let param = {
		ImportantAnswer: null,
		NoImportantAnswer: null,
		ImportantSource: null,
		notImportantSource: null,
		moment: moment
	};

	unImportantSource()
		.then(data => {
			// handle result
			param.notImportantSource = data;
			param.moment = moment;

		})
		.catch((e) => {
			// handle errors and timeout error
			console.log("error" + e)
			param.NoImportantAnswer = " не дождались фраз";
			param.moment = moment;
		})
	importantSource()
		.then(data => {
			// handle result
			param.ImportantSource = data;
			param.moment = moment;
			param.notImportantSource == null ? param.NoImportantAnswer = " не дождались фраз" : null
			res.render('index', param)
		})
		.catch((e) => {
			// handle errors and timeout error
			console.log("error" + e)
			param.ImportantAnswer = " не дождались новостей";
			param.moment = moment;
			res.render('index', param)
		})
	// 	param = {
	// 		ImportantAnswer: null,
	// 		NoImportantAnswer: null,
	// 		ImportantSource: getPromiseImportantSource,
	// 		notImportantSource: getPromiseNotImportantSource,
	// 		moment: moment
	// 	}



})

module.exports = router