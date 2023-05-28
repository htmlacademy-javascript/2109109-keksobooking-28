import { isMapInit, renderMarkers, resetMap } from './mapUtils.js';
import { getData, sendData } from './api.js';
import { showAlert, isEscapeKey, debounce } from './utility.js';

const MAX_PRICE = 100000;
const MIN_PRICE = {
  bungalow: 0,
  flat: 1000,
  hotel: 3000,
  house: 5000,
  palace: 10000,
};
const PRICE_SLIDER = {
  min: 0,
  max: 100000,
  step: 1000,
  start: 5000,
};
const CAPACITY = {
  1: [1],
  2: [1, 2],
  3: [1, 2, 3],
  100: [0],
};
const ALLOWED_FILE_TYPES = ['jpg', 'jpeg', 'png'];

const adForm = document.querySelector('.ad-form');
const mapFilters = document.querySelector('.map__filters');
const titleInput = adForm.querySelector('#title');
const priceInput = adForm.querySelector('#price');
const typeSelect = adForm.querySelector('#type');
const timeInSelect = adForm.querySelector('#timein');
const timeOutSelect = adForm.querySelector('#timeout');
const priceSlider = adForm.querySelector('#slider');
const roomSelect = adForm.querySelector('#room_number');
const capacitySelect = adForm.querySelector('#capacity');
const submitBtn = adForm.querySelector('.ad-form__submit');
const resetBtn = adForm.querySelector('.ad-form__reset');
const avatarInput = adForm.querySelector('#avatar');
const avatarPreview = adForm.querySelector('.ad-form-header__preview img');
const imagesInput = adForm.querySelector('#images');
const imagesPreview = adForm.querySelector('.ad-form__photo');
const filtersForm = document.querySelector('.map__filters');

const modalCases = ['error', 'success'];

const setInteractiveElementsAvailability = (
  selector,
  container = document,
  state = true,
) => {
  container.querySelectorAll(selector).forEach((element) => {
    element.disabled = state;
  });
};

const disableForm = () => {
  adForm.classList.add('ad-form--disabled');
  setInteractiveElementsAvailability('input', adForm, true);
  setInteractiveElementsAvailability('button', adForm, true);
};

const disableMapFilters = () => {
  mapFilters.classList.add('map__filters--disabled');
  setInteractiveElementsAvailability('select', mapFilters, true);
  setInteractiveElementsAvailability('fieldset', mapFilters, true);
};

const enableForm = () => {
  adForm.classList.remove('ad-form--disabled');
  setInteractiveElementsAvailability('input', adForm, false);
  setInteractiveElementsAvailability('button', adForm, false);
};

const enableMapFilters = () => {
  mapFilters.classList.remove('map__filters--disabled');
  setInteractiveElementsAvailability('select', mapFilters, false);
  setInteractiveElementsAvailability('fieldset', mapFilters, false);
};

disableForm();
disableMapFilters();

if (isMapInit) {
  enableForm();
  enableMapFilters();
}

const blockSubmitBtn = () => {
  submitBtn.disabled = true;
};

const unblockSubmitBtn = () => {
  submitBtn.disabled = false;
};

const closeModal = (result) => {
  document.querySelector(`.${result}`).remove();
  document.removeEventListener('keydown', onDocumentKeydown);
};

const showModal = (result) => {
  const modalTemplate = document
    .querySelector(`#${result}`)
    .content.querySelector(`.${result}`);
  const modalElement = modalTemplate.cloneNode(true);

  document.body.appendChild(modalElement);

  document.querySelector(`.${result}`).addEventListener('click', () => {
    closeModal(result);
  });
};

document.addEventListener('keydown', onDocumentKeydown);

const clearForm = () => {
  adForm.reset();
  filtersForm.reset();
  noUiSlider.reset();
};

const onSuccess = () => {
  clearForm();
  showModal('success');
};

const onError = () => showModal('error');

const isModalOpen = (modalName) => {
  const modal = document.querySelector(`${modalName}`);
  return modal !== null;
};

