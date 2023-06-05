import { checkIsMapInit, renderMarkers, resetMap } from './map.js';
import { getData, sendData } from './api.js';
import {
  showAlert,
  isEscapeKeyPressed,
  debounce,
  setElementAvailability,
} from './util.js';
import { resetForm } from './filters.js';

const TITLE_LENGTH = { min: 30, max: 100 };
const MAX_PRICE = 100000;

const MIN_PRICE = {
  bungalow: 0,
  flat: 1000,
  hotel: 3000,
  house: 5000,
  palace: 10000,
};

const SLIDER_SETTINGS = { min: 0, max: 100000, step: 1000, start: 1000 };
const CAPACITY_OPTIONS = { 1: [1], 2: [1, 2], 3: [1, 2, 3], 100: [0] };
const FILE_TYPES = ['jpg', 'jpeg', 'png'];

const ERROR_MESSAGES = {
  title: 'Длина заголовка должна быть от 30 до 100 символов',
  priceLow: (limit) =>
    `Для указанного типа жилья цена должна быть не менее ${limit} руб.`,
  priceHigh: `Цена не может быть более ${MAX_PRICE} руб.`,
  capacity: 'Не получится разместить такое количество гостей.',
};

const UPLOAD_PURPOSES = { avatar: 'avatar', photo: 'photo' };

const form = document.querySelector('.ad-form');
const title = form.querySelector('#title');
const price = form.querySelector('#price');
const type = form.querySelector('#type');
const timeIn = form.querySelector('#timein');
const timeOut = form.querySelector('#timeout');
const timeInOptions = timeIn.querySelectorAll('option');
const timeOutOptions = timeOut.querySelectorAll('option');
const slider = form.querySelector('#slider');
const roomNumber = form.querySelector('#room_number');
const capacity = form.querySelector('#capacity');
const submitBtn = form.querySelector('.ad-form__submit');
const resetBtn = form.querySelector('.ad-form__reset');
const uploadAvatar = form.querySelector('#avatar');
const avatarPreview = form.querySelector('.ad-form-header__preview img');
const uploadImages = form.querySelector('#images');
const imagesPreview = form.querySelector('.ad-form__photo');

const modals = ['error', 'success'];

const disableForm = () => {
  form.classList.add('ad-form--disabled');
  setElementAvailability('input', form, true);
  setElementAvailability('button', form, true);
};

const enableForm = () => {
  form.classList.remove('ad-form--disabled');
  setElementAvailability('input', form, false);
  setElementAvailability('button', form, false);
};

const blockSubmitBtn = () => {
  submitBtn.disabled = true;
};

const unblockSubmitBtn = () => {
  submitBtn.disabled = false;
};

const closeModal = (modal) => {
  document.querySelector(`.${modal}`).remove();
  document.removeEventListener('keydown', onDocumentKeydown);
};

const showModal = (modal) => {
  const template = document
    .querySelector(`#${modal}`)
    .content.querySelector(`.${modal}`);
  const element = template.cloneNode(true);

  element.addEventListener('click', () => {
    closeModal(modal);
  });

  document.body.appendChild(element);

  document.addEventListener('keydown', onDocumentKeydown);
};

const clearForm = () => {
  form.reset();
  resetForm();
  slider.noUiSlider.reset();
};

const handleSuccess = () => {
  clearForm();
  showModal('success');
};

const handleError = () => {
  showModal('error');
};

const isModalOpen = (modal) => {
  const element = document.querySelector(`.${modal}`);
  return element !== null;
};

function onDocumentKeydown(evt) {
  if (isEscapeKeyPressed(evt) && !isModalOpen('error')) {
    evt.preventDefault();
  }

  modals.forEach((modal) => {
    if (isModalOpen(modal)) {
      closeModal(modal);
    }
  });
}

const pristine = new Pristine(form, {
  classTo: 'ad-form__element',
  errorClass: 'ad-form__element--invalid',
  errorTextParent: 'ad-form__element',
  errorTextTag: 'p',
  errorTextClass: 'text-help',
});

