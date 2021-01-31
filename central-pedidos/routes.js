const request = require('request');

module.exports = function (env) {

    app = env.app;
    templates = env.templates;
    orders = env.orders;
    n_reparto = env.n_reparto;
    delivery_groups = env.delivery_groups;

    /**
 * Devuelve la vista que se encarga de mostrar los pedidos actuales
 */
    app.get('/', async (req, res) => {
        //TODO: mirar si este set es necesario
        res
            .set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
            .render(templates + "/index");
        //res.status(200).send({result: null, err: null});
    });
    /**
     * 
     */
    app.get('/add', async (req, res) => {
        res.render(templates + "/add");
    });
    /**
     * Devuelve la vista master que tiene funciones CRUD sobre los pedidos
     */
    app.get('/master', async (req, res) => {
        //TODO: mirar si este set es necesario
        res
            .set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
            .render(templates + '/master', {
                platforms: ['Recoger', 'Glovo', 'Delivero', 'Uber Eats', 'Just Eats'],
                status: ['Preparando', 'Listo'],
            });
    });

    // ----------------------------------------------
    // Rutas para la gestion de los pedidos de gloria
    // ----------------------------------------------

    const url_gloria = '/gloriafood'

    app.get(url_gloria + '/index', async (req, res) => {
        res
            .set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
            .render(templates + "/gloria");
    });
    /**
     * Devuelve el array con los pedidos almacenados en el servidor
     */
    app.get(url_gloria + '/getOrders', async (req, res) => {
        res.status(200).send({ result: orders, err: null });
    })
    /**

    // ---------------------------------------------
    // Funciones de cambio de estados de las ordenes
    // ---------------------------------------------

    /**
     * Devuelve el array con los pedidos almacenados en el servidor
     */
    app.get('/getOrders', async (req, res) => {
        let orders_not_completed = [];

        for (var i = 0; i < orders.length; i++) {
            //console.log(orders[i]);
            if (orders[i].status == null || orders[i].status != 'completed')
                orders_not_completed.push(orders[i]);

        }

        res.status(200).send({ result: orders_not_completed, err: null });
    })
    /**
     * Añade una nueva orden pasada por el metodo POST
     */
    app.post('/addOrder', async (req, res) => {
        let id = req.body.id;
        let app = req.body.app;
        let status = req.body.status;

        var aux = {
            id: id,
            app: app,
            status: status
        }
        if (orders.find(element => element.id == id) == null) {
            orders.push(aux);
            console.log("Se agrego pedido")
            console.log(orders)
        }
        else
            console.log("Ya existe ese id")

        res.status(200).send({ result: 'added', err: null });
    })
    /**
     * Actualiza el estado basandose en el id y status
     */
    app.post('/updateStatus', async (req, res) => {
        let id = req.body.id;
        let status = req.body.status;
        let group = req.body.group;

        order = orders.find(element => element.id == id)

        if (order != null) {
            order.status = status;
            order.group = group;
        }
        else
            console.log("Error, ese id no existe");

        res.status(200).send({ result: 'updated', err: null });
    })
    /**
     * Procesa la de borrar un pedido, el cual se pasa por body.id
     */
    app.post('/removeOrder', async (req, res) => {
        let id = req.body.id;
        console.log(id);
        order = orders.findIndex(element => element.id == id)

        if (order != null) {
            //console.log(order);
            orders.splice(order, 1);
            console.log("Id " + order + " borrado");
        }
        else
            console.log("Error, id que no existe");

        res.status(200).send({ result: 'removed', err: null });
    });
    /**
     * Calcula la mejor ruta en base a los pedidos que se pasan, y con esto
     * se calcula para poder hacer la ruta
     */
    //TODO: simplificar haciendo que solo envie el id en lugar de todo el pedido
    app.post('/route', async (req, res) => {
        let ordersToDelivery = req.body.orders;
        let betterRoute = req.body.better;
        let group = 0;
        let same = true;

        // Comprobamos que todos tengan el mismo grupo
        for (var i = 0; i < ordersToDelivery.length && same; i++) {
            if (i == 0)
                group = ordersToDelivery[i].group;
            else
                same = group == ordersToDelivery[i].group;
        }
        if (same) {
            for (var i = 0; i < ordersToDelivery.length; i++) {
                //ordersToDelivery[i].n_reparto = n_reparto;
                //ordersToDelivery[i].optimize = true;
                // Buscamos el valor
                let index = orders.findIndex(element => element.id == ordersToDelivery[i].id);
                // Lo eliminamos
                orders.splice(index, 1);
            }
            if (betterRoute) {
                sortBetterWay(ordersToDelivery);
            }
            else {
                orders.push(...ordersToDelivery);
            }

            res.sendStatus(200);
        } else
            res.status(300).send({ result: 'Error, grupos diferentes', err: null });
    });

    app.get('/group', async (req, res) => {
        res.status(200).send({ result: orders, err: null });
    });
    /**
     * Intercambia de orden de pedidos los pedidos con id1 y id2
     * @param {*} id1 
     * @param {*} id2 
     */
    function swapOrders(id1, id2) {
        pos1 = orders.findIndex(element => element.id == id1);
        pos2 = orders.findIndex(element => element.id == id2);

        if (pos1 != -1 && pos2 != -1) {
            [orders[pos1], orders[pos2]] = [orders[pos2], orders[pos1]];
            return true;
        }
        else
            return false;
    }
    utils = require('./utils.js');

    app.get('/group-1', async (req, res) => {
        let url = getRouteByGroup(1)

        res.status(200).send({ result: url, err: null });
    });
}

