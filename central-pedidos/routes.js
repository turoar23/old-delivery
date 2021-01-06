module.exports = function (env) {

    app = env.app;
    templates = env.templates;
    orders = env.orders;

    /**
 * Devuelve la vista que se encarga de mostrar los pedidos actuales
 */
    app.get('/', async (req, res) => {
        res.render(templates + "/index");
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
        res.render(templates + '/master', {
            platforms: ['Recoger', 'Glovo', 'Delivero', 'Uber Eats', 'Just Eats'],
            status: ['Preparando', 'Listo'],
        });
    });

    // ---------------------------------------------
    // Funciones de cambio de estados de las ordenes
    // ---------------------------------------------
    /**
     * Devuelve el array con los pedidos almacenados en el servidor
     */
    app.get('/getOrders', async (req, res) => {
        res.status(200).send({ result: orders, err: null });
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
        order = orders.find(element => element.id == id)

        if (order == null)
            order.status = status;

        console.log("Error, id que no existe");

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
}