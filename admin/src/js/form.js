import L from 'leaflet';
import Mustache from 'mustache';
import { mymap, updateMap} from './map';

export function updateZoomValue() {
    $('#zoomValue').html($('#zoom').val());
    updateMap();
}

let lat1, lon1, lat2, lon2;
let latMeteor, lonMeteor;

let getLatLng1 = function (e) {
    let yellowIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    lat1 = e.latlng.lat;
    lon1 = e.latlng.lng;
    L.marker([lat1, lon1], { icon: yellowIcon }).addTo(mymap);
    $('#lat1').val(lat1);
    $('#lon1').val(lon1);
    mymap.off('click', getLatLng1);
}

let getLatLng2 = function (e) {
    let yellowIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    lat2 = e.latlng.lat;
    lon2 = e.latlng.lng;
    L.marker([lat2, lon2], { icon: yellowIcon }).addTo(mymap);
    $('#lat2').val(lat2);
    $('#lon2').val(lon2);
    mymap.off('click', getLatLng2);
}

let getLatLngMeteor = function (e) {
    latMeteor = e.latlng.lat;
    lonMeteor = e.latlng.lng;
    mymap.off('click', getLatLngMeteor);
    let meteorType = $('#pet-select').val();
    $.ajax({
        type: "POST",
        url: `${apiPath}/admin/meteorite`,
        dataType: "json",
        data: {"composition": meteorType, "position": [latMeteor, lonMeteor]}
    }).done(res => {
        let redIcon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        res.GAME.meteorites.forEach(e => {
            L.marker(e.impact, { icon: redIcon }).addTo(mymap);
        });
    });
}

function updateCorner1() {
    mymap.on('click', getLatLng1);
    return false;
}

function updateCorner2() {
    mymap.on('click', getLatLng2);
    return false;
}

function setZRR() {
    $.ajax({
        type: "POST",
        url: `${apiPath}/admin/zrr`,
        dataType: "json",
        data: {pt1: [lat1, lon1], pt2: [lat2, lon2]}
    }).done(res => {
        let pt1 = res.GAME.ZRR.pt1;
        let pt2 = res.GAME.ZRR.pt2;
        var rect = L.rectangle([pt1, pt2]);
        rect.addTo(mymap);
    });
    return false;
}

function setTTL() {
    let ttl = $('#ttl').val();
    $.ajax({
        type: "POST",
        url: `${apiPath}/admin/ttl`,
        dataType: "json",
        data: {ttl: ttl}
    });
    return false;
}

function launchMeteor() {
    mymap.on('click', getLatLngMeteor);
    return false;
}

function sendUser() {
    let login = new String($('#user-login').val().trim());
    if (login.length > 0) {
        $.ajax({
            type: "POST",
            url: `${apiPath}/admin/player/new`,
            dataType: 'json',
            data: {login: login}
        }).done(res => { 
            updateUsersList(res.GAME.players); 
        });
    } else {
        console.error("Le login est vide !");
    }
    return false;
}

function updateUsersList(users) {
    let template = $('#users-list-template').html();
    Mustache.parse(template);
    let rendered = Mustache.render(template, users);
    $('#users-list').html(rendered);
}

window.updateImage = (id, login) =>  {
    let image = window.prompt("Url de l'image : ");
    if (id && image.length > 0) {
        $.ajax({
            type: "PUT",
            url: `${apiPath}/resources/player/${id}/image`,
            dataType: "json",
            data: {
                image: image,
                login: login
            }
        }).done(res => {
            updateUsersList(res.GAME.players); 
        });
    } else {
        console.log("Le login ou l'url est manquant.");
    }
}

window.updateName = (id, login) => {
    let name = window.prompt("Votre login :", login);
    if (id && name != login && name.length > 0) {
        $.ajax({
            type: "PUT",
            url: `${apiPath}/resources/player/${id}/login`,
            dataType: "json",
            data: {
                name: name,
                login: login
            }
        }).done(res => {
            updateUsersList(res.GAME.players);
        });
    } else {
        console.log("Il n'y a rien à changer.");
    }
}

export {
    updateCorner1,
    updateCorner2,
    setTTL,
    setZRR,
    launchMeteor,
    sendUser,
    updateUsersList,
};