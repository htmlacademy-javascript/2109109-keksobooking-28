import { activateWebPage } from './activate.js';
import { usersAds, createAdPopup } from './thumbnails.js';

const TILE_LAYER = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const COPYRIGHT =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const ZOOM = 10;
const cityCenter = {
  lat: 35.68948,
  lng: 139.6917,
};
const map = L.map('map-canvas')
  .on('load', () => {
    activateWebPage();
  })
  .setView(cityCenter, ZOOM);

L.tileLayer(TILE_LAYER, {
  attribution: COPYRIGHT,
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

usersAds.map((ad) =>
  L.marker(ad.location, { icon: pinIcon })
    .bindPopup(createAdPopup(ad))
    .addTo(map),
);

const fiedAdress = document.querySelector('#address');
marker.on('drag', (evt) => {
  const newValue = evt.target.getLatLng();
  const fixedLat = newValue.lat.toFixed(5);
  const fixedLng = newValue.lng.toFixed(5);
  fiedAdress.value = `${fixedLat}, ${fixedLng}`;
});