const validateTitle = (value) => {
  const regex = /[\w\d\s\n\W]/i;
  return (
    regex.test(value) &&
    value.length >= TITLE_LENGTH.min &&
    value.length <= TITLE_LENGTH.max
  );
};

const validateLowPrice = (value) => {
  const regex = /[0-9]/g;
  const minPrice = MIN_PRICE[type.value];
  return regex.test(value) && value >= minPrice;
};

const validateHighPrice = (value) => {
  const regex = /[0-9]/g;
  return regex.test(value) && value <= MAX_PRICE;
};

const validateCapacity = (value) =>
  CAPACITY_OPTIONS[roomNumber.value].includes(Number(value));

const setFormSubmit = () => {
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const isValid = pristine.validate();

    if (isValid) {
      const data = new FormData(evt.target);
      blockSubmitBtn();
      disableForm();

      sendData(data, handleSuccess, handleError).then(() => {
        unblockSubmitBtn();
        enableForm();
        resetMap();
      });

      getData(renderMarkers, showAlert);
    }
  });
};

const createImageBlock = (url, parent) => {
  const img = document.createElement('img');
  img.src = url;
  img.width = '70';
  img.height = '70';
  img.style.objectFit = 'contain';
  parent.appendChild(img);
};

const uploadImage = (uploadField, previewBlock, purpose) => {
  const file = uploadField.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((ft) => fileName.endsWith(ft));

  if (matches) {
    if (purpose === UPLOAD_PURPOSES.avatar) {
      previewBlock.src = URL.createObjectURL(file);
    } else if (purpose === UPLOAD_PURPOSES.photo) {
      previewBlock.innerHTML = '';
      createImageBlock(URL.createObjectURL(file), previewBlock);
    }
  }
};

disableForm();

if (checkIsMapInit()) {
  enableForm();
}

pristine.addValidator(title, validateTitle, ERROR_MESSAGES.title);
pristine.addValidator(price, validateLowPrice, () =>
  ERROR_MESSAGES.priceLow(MIN_PRICE[type.value]),
);
pristine.addValidator(price, validateHighPrice, ERROR_MESSAGES.priceHigh);
pristine.addValidator(capacity, validateCapacity, ERROR_MESSAGES.capacity);

timeIn.addEventListener('change', (evt) => {
  timeOutOptions.forEach((option) => {
    option.selected = option.value === evt.target.value;
  });
});

timeOut.addEventListener('change', (evt) => {
  timeInOptions.forEach((option) => {
    option.selected = option.value === evt.target.value;
  });
});

noUiSlider.create(slider, {
  range: {
    min: SLIDER_SETTINGS.min,
    max: SLIDER_SETTINGS.max,
  },
  start: SLIDER_SETTINGS.start,
  step: SLIDER_SETTINGS.step,
  connect: 'lower',
  format: {
    to: function (value) {
      return value.toFixed(0);
    },
    from: function (value) {
      return parseFloat(value).toFixed(2);
    },
  },
});

slider.noUiSlider.on('update', () => {
  price.value = slider.noUiSlider.get();
  pristine.validate(price);
});

price.addEventListener('input', () => {
  slider.noUiSlider.set(price.value);
  price.placeholder = MIN_PRICE[type.value];
  pristine.validate(price);
});

capacity.addEventListener('change', () => {
  pristine.validate(capacity);
});

roomNumber.addEventListener('change', () => {
  pristine.validate(capacity);
});

resetBtn.addEventListener('click', () => {
  clearForm();
  debounce(() => resetMap())();
});

uploadAvatar.addEventListener('change', () => {
  uploadImage(uploadAvatar, avatarPreview, 'avatar');
});

uploadImages.addEventListener('change', () => {
  uploadImage(uploadImages, imagesPreview, 'photo');
});

setFormSubmit();
