import { housingTypeCaptions } from './thumbnails.js';
import {
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
  ERROR_TEXT_TITLE_MAX_LENGTH,
  ERROR_TEXT_TITLE_MIN_LENGTH,
  ERROR_TEXT_FIRST_LETTER,
  housingTypeToMinPriceMap,
  roomCountToGuestCountMap,
  MAX_PRICE,
  ERROR_TEXT_MAX_PRICE,
} from './const.js';

const uploadForm = document.querySelector('.ad-form');
const titleInput = uploadForm.querySelector('#title');
const priceInput = uploadForm.querySelector('#price');
const housingTypeSelect = uploadForm.querySelector('#type');
const roomsNumberInput = uploadForm.querySelector('#room_number');
const guestsNumberInput = uploadForm.querySelector('#capacity');
const timeInSelect = uploadForm.querySelector('#timein');
const timeOutSelect = uploadForm.querySelector('#timeout');
const priceSlider = document.querySelector('.ad-form__slider');

const pristine = new Pristine(uploadForm, {
  classTo: 'ad-form__element',
  errorTextParent: 'ad-form__element',
  errorClass: 'ad-form__element--invalid',
  errorTextClass: 'text-help',
});

// Title validation functions
function isTitleLongEnough(string) {
  return string.length >= TITLE_MIN_LENGTH;
}

function isTitleShortEnough(string) {
  return string.length <= TITLE_MAX_LENGTH;
}

function validateTitleFirstLetter(string) {
  return string.length !== 0 && string[0] === string[0].toUpperCase();
}

// Price validation functions
function validateMaxPrice(value) {
  return value <= MAX_PRICE;
}

function validateMinPrice(value) {
  const typeValue = housingTypeSelect.value;
  return value >= housingTypeToMinPriceMap[typeValue];
}

// Event handlers
function onHousingTypeChange() {
  const newMinPrice = housingTypeToMinPriceMap[this.value];
  priceInput.placeholder = newMinPrice;
  if (priceInput.value !== '') {
    pristine.validate(priceInput);
  }
  priceSlider.noUiSlider.updateOptions({
    start: newMinPrice,
  });
}

function getPriceErrorMessage() {
  const typeValue = housingTypeSelect.value;
  return `Минимальная цена типа жилья "${housingTypeCaptions[typeValue]}" - ${housingTypeToMinPriceMap[typeValue]} за ночь`;
}

function validateGuestsNumber() {
  return roomCountToGuestCountMap[Number(roomsNumberInput.value)].includes(
    Number(guestsNumberInput.value),
  );
}

function validateSelectors() {
  pristine.validate(roomsNumberInput);
  pristine.validate(guestsNumberInput);
}

function onChangeTimeOut(evt) {
  const newValue = evt.target.value;
  timeOutSelect.value = newValue;
}

function onChangeTimeIn(evt) {
  const newValue = evt.target.value;
  timeInSelect.value = newValue;
}

function onUpdatePriceSlider() {
  priceInput.value = priceSlider.noUiSlider.get().split('.')[0];
  pristine.validate(priceInput);
}

// Event listeners
housingTypeSelect.addEventListener('change', onHousingTypeChange);
housingTypeSelect.addEventListener('change', validateMinPrice);
roomsNumberInput.addEventListener('change', validateSelectors);
guestsNumberInput.addEventListener('change', validateSelectors);
timeInSelect.addEventListener('change', onChangeTimeOut);
timeOutSelect.addEventListener('change', onChangeTimeIn);

uploadForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const isFormValid = pristine.validate();
  if (isFormValid) {
    uploadForm.submit();
  }
});

pristine.addValidator(
  titleInput,
  validateTitleFirstLetter,
  ERROR_TEXT_FIRST_LETTER,
  1,
  true,
);
pristine.addValidator(
  titleInput,
  isTitleLongEnough,
  ERROR_TEXT_TITLE_MIN_LENGTH,
);

pristine.addValidator(
  titleInput,
  isTitleShortEnough,
  ERROR_TEXT_TITLE_MAX_LENGTH,
);

pristine.addValidator(priceInput, validateMinPrice, getPriceErrorMessage);
pristine.addValidator(priceInput, validateMaxPrice, ERROR_TEXT_MAX_PRICE);

pristine.addValidator(
  guestsNumberInput,
  validateGuestsNumber,
  'Неподходящее количество гостей',
);

noUiSlider.create(priceSlider, {
  range: {
    min: 0,
    max: 100000,
  },
  start: 1000,
  step: 1,
  connect: 'lower',
});

priceSlider.noUiSlider.on('update', onUpdatePriceSlider);
