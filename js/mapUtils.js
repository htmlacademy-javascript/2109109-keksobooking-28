import { getData } from './api.js';
import { showAlert } from './utility.js';
import {
  filterByType,
  filterByPrice,
  filterByRooms,
  filterByGuests,
  filterByFeatures,
} from './filter.js';

const PLACE_TYPES = {
  flat: 'Квартира',
  bungalow: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
  hotel: 'Отель',
};

const TILE_LAYER = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const COPYRIGHT =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const DEFAULT_ZOOM = 12;

const DEFAULT_COORDINATES = {
  lat: 35.6895,
  lng: 139.69171,
};

const MAIN_ICON_CONFIG = {
  url: './img/main-pin.svg',
  width: 52,
  height: 52,
  anchorX: 26,
  anchorY: 52,
};

const ICON_CONFIG = {
  url: './img/pin.svg',
  width: 40,
  height: 40,
  anchorX: 20,
  anchorY: 40,
};

const MAX_MARKERS = 10;

const addressInput = document.querySelector('#address');

let isMapInitialized = false;

const setAddress = (latitude, longitude) => {
  addressInput.value = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
};

setAddress(DEFAULT_COORDINATES.lat, DEFAULT_COORDINATES.lng);

const map = L.map('map-canvas')
  .on('load', () => {
    isMapInitialized = true;
  })
  .setView(DEFAULT_COORDINATES, DEFAULT_ZOOM);

const createIcon = ({ url, width, height, anchorX, anchorY }) =>
  L.icon({
    iconUrl: url,
    iconSize: [width, height],
    iconAnchor: [anchorX, anchorY],
  });

const mainPinIcon = createIcon(MAIN_ICON_CONFIG);
const pinIcon = createIcon(ICON_CONFIG);

const mainMarker = L.marker(DEFAULT_COORDINATES, {
  draggable: true,
  icon: mainPinIcon,
});

L.tileLayer(TILE_LAYER, {
  attribution: COPYRIGHT,
}).addTo(map);

mainMarker.addTo(map);

const handleMoveEnd = ({ target }) => {
  const { lat, lng } = target.getLatLng();
  setAddress(lat, lng);
};

mainMarker.on('moveend', handleMoveEnd);

function createCustomPopup(entry) {
  const cardElement = document
    .querySelector('#card')
    .content.querySelector('.popup')
    .cloneNode(true);

  const elementConfig = [
    { selector: '.popup__title', property: 'textContent', key: 'title' },
    {
      selector: '.popup__text--address',
      property: 'textContent',
      key: 'address',
      prefix: 'Адрес: ',
    },
    {
      selector: '.popup__text--price',
      property: 'textContent',
      key: 'price',
      suffix: ' ₽/ночь',
    },
    {
      selector: '.popup__type',
      property: 'textContent',
      key: 'type',
      mapping: PLACE_TYPES,
    },
    {
      selector: '.popup__text--capacity',
      property: 'textContent',
      key: 'capacity',
      format: (value) => `${value.rooms} комнаты для ${value.guests}`,
    },
    {
      selector: '.popup__text--time',
      property: 'textContent',
      key: 'time',
      format: (value) =>
        `Заезд после ${value.checkin}, выезд до ${value.checkout}`,
    },
  ];

  elementConfig.forEach(
    ({
      selector,
      property,
      key,
      prefix = '',
      suffix = '',
      mapping,
      format,
    }) => {
      const element = cardElement.querySelector(selector);
      const value = entry.offer[key];
      if (value !== undefined && value !== null) {
        element[property] = format
          ? format(value)
          : prefix + (mapping ? mapping[value] : value) + suffix;
      } else {
        element.classList.add('hidden');
      }
    },
  );

  const featuresElements = cardElement.querySelectorAll('.popup__feature');
  if (entry.offer.features) {
    featuresElements.forEach((feature) => {
      const thisFeature = feature.classList[1].substring(16);
      if (!entry.offer.features.includes(thisFeature)) {
        feature.classList.add('hidden');
      }
    });
  } else {
    cardElement.querySelector('.popup__features').classList.add('hidden');
  }

  return cardElement;
}

const markerGroup = L.layerGroup().addTo(map);

function createMarker(entry) {
  const marker = L.marker(
    {
      lat: entry.location.lat,
      lng: entry.location.lng,
    },
    {
      icon: pinIcon,
    },
  );

  marker.addTo(markerGroup).bindPopup(createCustomPopup(entry));
}

function renderMarkers(items) {
  items.forEach(createMarker);
}

function rerenderMarkers(data) {
  markerGroup.clearLayers();
  renderMarkers(data.slice(0, MAX_MARKERS));
}

let ads = [];
let filteredAds = [];

const initData = (data) => {
  ads = data;
  rerenderMarkers(ads);
};

const filterData = () => {
  filteredAds = [ads]
    .map(filterByType)
    .map(filterByPrice)
    .map(filterByRooms)
    .map(filterByGuests)
    .map(filterByFeatures)[0];

  rerenderMarkers(filteredAds);
};

getData(initData, showAlert);

function resetMap() {
  const popupElement = document.querySelector('.leaflet-popup');
  if (popupElement) {
    popupElement.remove();
  }

  map.flyTo(DEFAULT_COORDINATES, DEFAULT_ZOOM);
  mainMarker.setLatLng(DEFAULT_COORDINATES);
  setAddress(DEFAULT_COORDINATES.lat, DEFAULT_COORDINATES.lng);
}

export { isMapInitialized as isMapInit, renderMarkers, filterData, resetMap };
