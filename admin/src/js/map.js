import L from 'leaflet';
import { updateUsersList } from './form';
// For the leaflet icons to appear properly.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// initialisation de la map
let lat = 45.782, lng = 4.8656, zoom = 19;

let mymap = L.map('map', {
    center: [lat, lng],
    zoom: zoom
});

// Création d'un "tile layer" (permet l'affichage sur la carte)
L.tileLayer('https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.jpg90?access_token=YOUR_TOKEN', {
    maxZoom: 22,
    minZoom: 1,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'YOUR_TOKEN'
}).addTo(mymap);

// Ajout d'un marker
let greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.marker([45.78207, 4.86559], { icon: greenIcon })
    .addTo(mymap).bindPopup('Entrée du bâtiment<br><strong>Nautibus</strong>.')
    .openPopup();

// Clic sur la carte
mymap.on('click', e => {
    lat = e.latlng.lat;
    lng = e.latlng.lng;
    updateMap();
});

// Mise à jour de la map
function updateMap() {
    // Affichage à la nouvelle position
    mymap.setView([lat, lng], zoom);

    // La fonction de validation du formulaire renvoie false pour bloquer le rechargement de la page.
    return false;
}

let markers = [];

// Load game info
function updateGameInfo() {
    $.ajax({
        type: "GET",
        url: `${apiPath}/resources/game`,
        contentType: "json",
    }).done(res => {
        if (res && res.GAME) {
            let game = res.GAME;
            for (let i = 0; i < markers.length; i++) {
                markers[i].remove();
            }
            markers = [];
            // ZRR
            if (game.ZRR) {
                let rect = L.rectangle([game.ZRR.pt1, game.ZRR.pt2]);
                rect.addTo(mymap);
                markers.push(rect);
            }
            // TLL
            if (game.TTL > 0) {
                $('#ttl').val(game.TTL);
            }
            // Meteorites
            if (game.meteorites.length > 0) {
                let redIcon = new L.Icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                });
                game.meteorites.forEach(e => {
                    if (e.impact != null && !e.hasBeenLooted) {
                        let marker = L.marker(e.impact, { icon: redIcon }).addTo(mymap);
                        marker.bindPopup(e.composition);
                        markers.push(marker);
                    }
                });
            }
            // Users added
            if (game.players.length > 0) {
                game.players.forEach(e => {
                    if (e.position != null) {
                        let marker = L.marker(e.position).addTo(mymap);
                        marker.bindPopup(`${e.login}, ttl : ${e.ttl}`);
                        markers.push(marker);
                    }
                });
                updateUsersList(game.players);
            }
        }
    });
}

let refreshGame = setInterval(updateGameInfo, 5000);

export {
    mymap,
    updateMap
};