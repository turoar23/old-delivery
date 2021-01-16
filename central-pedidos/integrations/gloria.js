const moment = require('moment-timezone');
//const fetch = require('node-fetch');
const request = require('request');

/**
 * 
 * @param {JSON} order 
 */
exports.parseDelivery = function (order) {

    details = {
        address: order['client_address'],
        time_order: moment(order['accepted_at']).tz('Europe/Madrid').format('HH:mm:ss YYYY-MM-DD'),
        time_delivery: moment(order['fulfill_at']).tz('Europe/Madrid').format('HH:mm:ss YYYY-MM-DD'),
    }

    return details;
}

exports.getMessage = function (order) {
    let message = "\*Direccion:\*\n" + order['address'] + "\n*Hora pedido:*\n" + order['time_order'] + "\n*Hora entrega:*\n" + order['time_delivery'];

    return message;
}
//const axios = require('axios')

/*exports.poll = function () {
    let config = {
        headers: {
            'Authorization': "GmoV9inQJs7lyrqmBD",
            'Accept': "application/json",
            'Glf-Api-Version': "2"
        }
    };
    axios
        .post('https://pos.globalfoodsoft.com/pos/order/pop', null, config)
        .then(res => {
            return res;
        })
        .catch(error => {
            console.error(error)
        })
}*/

/*exports.poll = function () {
    getOrders()
        .then(result => {
            console.log(result);
            return result;
        })
        .catch(err => {

        });

};*/

exports.poll = function getOrders() {
    return new Promise((resolve, reject) => {
        request({
            url: 'https://pos.globalfoodsoft.com/pos/order/pop',
            method: 'POST',
            headers: {
                'Authorization': "GmoV9inQJs7lyrqmBD",
                'Accept': "application/json",
                'Glf-Api-Version': "2"
            },
        }, function (err, res, body) {
            if (err) reject(err);
            resolve(body);
        });
    });
};