function calculateBetterWay(_orders) {
    let url_base = 'https://eu1.locationiq.com/v1/optimize/driving/';
    let restaurante = '-0.478650,38.362730;'
    let last_url = '?key=pk.5e174228b5337c69daae7d25f6a7b26d&steps=false&source=first&destination=last&overview=full';

    var aux = "";

    for (var i = 0; i < _orders.length; i++) {
        if (_orders[i].type == 'delivery') {
            if (i != 0 && i < _orders.length - 1) aux += ";"

            if (_orders[i].longitude == 0 && _orders[i] == 0) {
                getCoordinates(_order)
                    .then(result => {
                        console.log("Hola" + result);
                        result.results[0].geometry;
                        aux += result.lng + "," + result.lat;
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
            else
                aux += _orders[i].longitude + "," + _orders[i].latitude;
        }
    }

    return new Promise((resolve, reject) => {
        const url = url_base + restaurante + aux + last_url;

        request({
            url: url,
            method: 'GET',
        }, function (err, res, body) {
            if (err) reject(err);
            resolve(body);
        });
    });
}

function sortBetterWay(_orders) {

    calculateBetterWay(_orders)
        .then(result => {
            //console.log(result);
            var new_order = JSON.parse(result).waypoints;
            //console.log(_orders.length);
            //console.log(new_order);

            aux = [];

            for (var i = 0; i < new_order.length; i++) {
                aux.push(_orders[new_order[i].waypoint_index]);
            }

            //console.log(aux);

            orders.push(...aux);

            //console.log(orders);

        })
        .catch(err => {
            console.log(err);
        });
}


function getCoordinates(_order) {
    let url_base = 'https://maps.googleapis.com/maps/api/geocode/json?address=,';
    let addres = _order.client_address.replace(/ /g, "+");
    let last_url = '&key=AIzaSyDyHtNxhfMFZ3dLeg1eI4x2v4xhVGtu1f8';

    return new Promise((resolve, reject) => {
        const url = url_base + addres + last_url;
        console.log(url);
        request({
            url: url,
            method: 'GET',
        }, function (err, res, body) {
            if (err) reject(err);
            resolve(body);
        });
    });
}

function getRouteByGroup(_group) {
    orders_group = orders.filter(element => element.group == _group);

    if (orders_group.length > 0) {
        let url_base = "https://www.google.com/maps/dir/?api=1&";
        let restaurante = 'origin=Avenida+Periodista+Rodolfo+Salazar+29,+Alicante&';
        let places = "";

        for (var i = 0; i < orders_group.length - 1; i++) {
            if (i == 0)
                places += "&waypoints=";
            let aux = orders_group[i].client_address_parts.street + ", " + orders_group[i].client_address_parts.zipcode + ", " + orders_group[i].client_address_parts.city;
            places += aux;
            if (i < orders_group.length - 2)
                places += "|";
        }
        let aux = orders_group[orders_group.length - 1].client_address_parts.street + ", " + orders_group[orders_group.length - 1].client_address_parts.zipcode + ", " + orders_group[orders_group.length - 1].client_address_parts.city;
        let url = url_base + restaurante + places + "&destination=" + aux;

        return url;
    }

    return null;
}