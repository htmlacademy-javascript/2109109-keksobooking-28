const adForm = document.querySelector('.ad-form');
const formFields = adForm.querySelectorAll('fieldset');
const mapFilter = document.querySelector('.map__filters');
const filterElements = mapFilter.querySelectorAll('select, fieldset');

function activateWebPage() {
  adForm.classList.remove('ad-form--disabled');
  mapFilter.classList.remove('map__filters--disabled');
  enableFormElements(formFields);
}

function deactivateWebPage() {
  adForm.classList.add('ad-form--disabled');
  mapFilter.classList.add('map__filters--disabled');
  disableFormElements(formFields);
  disableFormElements(filterElements);
}

function activateFilters() {
  enableFormElements(filterElements);
}

function enableFormElements(elements) {
  elements.forEach((element) => {
    element.removeAttribute('disabled');
  });
}

function disableFormElements(elements) {
  elements.forEach((element) => {
    element.setAttribute('disabled', true);
  });
}

deactivateWebPage();

export { activateWebPage, deactivateWebPage, activateFilters };
