import { housingTypeCaptions } from './thumbnails.js';
import {
  MAX_TITLE_LENGTH,
  MIN_TITLE_LENGTH,
  ERROR_TEXT_MAX_TITLE_LENGTH,
  ERROR_TEXT_MIN_TITLE_LENGTH,
  ERROR_TEXT_FIRST_LETTER,
  housingTypeToMinPrice,
  roomCountToGuestCount,
  MAX_PRICE,
  ERROR_TEXT_MAX_PRICE,
} from './const.js';
import { sendData } from './fetch.js';
import { showSuccessMessage, showErrorMessage } from './messages.js';
import { closePopup, resetMarker, resetFieldAddress } from './map.js';

const uploadForm = document.querySelector('.ad-form');
const fieldTitle = uploadForm.querySelector('#title');
const fieldPrice = uploadForm.querySelector('#price');
const selectHousingType = uploadForm.querySelector('#type');
const amountRooms = uploadForm.querySelector('#room_number');
const amountGuests = uploadForm.querySelector('#capacity');
const selectTimeIn = uploadForm.querySelector('#timein');
const selectTimeOut = uploadForm.querySelector('#timeout');
const priceSlider = document.querySelector('.ad-form__slider');
const uploadSubmitButton = document.querySelector('.ad-form__submit');
const resetButton = document.querySelector('.ad-form__reset');

function disableSubmitButton(disable) {
  uploadSubmitButton.disabled = disable;
}

const pristineForm = new Pristine(uploadForm, {
  classTo: 'ad-form__element',
  errorTextParent: 'ad-form__element',
  errorClass: 'ad-form__element--invalid',
  errorTextClass: 'text-help',
});

function isTitleShortEnough(title) {
  return title.length <= MAX_TITLE_LENGTH;
}

function isTitleLongEnough(title) {
  return title.length >= MIN_TITLE_LENGTH;
}

function validateTitleFirstLetter(title) {
  return title.length > 0 && title[0] === title[0].toUpperCase();
}

function validateMaxPrice(value) {
  return value <= MAX_PRICE;
}

function validateMinPrice(value) {
  const selectedHousingType = selectHousingType.value;
  return value >= housingTypeToMinPrice[selectedHousingType];
}

function onHousingTypeChange() {
  const newMinPrice = housingTypeToMinPrice[selectHousingType.value];
  fieldPrice.placeholder = newMinPrice;
  if (fieldPrice.value !== '') {
    pristineForm.validate(fieldPrice);
  }
  priceSlider.noUiSlider.updateOptions({ start: newMinPrice });
}

function getPriceErrorMessage() {
  const selectedHousingType = selectHousingType.value;
  return `Минимальная цена типа жилья "${housingTypeCaptions[selectedHousingType]}" - ${housingTypeToMinPrice[selectedHousingType]} за ночь`;
}

function validateAmountGuests() {
  const guests = Number(amountGuests.value);
  const rooms = Number(amountRooms.value);
  return roomCountToGuestCount[rooms].includes(guests);
}

function validateSelectors() {
  pristineForm.validate(amountRooms);
  pristineForm.validate(amountGuests);
}

function onChangeTime(evt, target) {
  target.value = evt.target.value;
}

selectHousingType.addEventListener('change', onHousingTypeChange);
selectHousingType.addEventListener('change', validateMinPrice);
amountRooms.addEventListener('change', validateSelectors);
amountGuests.addEventListener('change', validateSelectors);
selectTimeIn.addEventListener('change', (evt) =>
  onChangeTime(evt, selectTimeOut),
);
selectTimeOut.addEventListener('change', (evt) =>
  onChangeTime(evt, selectTimeIn),
);

function onResetAll() {
  disableSubmitButton(false);
  uploadForm.reset();
  closePopup();
  resetMarker();
  resetFieldAddress();
}

resetButton.addEventListener('click', onResetAll);

uploadForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const isValid = pristineForm.validate();
  if (isValid) {
    disableSubmitButton(true);
    const formData = new FormData(evt.target);
    try {
      await sendData(formData);
      showSuccessMessage();
    } catch {
      showErrorMessage();
    }
  }
});

pristineForm.addValidator(
  fieldTitle,
  validateTitleFirstLetter,
  ERROR_TEXT_FIRST_LETTER,
  1,
  true,
);

pristineForm.addValidator(
  fieldTitle,
  isTitleShortEnough,
  ERROR_TEXT_MAX_TITLE_LENGTH,
);

pristineForm.addValidator(
  fieldTitle,
  isTitleLongEnough,
  ERROR_TEXT_MIN_TITLE_LENGTH,
);

pristineForm.addValidator(fieldPrice, validateMinPrice, getPriceErrorMessage);
pristineForm.addValidator(fieldPrice, validateMaxPrice, ERROR_TEXT_MAX_PRICE);

pristineForm.addValidator(
  amountGuests,
  validateAmountGuests,
  'Неподходящее количество гостей',
);

noUiSlider.create(priceSlider, {
  range: { min: 0, max: 100000 },
  start: 1000,
  step: 1,
  connect: 'lower',
});

function onUpdatePriceSlider() {
  fieldPrice.value = priceSlider.noUiSlider.get().split('.')[0];
  pristineForm.validate(fieldPrice);
}

priceSlider.noUiSlider.on('update', onUpdatePriceSlider);

export { onResetAll, disableSubmitButton };
