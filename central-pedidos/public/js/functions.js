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
async function updateOrder(_id, _status){
	const url = url_base + '/updateStatus';

	let payload = {
		id: _id,
		status: _status
	}

	request = {
		method: "POST",
		body: JSON.stringify(payload),
		headers: GLOBAL_CABECERAS
	};

	try{
		let peticion = await fetch(url, request);
		let r = await peticion.json();
		
		if(r.result){
			console.log(r.result);
		}
	}catch(error){
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
				var clone = document.importNode(template.content, true);
				var app = orders[i].app
				var tipo = "";

				if (app == 'Glovo') tipo = "glovo";
				else if (app == 'Uber Eats') tipo = 'uber';
				else if (app == 'Delivero') tipo = 'delivero';
				else if (app == 'Just Eat') tipo = 'just-eat';
				else if (app == 'Recoger') tipo = 'recoger';

				clone.querySelector('.content').classList.add(tipo);
				clone.querySelector('.app').textContent = orders[i].app;
				clone.querySelector('.id').textContent = orders[i].id;
				clone.querySelector('.status').textContent = orders[i].status;
				if (clone.querySelector('#remove') != null){
					clone.querySelector('#remove').addEventListener("click", function () {
						let _id = $(this).parent().find('.id').text()
						console.log(_id);
						removeOrder(_id);
						update();
					});
				}
				if(orders[i].status == 'Preparando')
					$('.orders-making').append(clone);
				else
					$('.orders').append(clone);
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