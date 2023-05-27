import { activateWebPage } from './activate.js';
import { generateAdPopup } from './thumbnails.js';
import { advertisements } from './api.js';

const TILE_LAYER_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const COPYRIGHT_NOTICE =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const ZOOM_LEVEL = 10;
const cityCenter = {
  lat: 35.68948,
  lng: 139.6917,
};
const map = L.map('map-canvas')
  .on('load', () => {
    activateWebPage();
  })
  .setView(cityCenter, ZOOM_LEVEL);

L.tileLayer(TILE_LAYER_URL, {
  attribution: COPYRIGHT_NOTICE,
}).addTo(map);

const mainPinIcon = L.icon({
  iconUrl: '/img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
});

const marker = L.marker(cityCenter, {
  draggable: true,
  icon: mainPinIcon,
  autoPan: true,
  autoPanPadding: L.point([100, 100]),
});
marker.addTo(map);

const pinIcon = L.icon({
  iconUrl: '/img/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -20],
});

advertisements.map((ad) =>
  L.marker(ad.location, { icon: pinIcon })
    .bindPopup(generateAdPopup(ad))
    .addTo(map),
);

function closePopup() {
  map.closePopup();
}

const fieldAddress = document.querySelector('#address');

function updateFieldAddressWithLatLng(evt) {
  const newValue = evt.target.getLatLng();
  const fixedLat = newValue.lat.toFixed(5);
  const fixedLng = newValue.lng.toFixed(5);
  fieldAddress.value = `${fixedLat}, ${fixedLng}`;
}

marker.on('drag', updateFieldAddressWithLatLng);

function resetMarker() {
  marker.setLatLng(cityCenter);
}

function resetFieldAddress() {
  fieldAddress.value = `${cityCenter.lat}, ${cityCenter.lng}`;
}

export { closePopup, resetMarker, resetFieldAddress };
