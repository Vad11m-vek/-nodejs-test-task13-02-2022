const express = require('express');
const config = require('config')

const app = express();
const Port = config.get('port') || 3000;

app.set('view engine', 'ejs')
app.use(express.json({ extended: true }))
app.use('/', require('./routes/get.routes'))
app.listen(Port, () => {
	console.log(`App listening at port ${Port} . Pls wait 5 seconds before refresh page http://localhost:${Port}`)
})