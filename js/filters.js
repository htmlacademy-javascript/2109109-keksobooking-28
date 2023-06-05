import { showFilteredData } from './map.js';
import { setElementAvailability } from './util.js';

const DEFAULT_FILTER_VALUE = 'any';
const filtersForm = document.querySelector('.map__filters');

const filters = {
  type: DEFAULT_FILTER_VALUE,
  price: DEFAULT_FILTER_VALUE,
  rooms: DEFAULT_FILTER_VALUE,
  guests: DEFAULT_FILTER_VALUE,
  features: [],
};

const priceRanges = {
  middle: {
    min: 10000,
    max: 50000,
  },
  low: {
    max: 10000,
  },
  high: {
    min: 50000,
  },
};

const filterData = (data) =>
  data.filter((item) => {
    const { type, price, rooms, guests, features } = filters;
    const { offer } = item;

    const isTypeValid = type === DEFAULT_FILTER_VALUE || offer.type === type;
    const isPriceValid =
      price === DEFAULT_FILTER_VALUE ||
      (price === 'middle' &&
        offer.price >= priceRanges.middle.min &&
        offer.price < priceRanges.middle.max) ||
      (price === 'low' && offer.price < priceRanges.low.max) ||
      (price === 'high' && offer.price >= priceRanges.high.min);
    const isRoomsValid =
      rooms === DEFAULT_FILTER_VALUE || offer.rooms === Number(rooms);
    const isGuestsValid =
      guests === DEFAULT_FILTER_VALUE || offer.guests === Number(guests);
    const areFeaturesValid =
      features.length === 0 ||
      (offer.features &&
        features.every((feature) => offer.features.includes(feature)));

    return (
      isTypeValid &&
      isPriceValid &&
      isRoomsValid &&
      isGuestsValid &&
      areFeaturesValid
    );
  });

const resetFilters = () => {
  filters.type = DEFAULT_FILTER_VALUE;
  filters.price = DEFAULT_FILTER_VALUE;
  filters.rooms = DEFAULT_FILTER_VALUE;
  filters.guests = DEFAULT_FILTER_VALUE;
  filters.features = [];
};

const resetForm = () => {
  filtersForm.reset();
  resetFilters();
  showFilteredData();
};

const disableFilters = () => {
  filtersForm.classList.add('map__filters--disabled');
  setElementAvailability('select', filtersForm, true);
  setElementAvailability('fieldset', filtersForm, true);
};

const enableFilters = () => {
  filtersForm.classList.remove('map__filters--disabled');
  setElementAvailability('select', filtersForm, false);
  setElementAvailability('fieldset', filtersForm, false);
};

filtersForm.addEventListener('change', (evt) => {
  const { target } = evt;
  const closestSelect = target.closest('select');
  const closestInput = target.closest('input');

  if (closestSelect) {
    const chosenFilter = closestSelect.id.replace(/housing-/g, '');
    filters[chosenFilter] = closestSelect.value;
  } else if (closestInput) {
    if (closestInput.checked) {
      filters.features.push(closestInput.value);
    } else {
      const index = filters.features.indexOf(closestInput.value);
      filters.features.splice(index, 1);
    }
  }

  showFilteredData();
});

disableFilters();

export { resetForm, enableFilters, filterData };
