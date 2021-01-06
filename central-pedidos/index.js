var express = require('express');
const http = require('http');
const path = require('path');
const ejs = require('ejs');
const bodyParser = require('body-parser');

const templates = path.join(__dirname, "views");
const public = path.join(__dirname, "public");
const app = express();

var orders = [];

env = {
    app: app,
    templates: templates,
    orders: orders,
}

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Public folder
app.use(express.static('public'));
// Views
app.set('views', './views')
app.set('view engine', 'ejs');

const PORT = process.env.PORT || 8080;

// Rutas
require('./routes')(env);

app.listen(PORT, function () {
    console.log(`Aplicación lanzada en el puerto ${PORT}!`);
});