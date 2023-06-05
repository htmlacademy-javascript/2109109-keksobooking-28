import { getData, ERROR_MESSAGE } from './api.js';
import { enableFilters, filterData } from './filters.js';
import { showAlert, debounce } from './util.js';

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

const MAP_MARKER_PAN_PADDING = [100, 100];

const RERENDER_DELAY = 500;

const addressField = document.querySelector('#address');

let isMapInit = false;

const setAddress = (lat, lng) => {
  addressField.value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
};

const map = L.map('map-canvas')
  .on('load', () => {
    isMapInit = true;
  })
  .setView(DEFAULT_COORDINATES, DEFAULT_ZOOM);

const mainPinIcon = L.icon({
  iconUrl: MAIN_ICON_CONFIG.url,
  iconSize: [MAIN_ICON_CONFIG.width, MAIN_ICON_CONFIG.height],
  iconAnchor: [MAIN_ICON_CONFIG.anchorX, MAIN_ICON_CONFIG.anchorY],
});

const pinIcon = L.icon({
  iconUrl: ICON_CONFIG.url,
  iconSize: [ICON_CONFIG.width, ICON_CONFIG.height],
  iconAnchor: [ICON_CONFIG.anchorX, ICON_CONFIG.anchorY],
});

const mainMarker = L.marker(DEFAULT_COORDINATES, {
  draggable: true,
  icon: mainPinIcon,
  autoPan: true,
  autoPanPadding: L.point(MAP_MARKER_PAN_PADDING),
});

const createCustomPopup = (entry) => {
  const cardTemplate = document
    .querySelector('#card')
    .content.querySelector('.popup');
  const cardElement = cardTemplate.cloneNode(true);

  const setElementTextContent = (selector, text) => {
    const element = cardElement.querySelector(selector);
    if (text) {
      element.textContent = text;
    } else {
      element.classList.add('hidden');
    }
  };

  setElementTextContent('.popup__title', entry.offer.title);
  setElementTextContent(
    '.popup__text--address',
    entry.offer.address ? `Адрес: ${entry.offer.address}` : null,
  );
  setElementTextContent(
    '.popup__text--price',
    entry.offer.price ? `${entry.offer.price} ₽/ночь` : null,
  );
  setElementTextContent(
    '.popup__type',
    entry.offer.type ? PLACE_TYPES[entry.offer.type] : null,
  );
  setElementTextContent(
    '.popup__text--capacity',
    entry.offer.rooms && entry.offer.guests
      ? `${entry.offer.rooms} комнаты для ${entry.offer.guests}`
      : null,
  );
  setElementTextContent(
    '.popup__text--time',
    entry.offer.checkin && entry.offer.checkout
      ? `Заезд после ${entry.offer.checkin}, выезд до ${entry.offer.checkout}`
      : null,
  );

  if (entry.offer.features) {
    const popupFeatures = cardElement.querySelectorAll('.popup__feature');
    popupFeatures.forEach((feature) => {
      const thisFeature = feature.classList[1].substring(16);
      if (!entry.offer.features.includes(thisFeature)) {
        feature.classList.add('hidden');
      }
    });
  } else {
    cardElement.querySelector('.popup__features').classList.add('hidden');
  }

  setElementTextContent('.popup__description', entry.offer.description);

  const photosContainer = cardElement.querySelector('.popup__photos');
  if (entry.offer.photos) {
    photosContainer.innerHTML = '';
    entry.offer.photos.forEach((photo) => {
      const img = document.createElement('img');
      img.classList.add('popup__photo');
      img.width = '45';
      img.height = '40';
      img.alt = 'Фотография жилья';
      img.src = photo;
      photosContainer.appendChild(img);
    });
  } else {
    photosContainer.classList.add('hidden');
  }

  setElementTextContent('.popup__avatar', entry.author.avatar);

  return cardElement;
};

const markerGroup = L.layerGroup().addTo(map);

const createMarker = (entry) => {
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
};

function renderMarkers(items) {
  items.forEach((item) => {
    createMarker(item);
  });
}

const rerenderMarkers = (data) => {
  markerGroup.clearLayers();
  renderMarkers(data.slice(0, MAX_MARKERS), markerGroup);
};

let ads = [];

const initData = (data) => {
  ads = data;
  rerenderMarkers(ads);
  enableFilters();
};

const showFilteredData = debounce(() => {
  const filteredData = filterData(ads);
  rerenderMarkers(filteredData);
}, RERENDER_DELAY);

getData()
  .then(initData)
  .catch(() => {
    showAlert(ERROR_MESSAGE);
  });

const resetMap = () => {
  const mapPopup = document.querySelector('.leaflet-popup');
  if (mapPopup) {
    mapPopup.remove();
  }

  map.setView(DEFAULT_COORDINATES, DEFAULT_ZOOM);
  mainMarker.setLatLng(DEFAULT_COORDINATES);
};

const checkIsMapInit = () => isMapInit;

setAddress(DEFAULT_COORDINATES.lat, DEFAULT_COORDINATES.lng);

L.tileLayer(TILE_LAYER, {
  attribution: COPYRIGHT,
}).addTo(map);

mainMarker.addTo(map);

mainMarker.on('moveend', (evt) => {
  const adress = evt.target.getLatLng();
  setAddress(adress.lat, adress.lng);
});

export {
  checkIsMapInit,
  renderMarkers,
  rerenderMarkers,
  resetMap,
  showFilteredData,
};
