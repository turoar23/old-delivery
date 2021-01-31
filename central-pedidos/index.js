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
var n_reparto = 0;

/*var file = fs.readFileSync('./database/orders.json');
orders = JSON.parse(file);*/

env = {
    app: app,
    templates: templates,
    orders: orders,
    n_reparto: n_reparto,
    //delivery_groups: delivery_groups
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
/*httpsServer.listen(PORT_SSL, function () {
    console.log('HTTP funcionando en el puerto ' + PORT_SSL)
});*/

var telegram = require('./integrations/telegram')
var gloria = require('./integrations/gloria');
const { resourceUsage } = require('process');

/*app.get('/test', async (req, res) => {
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
});*/


app.post('/integration/gloriafood', async (req, res) => {
    let correct = req.headers['authorization'] == 'e7u2Z1e4SgNtY0jgci3aH5YJK9x1jZBSk';

    if (correct) {
        delivery_orders = req.body;
        if (delivery_orders['count'] > 0) {
            for (var i = 0; i < delivery_orders['count']; i++) {
                if (checkIfNewOrder(delivery_orders['orders'][i]))
                    console.log("Repetido");
                //let pedido = gloria.parseDelivery(delivery_orders['orders'][i]);
                else {
                    //TODO: Quitar campos que no se usan
                    console.log("Pedido");
                    let order = delivery_orders['orders'][i];
                    let id = order.id;
                    order['app'] = 'GloriaFood';
                    order['status'] = 'pedido';
                    order['group'] = 0;
                    order['repartido'] = 0;

                    orders.push(order);

                    if(order.latitude == 0 || order.longitude == 0){
                        getCoordinates(id)
                        .then(result => {
                            if(result.geometry != null){
                                let index = orders.findIndex(element => element.id == id);
                                orders[index].latitude = result.geometry.location.lat;
                                orders[index].longitude = result.geometry.location.lng;
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })
                    }
                }
                console.log(delivery_orders['orders'][i]['id'])
            }
            //telegram.notification(gloria.getMessage(pedido));
        }
        //fs.writeFileSync('./database/orders.json', JSON.stringify(orders));
        res.sendStatus(200);
    }
    else
        res.sendStatus(404);
});

function checkIfNewOrder(order) {
    return checkIfEqual(orders, order);
}
function checkIfEqual(arr1, arr2) {
    var find = false;

    for (var i = 0; i < arr1.length && !find; i++) {
        find = arr1[i]['id'] == arr2['id'];
    }
    return find;
}
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
//FIXME: arreglar esta gitanada
const menu_pedido = {
    reply_markup: {
        resize_keyboard: true,
        one_time_keyboard: true,
        keyboard: [['Grupo-1'], ['Grupo-2'], ['Grupo-3'], ['Menu']]
    }
};

telegram.bot.onText(/Grupo-(.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    console.log("hola");
    var aux = "";

    if (msg.text == 'Grupo-1') {
        aux = getRouteByGroup(1);
    }
    else if (msg.text == 'Grupo-2') {
        aux = getRouteByGroup(2);
    }
    else if (msg.text == 'Grupo-3') {
        aux = getRouteByGroup(3);
    }
    
    telegram.bot.sendMessage(chatId, aux, menu_pedido);
    //bot.sendMessage(chatId, "¿Que grupo te vas a llevar?", menu_pedido);
});
function getRouteByGroup(_group) {
    orders_group = orders.filter(element => element.group == _group);

    if (orders_group.length > 0) {
        let url_base = "https://www.google.com/maps/dir/?api=1&";
        let restaurante = 'origin=Avenida+Periodista+Rodolfo+Salazar+29,+Alicante&';
        let places = "";

        for (var i = 0; i < orders_group.length - 1; i++) {
            if (i == 0)
                places += "waypoints=";
            let aux = orders_group[i].client_address_parts.street + ", " + orders_group[i].client_address_parts.zipcode + ", " + orders_group[i].client_address_parts.city;
            aux = aux.replace(/ /g, "+");
            console.log(aux);
            places += aux;
            if (i < orders_group.length - 2)
                places += "|";
        }
        let aux = orders_group[orders_group.length - 1].client_address_parts.street + ", " + orders_group[orders_group.length - 1].client_address_parts.zipcode + ", " + orders_group[orders_group.length - 1].client_address_parts.city;
        aux = aux.replace(/ /g, "+");
        let url = url_base + restaurante + places + "&destination=" + aux;

        return url;
    }

    return "No hay pedidos asginados";
}

function getRouteByGroupCoordinates(_group) {
    orders_group = orders.filter(element => element.group == _group);

    if (orders_group.length > 0) {
        let url_base = "https://www.google.com/maps/dir/?api=1&";
        let restaurante = 'origin=Avenida+Periodista+Rodolfo+Salazar+29,+Alicante&';
        let places = "";

        for (var i = 0; i < orders_group.length - 1; i++) {
            if (i == 0)
                places += "waypoints=";
            let aux = orders_group[i].latitude + ", " + orders_group[i].longitude;
            //aux = aux.replace(/ /g, "+");
            console.log(aux);
            places += aux;
            if (i < orders_group.length - 2)
                places += "|";
        }
        let aux = orders_group[orders_group.length - 1].latitude + ", " + orders_group[orders_group.length - 1].longitude;
        aux = aux.replace(/ /g, "+");
        let url = url_base + restaurante + places + "&destination=" + aux;

        return url;
    }

    return null;
}


function getCoordinates(_id){
    let url_base = "https://maps.googleapis.com/maps/api/geocode/json?address=";
    let url_end = "&key=AIzaSyDyHtNxhfMFZ3dLeg1eI4x2v4xhVGtu1f8";

    let index = orders.findIndex(element => element.id == _id);

    return new Promise((resolve, reject) => {
        aux = orders[index].client_address_parts.street + "," + orders[index].client_address_parts.city
        const url = url_base + aux + url_end;

        request({
            url: url,
            method: 'GET',
        }, function (err, res, body) {
            if (err) reject(err);
            resolve(body);
        });
    });
}