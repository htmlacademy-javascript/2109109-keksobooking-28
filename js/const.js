const ALERT_SHOW_TIME = 5000;
const MAX_TITLE_LENGTH = 100;
const MIN_TITLE_LENGTH = 30;
const MAX_PRICE = 170000;
const ERROR_TEXT_MAX_TITLE_LENGTH =
  'Слишком длинное название. Должно быть не более 100 символов';
const ERROR_TEXT_MIN_TITLE_LENGTH =
  'Слишком короткое название. Должно быть не менее 30 символов';
const ERROR_TEXT_FIRST_LETTER = 'Сообщение должно начинаться с заглавной буквы';
const ERROR_TEXT_MAX_PRICE = `Цена должна превышать ${MAX_PRICE}`;

const housingTypeToMinPrice = {
  bungalow: 0,
  flat: 1000,
  hotel: 3000,
  house: 5000,
  palace: 10000,
};

const roomCountToGuestCount = {
  1: [1],
  2: [1, 2],
  3: [1, 2, 3],
  100: [0],
};

export {
  MAX_TITLE_LENGTH,
  MIN_TITLE_LENGTH,
  ERROR_TEXT_MAX_TITLE_LENGTH,
  ERROR_TEXT_MIN_TITLE_LENGTH,
  housingTypeToMinPrice,
  roomCountToGuestCount,
  ERROR_TEXT_FIRST_LETTER,
  MAX_PRICE,
  ERROR_TEXT_MAX_PRICE,
  ALERT_SHOW_TIME,
};
