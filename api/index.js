const express = require('express');
const app = express();
const cors = require('cors');
const port = 3376;

const resources = require('./routes/resources');
const admin = require('./routes/admin');

global._GAME = null;
global.apiPath = "http://******/spring-boot";

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set('view engine', 'ejs');

app.use('/static', express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/admin', admin);
app.use('/resources', resources);

app.use((req, res, next) => {
    res.status(404).send("Sorry, content not found");
    res.end();
});

var server = app.listen(port, () => {
    console.log(`Express server listening at http://******:${port}`);
});

module.exports = server;