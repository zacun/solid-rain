import './css/style.css';
import 'leaflet/dist/leaflet.css';

import { mymap, updateMap } from './js/map';
import { updateZoomValue, updateCorner1, updateCorner2, setTTL, setZRR, launchMeteor, sendUser } from './js/form';

// To avoid 'function *** is not defined'
$('#setCorner1').on('submit', () => {
    updateCorner1();
    return false;
});
$('#setCorner2').on('submit', (e) => {
    updateCorner2();
    return false;
});
$('#setZrr').on('submit', () => {
    setZRR();
    return false;
});
$('#setTtl').on('submit', () => {
    setTTL();
    return false;
});
$('#setMeteorType').on('submit', () => {
    launchMeteor();
    return false;
});
$('#addUser').on('submit', () => {
    sendUser();
    return false;
});

// Abonnement aux événements de changement
$('#lat').change(updateMap);
$('#lon').change(updateMap);
$('#zoom').change(updateZoomValue);