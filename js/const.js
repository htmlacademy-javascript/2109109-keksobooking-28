const NUMBER_OF_ADS = 10;
const MAX_ROOMS = 15;
const MAX_GUESTS = 10;
const MIN_PRICE = 17000;
const MAX_PRICE = 170000;
const MAX_LATITUDE = 35.65;
const MIN_LATITUDE = 35.7;
const MAX_LONGITUDE = 139.7;
const MIN_LONGITUDE = 139.8;

const AD_TITLES = [
  'Дом на курьих ножках',
  'Красная комната Стенли Кубрика',
  'Страна чудес',
  'Домик в деревне',
  'Город грехов',
  'Дом, который построил Джек',
  'Беверли-Хиллз',
  'Место встречи',
  'Место под соснами',
  'Шалаш',
];

const HOUSING_TYPES = ['palace', 'flat', 'house', 'bungalow', 'hotel'];
const AVAILABLE_HOURS = ['12:00', '13:00', '14:00'];
const AVAILABLE_FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner',
];

const DESCRIPTIONS = [
  'Уютный и комфортабельный номер',
  'Отличный выбор для отдыха и работы',
  'Идеальное место для романтического отпуска',
  'Роскошное жилье с изысканным интерьером',
  'Место, где вы почувствуете себя как дома',
  'Близко к основным достопримечательностям',
  'Удобное расположение для активного отдыха',
  'Отель с высоким уровнем сервиса',
  'Стильное и современное жилье',
  'Тихое место для спокойного отдыха',
];

const PHOTOS = [
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/duonguyen-8LrGtIxxa4w.jpg',
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/brandon-hoogenboom-SNxQGWxZQi0.jpg',
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/claire-rendall-b6kAwr1i0Iw.jpg',
];

const TITLE_MAX_LENGTH = 100;
const TITLE_MIN_LENGTH = 30;
const MAXIMUM_PRICE = 100000;

const ERROR_TEXT_TITLE_MAX_LENGTH =
  'Слишком длинное название. Должно быть не более 100 символов';
const ERROR_TEXT_TITLE_MIN_LENGTH =
  'Слишком короткое название. Должно быть не менее 30 символов';
const ERROR_TEXT_FIRST_LETTER = 'Сообщение должно начинаться с заглавной буквы';
const ERROR_TEXT_MAX_PRICE = `Цена должна превышать ${MAXIMUM_PRICE}`;

const housingTypeToMinPriceMap = {
  bungalow: 0,
  flat: 1000,
  hotel: 3000,
  house: 5000,
  palace: 10000,
};

const roomCountToGuestCountMap = {
  1: [1],
  2: [1, 2],
  3: [1, 2, 3],
  100: [0],
};

export {
  NUMBER_OF_ADS,
  MAX_ROOMS,
  MAX_GUESTS,
  MIN_PRICE,
  MAX_PRICE,
  MAX_LATITUDE,
  MIN_LATITUDE,
  MAX_LONGITUDE,
  MIN_LONGITUDE,
  AD_TITLES,
  HOUSING_TYPES,
  AVAILABLE_HOURS,
  AVAILABLE_FEATURES,
  DESCRIPTIONS,
  PHOTOS,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
  ERROR_TEXT_TITLE_MAX_LENGTH,
  ERROR_TEXT_TITLE_MIN_LENGTH,
  housingTypeToMinPriceMap,
  roomCountToGuestCountMap,
  ERROR_TEXT_FIRST_LETTER,
  MAXIMUM_PRICE,
  ERROR_TEXT_MAX_PRICE,
};
