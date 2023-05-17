const adForm = document.querySelector('.ad-form');
const formFields = adForm.querySelectorAll('fieldset');
const mapFilter = document.querySelector('.map__filters');
const filterElements = mapFilter.querySelectorAll('select, fieldset');

function activateWebPage() {
  adForm.classList.remove('ad-form--disabled');
  mapFilter.classList.remove('map__filters--disabled');
  formFields.forEach((field) => field.removeAttribute('disabled'));
  filterElements.forEach((element) => element.removeAttribute('disabled'));
}

function deactivateWebPage() {
  adForm.classList.add('ad-form--disabled');
  mapFilter.classList.add('map__filters--disabled');
  formFields.forEach((field) => field.setAttribute('disabled', true));
  filterElements.forEach((element) => element.setAttribute('disabled', true));
}

deactivateWebPage();
export { activateWebPage, deactivateWebPage };
