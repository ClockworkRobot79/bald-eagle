const express = require('express');
const app = express();
const expressSession = require('express-session');

const bodyParser = require('body-parser');
const flash = require('connect-flash');

const indexRoutes = require('./routes/index');

app.use(express.static(__dirname + "/public"));
app.use(express.static("./lib"));
app.set('view engine', 'ejs');

// 'body-parse' takes form data and builds a JS object out of it that we can manipulate
app.use(bodyParser.urlencoded({extended: true}));

// wire up all the sub-routes
app.use('/', indexRoutes);

const PORT = process.env.PORT || 1979;
const server = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
module.exports = server;