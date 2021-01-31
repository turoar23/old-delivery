/*function getRouteByGroup(_group) {
    orders_group = orders.filter(element => element.group == 1);

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
    }
}*/