function onDocumentKeydown(evt) {
  if (isEscapeKey(evt) && !isModalOpen('error')) {
    evt.preventDefault();
  }

  modalCases.forEach((modalCase) => {
    if (isModalOpen(modalCase)) {
      closeModal(modalCase);
    }
  });
}

const pristine = new Pristine(adForm, {
  classTo: 'ad-form__element',
  errorClass: 'ad-form__element--invalid',
  errorTextParent: 'ad-form__element',
  errorTextTag: 'p',
  errorTextClass: 'text-help',
});

pristine.addValidator(
  titleInput,
  validateAdTitle,
  'Заголовок написан неправильно',
);

pristine.addValidator(
  priceInput,
  validateAdPrice,
  'Цена является несоответствующей',
);

pristine.addValidator(
  capacitySelect,
  validateCapacity,
  'Неподходящее количество гостей',
);

function validateAdTitle(value) {
  const exp = /[\w\d\s\n\W]{30,100}/i;
  return exp.test(value);
}

function validateAdPrice(value) {
  const exp = /[0-9]/g;
  const minPrice = MIN_PRICE[typeSelect.value];
  return exp.test(value) && value <= MAX_PRICE && value >= minPrice;
}

function validateCapacity(value) {
  return CAPACITY[roomSelect.value].includes(parseInt(value, 10));
}

typeSelect.addEventListener('change', () => {
  priceInput.placeholder = MIN_PRICE[typeSelect.value];
  pristine.validate(priceInput);
});

timeInSelect.addEventListener('change', (evt) => {
  const timeOutOptions = timeOutSelect.querySelectorAll('option');
  timeOutOptions.forEach((option) => {
    option.selected = option.value === evt.target.value;
  });
});

timeOutSelect.addEventListener('change', (evt) => {
  const timeInOptions = timeInSelect.querySelectorAll('option');
  timeInOptions.forEach((option) => {
    option.selected = option.value === evt.target.value;
  });
});

const setAdFormSubmit = debounce(() => {
  adForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const isValid = pristine.validate();

    if (isValid) {
      blockSubmitBtn();
      disableForm();
      disableMapFilters();
      sendData(new FormData(evt.target), onSuccess, onError)
        .then(unblockSubmitBtn)
        .then(enableForm)
        .then(resetMap)
        .finally(enableMapFilters);
      getData(renderMarkers, showAlert);
    }
  });
}, 500);

setAdFormSubmit();

noUiSlider.create(priceSlider, {
  range: {
    min: PRICE_SLIDER.min,
    max: PRICE_SLIDER.max,
  },
  start: PRICE_SLIDER.start,
  step: PRICE_SLIDER.step,
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

priceSlider.noUiSlider.on('update', () => {
  priceInput.value = priceSlider.noUiSlider.get();
  pristine.validate(priceInput);
});

roomSelect.addEventListener('change', () => {
  capacitySelect.value = CAPACITY[roomSelect.value][0];
  pristine.validate(capacitySelect);
});

avatarInput.addEventListener('change', () => {
  const file = avatarInput.files[0];
  const fileName = file.name.toLowerCase();

  const isFileTypeValid = ALLOWED_FILE_TYPES.some((type) =>
    fileName.endsWith(type),
  );

  if (isFileTypeValid) {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      avatarPreview.src = reader.result;
    });

    reader.readAsDataURL(file);
  }
});

imagesInput.addEventListener('change', () => {
  const file = imagesInput.files[0];
  const fileName = file.name.toLowerCase();

  const isFileTypeValid = ALLOWED_FILE_TYPES.some((type) =>
    fileName.endsWith(type),
  );

  if (isFileTypeValid) {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      const imageElement = document.createElement('img');
      imageElement.src = reader.result;
      imageElement.width = 70;
      imageElement.height = 70;
      imagesPreview.innerHTML = '';
      imagesPreview.appendChild(imageElement);
    });

    reader.readAsDataURL(file);
  }
});

resetBtn.addEventListener('click', (evt) => {
  evt.preventDefault();
  clearForm();
  resetMap();
  pristine.reset();
});

export { enableForm, enableMapFilters };
