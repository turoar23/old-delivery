const GLOBAL_CABECERAS = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};
var local_orders = [];

const url_base = window.location.origin;

async function getOrders() { //Recibe el JSON del servidor
    const url = '/getOrders/';

    request = {
        method: "GET",
        headers: GLOBAL_CABECERAS,
    };

    try {
        let peticion = await fetch(url, request);
        let r = await peticion.json();
        //alert(mensajes);

        if (r.result) {
            return r.result;
        }
    }
    catch (error) {
        console.log(error);
    }
}
async function addOrder(_id, _app, _status) {
    const url = url_base + '/addOrder/';

    let payload = {
        id: _id,
        app: _app,
        status: _status
    };
    console.log(JSON.stringify(payload))

    request = {
        method: "POST",
        body: JSON.stringify(payload),
        headers: GLOBAL_CABECERAS,
    };

    try {
        let peticion = await fetch(url, request);
        let r = await peticion.json();
        //alert(mensajes);

        if (r.result) {
            console.log(r.result);
        }
    }
    catch (error) {
        console.log(error);
    }
}

async function removeOrder(_id) {
    const url = url_base + '/removeOrder/';

    let payload = {
        id: _id,
    };
    console.log(JSON.stringify(payload))

    request = {
        method: "POST",
        body: JSON.stringify(payload),
        headers: GLOBAL_CABECERAS,
    };

    try {
        let peticion = await fetch(url, request);
        let r = await peticion.json();
        //alert(mensajes);

        if (r.result) {
            console.log(r.result);
        }
    }
    catch (error) {
        console.log(error);
    }
}
async function updateOrder(_id, _status, _group) {
    const url = url_base + '/updateStatus';

    let payload = {
        id: _id,
        status: _status,
        group: _group
    }

    request = {
        method: "POST",
        body: JSON.stringify(payload),
        headers: GLOBAL_CABECERAS
    };

    try {
        let peticion = await fetch(url, request);
        let r = await peticion.json();

        if (r.result) {
            console.log(r.result);
        }
    } catch (error) {
        console.log(error);
    }
}

async function sendRoute(_orders, _better) {
    const url = url_base + '/route';

    let payload = {
        orders: _orders,
        better: _better
    }

    request = {
        method: "POST",
        body: JSON.stringify(payload),
        headers: GLOBAL_CABECERAS
    };

    try {
        let peticion = await fetch(url, request);
        let r = await peticion.json();

        if (r.result) {
            console.log(r.result);
        }
    } catch (error) {
        console.log(error);
    }
}

// -----------------------------------------------------
// Funciones que interactuan directamente con el usuario
// -----------------------------------------------------

/**
 * Actualiza el DOM con los pedidos que esten vivos
 */
async function update() {
    let orders = await getOrders();
    var template = document.querySelector('#order_template');

    if (!equals(orders, local_orders)) {
        $('.orders').empty();
        $('.orders-making').empty();

        if (orders.length > 0) {
            for (var i = 0; i < orders.length; i++) {
                // Si esta repartido, no lo cargamos directamente
                if (orders[i].status != 'repartido') {
                    let clone = document.importNode(template.content, true);
                    let app = orders[i].app
                    let tipo = "";
                    let status = orders[i].status;
                    let group = orders[i].group;

                    if (app == 'Glovo') tipo = "glovo";
                    else if (app == 'Uber Eats') tipo = 'uber';
                    else if (app == 'Delivero') tipo = 'delivero';
                    else if (app == 'Just Eat') tipo = 'just-eat';
                    else if (app == 'Recoger') tipo = 'recoger';
                    else if (app == 'GloriaFood') tipo = 'gloria';
                    else tipo = 'generico';

                    clone.querySelector('.content').classList.add(tipo);
                    clone.querySelector('.app').textContent = app;
                    clone.querySelector('.id').textContent = orders[i].id;
                    //clone.querySelector('.status').textContent = status;
                    clone.querySelector('.cp').textContent = orders[i].client_address_parts.zipcode;
                    clone.querySelector('.time').textContent = orders[i].fulfill_at.split('T')[1];

                    if (clone.querySelector('#remove') != null) {
                        clone.querySelector('#remove').addEventListener("click", function () {
                            let _id = $(this).parent().find('.id').text()
                            removeOrder(_id);
                            update();
                        });
                    }
                    if (clone.querySelector('#ready') != null) {
                        if (status == 'Preparando') {
                            clone.querySelector('#ready').addEventListener("click", function () {
                                let _id = $(this).parent().find('.id').text()
                                updateOrder(_id, 'Listo');
                                update();
                            });
                        }
                        else
                            clone.querySelector('#ready').remove();
                    }
                    if (group > 0)
                        $('#grupo' + group).append(clone);
                    else
                        $('#sinAsignar').append(clone);
                }
            }
            local_orders = orders;
        }
    }
}
/**
 * Añade una nueva orden basandose en los valores del formulario del pedido
 */
function newOrder() {
    let id = $('.formulario #id').val();
    let app = $('.formulario #app').val();
    let status = $('.formulario #status').val();

    if (id != "") {
        $('.formulario #id').val("");
        addOrder(id, app, status);
    }
    update();
}
/**
 * Cuando se confirma el reparto, ya se puede calcular la mejor ruta
 */
function confirmarReparto(grupo) {
    let orders = $('#grupo' + grupo).find('.order');

    for (var i = 0; i < orders.length; i++) {
        id = orders[i].querySelector('.id').textContent;
        var order_index = local_orders.findIndex(element => element.id == id);

        local_orders[order_index].grupo = 4;
        updateOrder(id, 'completado', 4);
    }
}

function betterRoute(grupo) {
    let orders = $('#grupo' + grupo).find('.order');
    let aux = [];

    for (var i = 0; i < orders.length; i++) {
        id = orders[i].querySelector('.id').textContent;
        var order_index = local_orders.findIndex(element => element.id == id);

        local_orders[order_index].group = grupo;

        aux.push(local_orders[order_index]);
    }
    if (aux.length > 0)
        sendRoute(aux, true);
}