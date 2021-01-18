var express = require('express');
const https = require('https');
const http = require('http');
const path = require('path');
//const ejs = require('ejs');
const bodyParser = require('body-parser');
var helmet = require('helmet');
const fs = require('fs');

var privateKey = fs.readFileSync('keys/key.pem', 'utf8');
var certificate = fs.readFileSync('keys/cert.pem', 'utf8');

var credentials = { key: privateKey, cert: certificate };

require('dotenv').config();

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

// To secure the app
app.use(helmet());

const PORT = process.env.PORT || 8080;
const PORT_SSL = process.env.PORT_SSL || 8433;
// To disable an error message in the telegram bot api
process.env.NTBA_FIX_319 = 1;

// Rutas
require('./routes')(env);

/*app.listen(PORT, function () {
    console.log(`Aplicación lanzada en el puerto ${PORT}!`);
});*/

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(PORT, function () {
    console.log('HTTP funcionando en el puerto ' + PORT)
});
httpsServer.listen(PORT_SSL, function () {
    console.log('HTTP funcionando en el puerto ' + PORT_SSL)
});

/*var telegram = require('./integrations/telegram')
var gloria = require('./integrations/gloria');

app.get('/test', async (req, res) => {
    let rawdata = fs.readFileSync('./examples/gloria.json');
    let orders_delivery = JSON.parse(rawdata);

    console.log(orders_delivery['count']);
    var pedido = gloria.parseDelivery(orders_delivery['orders'][0]);
    var message = gloria.getMessage(pedido);

    telegram.notification(message);

    res.sendStatus(200);
});

app.get('/manualUpdate', async (req, res) => {
    gloria.poll()
        .then(result => {
            delivery_orders = JSON.parse(result);
            if (delivery_orders['count'] > 0) {
                console.log('Hay pedido');
                for (var i = 0; i < delivery_orders['count']; i++) {
                    let pedido = gloria.parseDelivery(delivery_orders['orders'][i]);
                    telegram.notification(gloria.getMessage(pedido));
                }
            }
            else
                console.log("No hay pedidos");
        })
        .catch(err => {

        });
    res.sendStatus(200);
});


app.post('/test2', async (req, res) => {
    console.log("hola");
    let correct = req.headers['authorization'] == 'e7u2Z1e4SgNtY0jgci3aH5YJK9x1jZBSk';

    if (correct) {
        delivery_orders = req.body;
        if (delivery_orders['count'] > 0) {
            console.log('Hay pedido');
            for (var i = 0; i < delivery_orders['count']; i++) {
                let pedido = gloria.parseDelivery(delivery_orders['orders'][i]);
                telegram.notification(gloria.getMessage(pedido));
            }
        }
        res.sendStatus(200);
    }
    else
    res.sendStatus(404);
});*/

// Check if there is an order new
/*var minutes = 1, the_interval = minutes * 60 * 1000;
setInterval(function () {
    gloria.poll()
        .then(result => {
            delivery_orders = JSON.parse(result);
            if (delivery_orders['count'] > 0) {
                console.log('Hay pedidos');
                for (var i = 0; i < delivery_orders['count']; i++) {
                    let pedido = gloria.parseDelivery(delivery_orders['orders'][i]);
                    telegram.notification(gloria.getMessage(pedido));
                }
            }
        })
        .catch(err => {

        });
}, the_interval);
*/